package com.blueceylon.catalog_service.domain.repository;
import com.blueceylon.catalog_service.domain.model.HourlyRoomBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface HourlyRoomBookingRepository extends JpaRepository<HourlyRoomBooking, String> {
    List<HourlyRoomBooking> findByRoomHotelId(String hotelId);
    List<HourlyRoomBooking> findByRoomId(String roomId);
}
