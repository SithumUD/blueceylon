package com.blueceylon.booking_service.application.service;

import com.blueceylon.booking_service.domain.model.Booking;
import com.blueceylon.booking_service.domain.model.enums.BookingStatus;
import com.blueceylon.booking_service.domain.model.enums.Currency;
import com.blueceylon.booking_service.domain.repository.BookingRepository;
import com.blueceylon.booking_service.infrastructure.client.CatalogClient;
import com.blueceylon.booking_service.infrastructure.client.dto.CatalogItemDto;
import com.blueceylon.booking_service.presentation.dto.request.BookingRequest;
import com.blueceylon.booking_service.presentation.dto.response.BookingResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

import com.blueceylon.booking_service.infrastructure.messaging.BookingNotificationPublisher;

@Service
public class BookingApplicationService {

    private final BookingRepository bookingRepository;
    private final AvailabilityService availabilityService;
    private final CatalogClient catalogClient;
    private final BookingNotificationPublisher publisher;

    public BookingApplicationService(BookingRepository bookingRepository, 
                                     AvailabilityService availabilityService,
                                     CatalogClient catalogClient,
                                     BookingNotificationPublisher publisher) {
        this.bookingRepository = bookingRepository;
        this.availabilityService = availabilityService;
        this.catalogClient = catalogClient;
        this.publisher = publisher;
    }

    @Transactional
    public BookingResponse createBooking(String userId, BookingRequest request) {
        // 1. Check availability and create Soft Hold atomically in Ledger
        availabilityService.tryReserveDateRange(
                request.getItemType(),
                request.getItemId(),
                request.getCheckInDate(),
                request.getCheckOutDate(),
                request.getQuantity(),
                request.getGuestCount()
        );

        // 2. Fetch price and calculate total amount
        CatalogItemDto item = catalogClient.getItem(request.getItemType(), request.getItemId());
        Double price = item.getNormalizedPrice();
        
        long multiplier = 1;
        if (request.getCheckInDate() != null && request.getCheckOutDate() != null) {
            multiplier = ChronoUnit.DAYS.between(request.getCheckInDate(), request.getCheckOutDate());
            if (multiplier == 0) multiplier = 1; // E.g. day out package
        }
        
        Double totalAmount = price * request.getQuantity() * multiplier;

        // 3. Create Booking in INITIATED/HELD state
        Booking booking = new Booking();
        booking.setUserId(userId);
        booking.setBusinessId(request.getBusinessId());
        booking.setItemType(request.getItemType());
        booking.setItemId(request.getItemId());
        booking.setCheckInDate(request.getCheckInDate());
        booking.setCheckOutDate(request.getCheckOutDate());
        booking.setStartTime(request.getStartTime());
        booking.setEndTime(request.getEndTime());
        booking.setQuantity(request.getQuantity());
        booking.setGuestCount(request.getGuestCount());
        booking.setPaymentMethod(request.getPaymentMethod());
        booking.setTotalAmount(totalAmount);
        booking.setCurrency(Currency.LKR);
        
        // Soft hold expires in 15 minutes
        booking.setStatus(BookingStatus.HELD);
        booking.setHoldExpiresAt(Instant.now().plus(15, ChronoUnit.MINUTES));

        // For MVP, if it's PAY_AT_PROPERTY, it's instantly CONFIRMED.
        switch(request.getPaymentMethod()) {
            case PAY_AT_PROPERTY:
            case BANK_TRANSFER:
                booking.setStatus(BookingStatus.CONFIRMED);
                availabilityService.confirmHold(booking); // Convert Held units to Booked units
                break;
            default:
                break; // Remains HELD
        }

        Booking saved = bookingRepository.save(booking);
        
        // For MVP, we derive dummy emails or assume the client will provide them. 
        if (booking.getStatus() == BookingStatus.CONFIRMED) {
            String customerEmail = userId + "@blueceylon.user.com";
            String businessEmail = request.getBusinessId() + "@blueceylon.business.com";
            publisher.publishBookingConfirmedEvent(saved, customerEmail, businessEmail);
        }
        
        return mapToResponse(saved);
    }

    public List<BookingResponse> getMyBookings(String userId) {
        return bookingRepository.findByUserId(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<BookingResponse> getBusinessBookings(String businessId) {
        return bookingRepository.findByBusinessId(businessId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public BookingResponse cancelBooking(String userId, String bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        if (!booking.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized to cancel this booking");
        }

        if (booking.getStatus() == BookingStatus.CANCELLED || booking.getStatus() == BookingStatus.COMPLETED) {
            throw new RuntimeException("Booking cannot be cancelled in state: " + booking.getStatus());
        }

        availabilityService.releaseHold(booking);
        booking.setStatus(BookingStatus.CANCELLED);
        Booking saved = bookingRepository.save(booking);
        return mapToResponse(saved);
    }

    @Transactional
    public BookingResponse updateBookingStatus(String businessId, String bookingId, BookingStatus newStatus) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (newStatus == BookingStatus.CANCELLED) {
            availabilityService.releaseHold(booking);
        } else if (newStatus == BookingStatus.CONFIRMED && booking.getStatus() == BookingStatus.HELD) {
            availabilityService.confirmHold(booking);
        }

        booking.setStatus(newStatus);
        Booking saved = bookingRepository.save(booking);
        return mapToResponse(saved);
    }

    private BookingResponse mapToResponse(Booking booking) {
        BookingResponse response = new BookingResponse();
        response.setId(booking.getId());
        response.setUserId(booking.getUserId());
        response.setBusinessId(booking.getBusinessId());
        response.setItemType(booking.getItemType());
        response.setItemId(booking.getItemId());
        response.setCheckInDate(booking.getCheckInDate());
        response.setCheckOutDate(booking.getCheckOutDate());
        response.setStartTime(booking.getStartTime());
        response.setEndTime(booking.getEndTime());
        response.setQuantity(booking.getQuantity());
        response.setGuestCount(booking.getGuestCount());
        response.setTotalAmount(booking.getTotalAmount());
        response.setCurrency(booking.getCurrency());
        response.setStatus(booking.getStatus());
        response.setPaymentMethod(booking.getPaymentMethod());
        return response;
    }
}
