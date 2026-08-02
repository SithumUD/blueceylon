package com.blueceylon.catalog_service.domain.repository;
import com.blueceylon.catalog_service.domain.model.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, String> {
    List<Room> findByHotelId(String hotelId);
    
    @org.springframework.data.jpa.repository.Query("SELECT r FROM Room r WHERE " +
           "(:city IS NULL OR r.city = :city) AND " +
           "r.pricePerNight BETWEEN :minPrice AND :maxPrice AND " +
           "r.hotel.status = 'APPROVED'")
    org.springframework.data.domain.Page<Room> searchRooms(
            @org.springframework.data.repository.query.Param("city") com.blueceylon.catalog_service.domain.model.enums.SriLankanCity city,
            @org.springframework.data.repository.query.Param("minPrice") Double minPrice,
            @org.springframework.data.repository.query.Param("maxPrice") Double maxPrice,
            org.springframework.data.domain.Pageable pageable);
}
