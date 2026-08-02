package com.blueceylon.catalog_service.presentation.dto.response;

import com.blueceylon.catalog_service.domain.model.enums.ReviewEntityType;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class ReviewResponse {
    private String id;
    private String reviewerName;
    private Integer rating;
    private String comment;
    private ReviewEntityType entityType;
    private String entityId;
    private LocalDate stayOrTourDate;
    private Boolean verified;
    private String providerResponse;
    private LocalDateTime createdAt;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getReviewerName() { return reviewerName; }
    public void setReviewerName(String reviewerName) { this.reviewerName = reviewerName; }
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
    public String getProviderResponse() { return providerResponse; }
    public void setProviderResponse(String providerResponse) { this.providerResponse = providerResponse; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
