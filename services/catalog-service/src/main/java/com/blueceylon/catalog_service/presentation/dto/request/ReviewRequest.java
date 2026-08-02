package com.blueceylon.catalog_service.presentation.dto.request;

import com.blueceylon.catalog_service.domain.model.enums.ReviewEntityType;
import java.time.LocalDate;

public class ReviewRequest {
    private String reviewerName;
    private Integer rating;
    private String comment;
    private ReviewEntityType entityType;
    private String entityId;
    private LocalDate stayOrTourDate;
    // Only required for hotel-related entities (HOTEL, ROOM, DAY_OUT_PACKAGE, NIGHT_OUT_PACKAGE)
    private String bookingId;

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
    public String getBookingId() { return bookingId; }
    public void setBookingId(String bookingId) { this.bookingId = bookingId; }
}
