package com.blueceylon.catalog_service.domain.repository;
import com.blueceylon.catalog_service.domain.model.DayOutPackage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DayOutPackageRepository extends JpaRepository<DayOutPackage, String> {
    List<DayOutPackage> findByHotelId(String hotelId);
}
