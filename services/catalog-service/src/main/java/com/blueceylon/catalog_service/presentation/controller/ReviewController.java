package com.blueceylon.catalog_service.presentation.controller;

import com.blueceylon.catalog_service.application.service.ReviewService;
import com.blueceylon.catalog_service.domain.model.enums.ReviewEntityType;
import com.blueceylon.catalog_service.presentation.dto.request.ReviewRequest;
import com.blueceylon.catalog_service.presentation.dto.response.ReviewResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    /**
     * Submit a review. Requires authentication.
     * - TOUR_PACKAGE / TOUR_GUIDE reviews: no bookingId required.
     * - HOTEL / ROOM / DAY_OUT_PACKAGE / NIGHT_OUT_PACKAGE: bookingId is mandatory.
     */
    @PostMapping("/api/v1/catalog/reviews")
    public ResponseEntity<ReviewResponse> submitReview(
            @AuthenticationPrincipal Jwt jwt,
            @RequestBody ReviewRequest request) {
        String userId = jwt.getSubject();
        String preferredUsername = jwt.getClaimAsString("preferred_username");
        return ResponseEntity.ok(reviewService.submitReview(userId, preferredUsername, request));
    }

    /**
     * Get all reviews for a given entity. Public endpoint.
     */
    @GetMapping("/api/v1/catalog/public/reviews")
    public ResponseEntity<Page<ReviewResponse>> getReviews(
            @RequestParam String entityId,
            @RequestParam ReviewEntityType entityType,
            Pageable pageable) {
        return ResponseEntity.ok(reviewService.getReviews(entityId, entityType, pageable));
    }

    /**
     * Business owner responds to a review. Requires authentication.
     * The ownerId is extracted from the JWT and validated inside the service.
     */
    @PutMapping("/api/v1/catalog/reviews/{reviewId}/respond")
    public ResponseEntity<ReviewResponse> respondToReview(
            @PathVariable String reviewId,
            @AuthenticationPrincipal Jwt jwt,
            @RequestBody java.util.Map<String, String> body) {
        String ownerId = jwt.getSubject();
        String response = body.get("response");
        return ResponseEntity.ok(reviewService.respondToReview(reviewId, ownerId, response));
    }
}
