package com.blueceylon.catalog_service.presentation.dto.response;

import com.blueceylon.catalog_service.domain.model.enums.BusinessType;
import com.blueceylon.catalog_service.domain.model.enums.SriLankanCity;

public class BusinessSummaryResponse {
    private String id;
    private String name;
    private String tagline;
    private BusinessType type;
    private SriLankanCity city;
    private String coverImageUrl;
    private Double averageRating;
    private Integer reviewCount;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getTagline() { return tagline; }
    public void setTagline(String tagline) { this.tagline = tagline; }
    public BusinessType getType() { return type; }
    public void setType(BusinessType type) { this.type = type; }
    public SriLankanCity getCity() { return city; }
    public void setCity(SriLankanCity city) { this.city = city; }
    public String getCoverImageUrl() { return coverImageUrl; }
    public void setCoverImageUrl(String coverImageUrl) { this.coverImageUrl = coverImageUrl; }
    public Double getAverageRating() { return averageRating; }
    public void setAverageRating(Double averageRating) { this.averageRating = averageRating; }
    public Integer getReviewCount() { return reviewCount; }
    public void setReviewCount(Integer reviewCount) { this.reviewCount = reviewCount; }
}
