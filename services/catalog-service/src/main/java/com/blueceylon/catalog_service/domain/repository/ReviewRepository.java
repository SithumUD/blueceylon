package com.blueceylon.catalog_service.domain.repository;

import com.blueceylon.catalog_service.domain.model.Review;
import com.blueceylon.catalog_service.domain.model.enums.ReviewEntityType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewRepository extends JpaRepository<Review, String> {

    Page<Review> findByEntityIdAndEntityType(String entityId, ReviewEntityType entityType, Pageable pageable);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.entityId = :entityId AND r.entityType = :entityType")
    Double getAverageRating(@Param("entityId") String entityId, @Param("entityType") ReviewEntityType entityType);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.entityId = :entityId AND r.entityType = :entityType")
    long countReviews(@Param("entityId") String entityId, @Param("entityType") ReviewEntityType entityType);

    boolean existsByReviewerUserIdAndEntityIdAndEntityType(String reviewerUserId, String entityId, ReviewEntityType entityType);
}
