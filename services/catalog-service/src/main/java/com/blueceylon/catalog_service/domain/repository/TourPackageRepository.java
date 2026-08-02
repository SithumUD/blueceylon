package com.blueceylon.catalog_service.domain.repository;
import com.blueceylon.catalog_service.domain.model.TourPackage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TourPackageRepository extends JpaRepository<TourPackage, String> {
    List<TourPackage> findByOwnerId(String ownerId);
    
    @org.springframework.data.jpa.repository.Query("SELECT t FROM TourPackage t WHERE " +
           "(:city IS NULL OR t.startingCity = :city) AND " +
           "(:category IS NULL OR t.category = :category) AND " +
           "(:ownerType IS NULL OR t.ownerType = :ownerType) AND " +
           "t.price BETWEEN :minPrice AND :maxPrice")
    org.springframework.data.domain.Page<TourPackage> searchTours(
            @org.springframework.data.repository.query.Param("city") com.blueceylon.catalog_service.domain.model.enums.SriLankanCity city,
            @org.springframework.data.repository.query.Param("category") com.blueceylon.catalog_service.domain.model.enums.TourCategory category,
            @org.springframework.data.repository.query.Param("ownerType") com.blueceylon.catalog_service.domain.model.enums.OwnerType ownerType,
            @org.springframework.data.repository.query.Param("minPrice") Double minPrice,
            @org.springframework.data.repository.query.Param("maxPrice") Double maxPrice,
            org.springframework.data.domain.Pageable pageable);
}
