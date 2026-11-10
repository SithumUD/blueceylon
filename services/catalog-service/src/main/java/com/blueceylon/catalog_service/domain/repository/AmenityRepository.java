package com.blueceylon.catalog_service.domain.repository;

import com.blueceylon.catalog_service.domain.model.Amenity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AmenityRepository extends JpaRepository<Amenity, String> {
    Optional<Amenity> findByCode(String code);
    boolean existsByCode(String code);
}
