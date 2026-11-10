package com.blueceylon.catalog_service.presentation.dto.response;

import com.blueceylon.catalog_service.domain.model.enums.OwnerType;
import com.blueceylon.catalog_service.presentation.dto.request.TourPackageRequest;

public class TourPackageResponse extends TourPackageRequest {
    private String id;
    private String providerId;
    private String providerName;
    private OwnerType providerType;
    private String durationLabel;
    private String coverImageUrl;
    private String location;
    private Boolean sltdaVerified;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getProviderId() { return providerId; }
    public void setProviderId(String providerId) { this.providerId = providerId; }
    public String getProviderName() { return providerName; }
    public void setProviderName(String providerName) { this.providerName = providerName; }
    public OwnerType getProviderType() { return providerType; }
    public void setProviderType(OwnerType providerType) { this.providerType = providerType; }
    public String getDurationLabel() { return durationLabel; }
    public void setDurationLabel(String durationLabel) { this.durationLabel = durationLabel; }
    public String getCoverImageUrl() { return coverImageUrl; }
    public void setCoverImageUrl(String coverImageUrl) { this.coverImageUrl = coverImageUrl; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public Boolean getSltdaVerified() { return sltdaVerified; }
    public void setSltdaVerified(Boolean sltdaVerified) { this.sltdaVerified = sltdaVerified; }
}

