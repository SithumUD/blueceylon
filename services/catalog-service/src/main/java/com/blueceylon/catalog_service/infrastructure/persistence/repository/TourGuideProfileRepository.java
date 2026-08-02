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
}
