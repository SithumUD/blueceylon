package com.blueceylon.booking_service.application.service;

import com.blueceylon.booking_service.domain.model.Booking;
import com.blueceylon.booking_service.domain.model.enums.BookingStatus;
import com.blueceylon.booking_service.domain.repository.BookingRepository;
import com.blueceylon.booking_service.domain.repository.IdempotencyRecordRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class BookingSweeperService {

    private final BookingRepository bookingRepository;
    private final AvailabilityService availabilityService;
    private final IdempotencyRecordRepository idempotencyRepository;

    public BookingSweeperService(BookingRepository bookingRepository, 
                                 AvailabilityService availabilityService, 
                                 IdempotencyRecordRepository idempotencyRepository) {
        this.bookingRepository = bookingRepository;
        this.availabilityService = availabilityService;
        this.idempotencyRepository = idempotencyRepository;
    }

    @Scheduled(fixedRate = 60000) // Run every minute
    @Transactional
    public void expireStaleHolds() {
        // In a real app we'd need a custom query in BookingRepository, but for MVP we fetch all HELD
        List<Booking> heldBookings = bookingRepository.findAll().stream()
            .filter(b -> b.getStatus() == BookingStatus.HELD && b.getHoldExpiresAt() != null && b.getHoldExpiresAt().isBefore(Instant.now()))
            .collect(java.util.stream.Collectors.toList());

        for (Booking booking : heldBookings) {
            availabilityService.releaseHold(booking);
            booking.setStatus(BookingStatus.EXPIRED);
            bookingRepository.save(booking);
        }
    }

    @Scheduled(cron = "0 0 3 * * *") // Run daily at 3am
    @Transactional
    public void purgeOldIdempotencyKeys() {
        idempotencyRepository.deleteByCreatedAtBefore(Instant.now().minus(24, ChronoUnit.HOURS));
    }
}
