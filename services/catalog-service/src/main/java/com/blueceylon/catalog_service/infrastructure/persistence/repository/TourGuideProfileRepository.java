package com.blueceylon.catalog_service.infrastructure.persistence.repository;

import com.blueceylon.catalog_service.domain.model.TourGuideProfile;
import com.blueceylon.catalog_service.domain.model.enums.ApprovalStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TourGuideProfileRepository extends JpaRepository<TourGuideProfile, String> {
    Optional<TourGuideProfile> findByUserId(String userId);
    boolean existsByUserId(String userId);
    List<TourGuideProfile> findByStatus(ApprovalStatus status);

    @org.springframework.data.jpa.repository.Query("SELECT g FROM TourGuideProfile g WHERE " +
           "(:city IS NULL OR g.city = :city) AND " +
           "g.status = 'APPROVED'")
    org.springframework.data.domain.Page<TourGuideProfile> searchGuides(
            @org.springframework.data.repository.query.Param("city") com.blueceylon.catalog_service.domain.model.enums.SriLankanCity city,
            org.springframework.data.domain.Pageable pageable);
}
