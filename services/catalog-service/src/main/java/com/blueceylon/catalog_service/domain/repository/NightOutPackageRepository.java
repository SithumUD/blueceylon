package com.blueceylon.catalog_service.domain.repository;
import com.blueceylon.catalog_service.domain.model.NightOutPackage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NightOutPackageRepository extends JpaRepository<NightOutPackage, String> {
    List<NightOutPackage> findByHotelId(String hotelId);
}
