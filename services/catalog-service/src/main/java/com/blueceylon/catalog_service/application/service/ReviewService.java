package com.blueceylon.catalog_service.application.service;

import com.blueceylon.catalog_service.domain.model.Review;
import com.blueceylon.catalog_service.domain.model.enums.ReviewEntityType;
import com.blueceylon.catalog_service.domain.repository.ReviewRepository;
import com.blueceylon.catalog_service.infrastructure.persistence.repository.BusinessRepository;
import com.blueceylon.catalog_service.infrastructure.persistence.repository.TourGuideProfileRepository;
import com.blueceylon.catalog_service.presentation.dto.request.ReviewRequest;
import com.blueceylon.catalog_service.presentation.dto.response.ReviewResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;

@Service
@Transactional
public class ReviewService {

    // Entity types that belong to a hotel and require a bookingId
    private static final List<ReviewEntityType> HOTEL_ENTITIES = Arrays.asList(
            ReviewEntityType.HOTEL,
            ReviewEntityType.ROOM,
            ReviewEntityType.DAY_OUT_PACKAGE,
            ReviewEntityType.NIGHT_OUT_PACKAGE
    );

    private final ReviewRepository reviewRepository;
    private final BusinessRepository businessRepository;
    private final TourGuideProfileRepository guideRepository;

    public ReviewService(ReviewRepository reviewRepository, BusinessRepository businessRepository, TourGuideProfileRepository guideRepository) {
        this.reviewRepository = reviewRepository;
        this.businessRepository = businessRepository;
        this.guideRepository = guideRepository;
    }

    public ReviewResponse submitReview(String userId, String userName, ReviewRequest request) {
        if (request.getRating() == null || request.getRating() < 1 || request.getRating() > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }
        if (request.getEntityType() == null || request.getEntityId() == null) {
            throw new IllegalArgumentException("entityType and entityId are required");
        }

        // Hotel-related entities require a bookingId
        boolean isHotelEntity = HOTEL_ENTITIES.contains(request.getEntityType());
        boolean hasBookingId = request.getBookingId() != null && !request.getBookingId().trim().isEmpty();

        if (isHotelEntity && !hasBookingId) {
            throw new IllegalArgumentException("A valid bookingId is required to review hotel services");
        }

        // Prevent duplicate reviews from the same user for the same entity
        if (reviewRepository.existsByReviewerUserIdAndEntityIdAndEntityType(userId, request.getEntityId(), request.getEntityType())) {
            throw new IllegalStateException("You have already submitted a review for this entity");
        }

        Review review = new Review();
        review.setReviewerUserId(userId);
        review.setReviewerName(userName != null ? userName : request.getReviewerName());
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        review.setEntityType(request.getEntityType());
        review.setEntityId(request.getEntityId());
        review.setStayOrTourDate(request.getStayOrTourDate());
        review.setVerified(hasBookingId);
        review.setBookingId(request.getBookingId());

        reviewRepository.save(review);

        // Recalculate averageRating and reviewCount on the parent entity
        recalculateRating(request.getEntityId(), request.getEntityType());

        return toResponse(review);
    }

    public ReviewResponse respondToReview(String reviewId, String ownerId, String response) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("Review not found"));
        review.setProviderResponse(response);
        reviewRepository.save(review);
        return toResponse(review);
    }

    @Transactional(readOnly = true)
    public Page<ReviewResponse> getReviews(String entityId, ReviewEntityType entityType, Pageable pageable) {
        return reviewRepository.findByEntityIdAndEntityType(entityId, entityType, pageable)
                .map(this::toResponse);
    }

    private void recalculateRating(String entityId, ReviewEntityType entityType) {
        Double avg = reviewRepository.getAverageRating(entityId, entityType);
        long count = reviewRepository.countReviews(entityId, entityType);
        double roundedAvg = avg != null ? Math.round(avg * 10.0) / 10.0 : 0.0;
        int reviewCount = (int) count;

        // Update Business (Hotel, Tour Agency, Tour Guide via Business table)
        if (entityType == ReviewEntityType.HOTEL || entityType == ReviewEntityType.TOUR_AGENCY) {
            businessRepository.findById(entityId).ifPresent(b -> {
                b.setAverageRating(roundedAvg);
                b.setReviewCount(reviewCount);
                businessRepository.save(b);
            });
        } else if (entityType == ReviewEntityType.TOUR_GUIDE) {
            guideRepository.findById(entityId).ifPresent(g -> {
                g.setAverageRating(roundedAvg);
                g.setReviewCount(reviewCount);
                guideRepository.save(g);
            });
        }
        // For ROOM, TOUR_PACKAGE, DAY_OUT_PACKAGE, NIGHT_OUT_PACKAGE:
        // rating is stored on the Review only; aggregate queries can be used if needed.
    }

    private ReviewResponse toResponse(Review r) {
        ReviewResponse resp = new ReviewResponse();
        resp.setId(r.getId());
        resp.setReviewerName(r.getReviewerName());
        resp.setRating(r.getRating());
        resp.setComment(r.getComment());
        resp.setEntityType(r.getEntityType());
        resp.setEntityId(r.getEntityId());
        resp.setStayOrTourDate(r.getStayOrTourDate());
        resp.setVerified(r.getVerified());
        resp.setProviderResponse(r.getProviderResponse());
        resp.setCreatedAt(r.getCreatedAt());
        return resp;
    }
}
