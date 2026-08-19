package com.blueceylon.catalog_service.domain.model;

import com.blueceylon.catalog_service.domain.model.enums.ReviewEntityType;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "reviews", indexes = {
        @Index(name = "idx_review_entity", columnList = "entity_id, entity_type")
})
public class Review extends BaseModel {

    @Column(nullable = false)
    private String reviewerUserId;

    @Column(nullable = false)
    private String reviewerName;

    @Column(nullable = false)
    private Integer rating;

    @Column(length = 2000)
    private String comment;

    @Enumerated(EnumType.STRING)
    @Column(name = "entity_type", nullable = false)
    private ReviewEntityType entityType;

    @Column(name = "entity_id", nullable = false)
    private String entityId;

    private LocalDate stayOrTourDate;

    // Whether the review was made with a verified booking
    private Boolean verified = false;

    // The bookingId used to verify the review (for hotel-related)
    private String bookingId;

    @Column(name = "reviewer_country")
    private String reviewerCountry;

    @Column(name = "booking_reference")
    private String bookingReference;

    @Column(length = 2000)
    private String providerResponse;

    @Column(name = "provider_response_at")
    private java.time.Instant providerResponseAt;

    // Getters and Setters
    public String getReviewerUserId() { return reviewerUserId; }
    public void setReviewerUserId(String reviewerUserId) { this.reviewerUserId = reviewerUserId; }
    public String getReviewerName() { return reviewerName; }
    public void setReviewerName(String reviewerName) { this.reviewerName = reviewerName; }
    public String getReviewerCountry() { return reviewerCountry; }
    public void setReviewerCountry(String reviewerCountry) { this.reviewerCountry = reviewerCountry; }
    public String getBookingReference() { return bookingReference; }
    public void setBookingReference(String bookingReference) { this.bookingReference = bookingReference; }
    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }
    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
    public ReviewEntityType getEntityType() { return entityType; }
    public void setEntityType(ReviewEntityType entityType) { this.entityType = entityType; }
    public String getEntityId() { return entityId; }
    public void setEntityId(String entityId) { this.entityId = entityId; }
    public LocalDate getStayOrTourDate() { return stayOrTourDate; }
    public void setStayOrTourDate(LocalDate stayOrTourDate) { this.stayOrTourDate = stayOrTourDate; }
    public Boolean getVerified() { return verified; }
    public void setVerified(Boolean verified) { this.verified = verified; }
    public String getBookingId() { return bookingId; }
    public void setBookingId(String bookingId) { this.bookingId = bookingId; }
    public String getProviderResponse() { return providerResponse; }
    public void setProviderResponse(String providerResponse) { this.providerResponse = providerResponse; }
    public java.time.Instant getProviderResponseAt() { return providerResponseAt; }
    public void setProviderResponseAt(java.time.Instant providerResponseAt) { this.providerResponseAt = providerResponseAt; }
}
