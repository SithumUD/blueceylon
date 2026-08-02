package com.blueceylon.catalog_service.presentation.dto.response;

import com.blueceylon.catalog_service.domain.model.enums.ApprovalStatus;
import com.blueceylon.catalog_service.domain.model.enums.BusinessType;
import com.blueceylon.catalog_service.domain.model.enums.SriLankanCity;
import com.blueceylon.catalog_service.domain.model.enums.VehicleType;
import java.util.List;
import java.util.Map;

public class BusinessProfileResponse {
    private String id;
    private BusinessType type;
    private ApprovalStatus status;
    private String rejectionReason;

    // Shared
    private String name;
    private String description;
    private String contactEmail;
    private String contactPhone;
    private SriLankanCity city;
    private String addressLine;
    private Double latitude;
    private Double longitude;
    private String coverImageUrl;

    // Hotel specifics
    private Integer starRating;
    private Integer totalBranches;

    // Agency/Guide specifics
    private String licenseNumber;
    private Integer yearsInOperation; // Agency
    private String licenseType;       // Guide
    private List<String> languagesSpoken; // Guide
    private Integer yearsOfExperience; // Guide
    private VehicleType vehicleType;   // Guide

    // Getters and Setters omitted for brevity... (will use standard IDE generation or lombok later, but since we are raw java:)

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public BusinessType getType() { return type; }
    public void setType(BusinessType type) { this.type = type; }
    public ApprovalStatus getStatus() { return status; }
    public void setStatus(ApprovalStatus status) { this.status = status; }
    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getContactEmail() { return contactEmail; }
    public void setContactEmail(String contactEmail) { this.contactEmail = contactEmail; }
    public String getContactPhone() { return contactPhone; }
    public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }
    public SriLankanCity getCity() { return city; }
    public void setCity(SriLankanCity city) { this.city = city; }
    public String getAddressLine() { return addressLine; }
    public void setAddressLine(String addressLine) { this.addressLine = addressLine; }
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public String getCoverImageUrl() { return coverImageUrl; }
    public void setCoverImageUrl(String coverImageUrl) { this.coverImageUrl = coverImageUrl; }
    public Integer getStarRating() { return starRating; }
    public void setStarRating(Integer starRating) { this.starRating = starRating; }
    public Integer getTotalBranches() { return totalBranches; }
    public void setTotalBranches(Integer totalBranches) { this.totalBranches = totalBranches; }
    public String getLicenseNumber() { return licenseNumber; }
    public void setLicenseNumber(String licenseNumber) { this.licenseNumber = licenseNumber; }
    public Integer getYearsInOperation() { return yearsInOperation; }
    public void setYearsInOperation(Integer yearsInOperation) { this.yearsInOperation = yearsInOperation; }
    public String getLicenseType() { return licenseType; }
    public void setLicenseType(String licenseType) { this.licenseType = licenseType; }
    public List<String> getLanguagesSpoken() { return languagesSpoken; }
    public void setLanguagesSpoken(List<String> languagesSpoken) { this.languagesSpoken = languagesSpoken; }
    public Integer getYearsOfExperience() { return yearsOfExperience; }
    public void setYearsOfExperience(Integer yearsOfExperience) { this.yearsOfExperience = yearsOfExperience; }
    public VehicleType getVehicleType() { return vehicleType; }
    public void setVehicleType(VehicleType vehicleType) { this.vehicleType = vehicleType; }
}
