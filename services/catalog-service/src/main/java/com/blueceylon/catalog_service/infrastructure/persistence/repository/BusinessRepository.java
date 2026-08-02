package com.blueceylon.catalog_service.infrastructure.persistence.repository;

import com.blueceylon.catalog_service.domain.model.Business;
import com.blueceylon.catalog_service.domain.model.enums.ApprovalStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BusinessRepository extends JpaRepository<Business, String> {
    Optional<Business> findByOwnerId(String ownerId);
    boolean existsByOwnerId(String ownerId);
    List<Business> findByStatus(ApprovalStatus status);
    
    @org.springframework.data.jpa.repository.Query("SELECT b FROM Business b WHERE " +
           "(:type IS NULL OR b.type = :type) AND " +
           "(:city IS NULL OR b.city = :city) AND " +
           "b.status = 'APPROVED'")
    org.springframework.data.domain.Page<Business> searchBusinesses(
            @org.springframework.data.repository.query.Param("type") com.blueceylon.catalog_service.domain.model.enums.BusinessType type,
            @org.springframework.data.repository.query.Param("city") com.blueceylon.catalog_service.domain.model.enums.SriLankanCity city,
            org.springframework.data.domain.Pageable pageable);
}
