package com.blueceylon.booking_service.domain.repository;

import com.blueceylon.booking_service.domain.model.Booking;
import com.blueceylon.booking_service.domain.model.enums.ItemType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, String> {

    List<Booking> findByUserId(String userId);

    List<Booking> findByBusinessId(String businessId);

    @Query("SELECT b FROM Booking b WHERE b.itemType = :itemType AND b.itemId = :itemId AND " +
           "(b.checkInDate < :checkOutDate AND b.checkOutDate > :checkInDate) AND b.status IN ('PENDING', 'CONFIRMED')")
    List<Booking> findOverlappingBookings(
            @Param("itemType") ItemType itemType,
            @Param("itemId") String itemId,
            @Param("checkInDate") LocalDate checkInDate,
            @Param("checkOutDate") LocalDate checkOutDate);
}
