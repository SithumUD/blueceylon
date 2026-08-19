package com.blueceylon.booking_service.infrastructure.scheduler;

import com.blueceylon.booking_service.application.service.AvailabilityService;
import com.blueceylon.booking_service.domain.model.Booking;
import com.blueceylon.booking_service.domain.model.enums.BookingStatus;
import com.blueceylon.booking_service.domain.repository.BookingRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Component
public class BookingSweeperScheduler {

    private final BookingRepository bookingRepository;
    private final AvailabilityService availabilityService;

    public BookingSweeperScheduler(BookingRepository bookingRepository, AvailabilityService availabilityService) {
        this.bookingRepository = bookingRepository;
        this.availabilityService = availabilityService;
    }

    @Scheduled(fixedRate = 60000)
    @Transactional
    public void expireStaleHolds() {
        List<Booking> expiredBookings = bookingRepository
                .findByStatusAndHoldExpiresAtBefore(BookingStatus.HELD, Instant.now());

        for (Booking booking : expiredBookings) {
            try {
                availabilityService.releaseHold(booking);
                booking.setStatus(BookingStatus.EXPIRED);
                bookingRepository.save(booking);
            } catch (Exception e) {
                // Log exception silently to allow loop to continue for other holds
                System.err.println("Failed to expire hold for booking: " + booking.getId() + " - " + e.getMessage());
            }
        }
    }
}
