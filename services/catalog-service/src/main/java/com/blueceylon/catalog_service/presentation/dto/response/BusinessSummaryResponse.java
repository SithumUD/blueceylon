package com.blueceylon.catalog_service.presentation.dto.response;

import com.blueceylon.catalog_service.domain.model.enums.*;
import java.util.List;

public class BusinessSummaryResponse {
    private String id;
    private String name;
    private String tagline;
    private String description;
    private BusinessType type;
    private SriLankanCity city;
    private Region region;
    private String addressLine;
    private String coverImageUrl;
    private Double averageRating;
    private Integer reviewCount;
    private VerificationStatus verificationStatus;

    // Contact info
    private String contactEmail;
    private String contactPhone;
    private String whatsappNumber;

    // Guide-specific fields
    private String sltdaLicenseNumber;
    private String licenseNumber;
    private String licenseType;
    private List<String> languagesSpoken;
    private Integer yearsOfExperience;
    private VehicleType vehicleType;
    private String vehicleModel;
    private Boolean vehicleAirConditioned;
    private Currency currency;
    private List<GuideSpecialtyArea> specialtyAreas;
    private Double dailyRate;
    private Double halfDayRate;
    private Integer maxGroupSizeGuided;

    // Hotel-specific summary fields
    private Integer starRating;
    private Double priceStartFrom;

    // Agency-specific summary fields
    private List<AgencySpecialization> specializations;
    private List<VehicleType> fleetTypes;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getTagline() { return tagline; }
    public void setTagline(String tagline) { this.tagline = tagline; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public BusinessType getType() { return type; }
    public void setType(BusinessType type) { this.type = type; }
    public SriLankanCity getCity() { return city; }
    public void setCity(SriLankanCity city) { this.city = city; }
    public Region getRegion() { return region; }
    public void setRegion(Region region) { this.region = region; }
    public String getAddressLine() { return addressLine; }
    public void setAddressLine(String addressLine) { this.addressLine = addressLine; }
    public String getCoverImageUrl() { return coverImageUrl; }
    public void setCoverImageUrl(String coverImageUrl) { this.coverImageUrl = coverImageUrl; }
    public Double getAverageRating() { return averageRating; }
    public void setAverageRating(Double averageRating) { this.averageRating = averageRating; }
    public Integer getReviewCount() { return reviewCount; }
    public void setReviewCount(Integer reviewCount) { this.reviewCount = reviewCount; }
    public VerificationStatus getVerificationStatus() { return verificationStatus; }
    public void setVerificationStatus(VerificationStatus verificationStatus) { this.verificationStatus = verificationStatus; }

    public String getContactEmail() { return contactEmail; }
    public void setContactEmail(String contactEmail) { this.contactEmail = contactEmail; }
    public String getContactPhone() { return contactPhone; }
    public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }
    public String getWhatsappNumber() { return whatsappNumber; }
    public void setWhatsappNumber(String whatsappNumber) { this.whatsappNumber = whatsappNumber; }

    public String getSltdaLicenseNumber() { return sltdaLicenseNumber; }
    public void setSltdaLicenseNumber(String sltdaLicenseNumber) { this.sltdaLicenseNumber = sltdaLicenseNumber; }
    public String getLicenseNumber() { return licenseNumber; }
    public void setLicenseNumber(String licenseNumber) { this.licenseNumber = licenseNumber; }
    public String getLicenseType() { return licenseType; }
    public void setLicenseType(String licenseType) { this.licenseType = licenseType; }
    public List<String> getLanguagesSpoken() { return languagesSpoken; }
    public void setLanguagesSpoken(List<String> languagesSpoken) { this.languagesSpoken = languagesSpoken; }
    public Integer getYearsOfExperience() { return yearsOfExperience; }
    public void setYearsOfExperience(Integer yearsOfExperience) { this.yearsOfExperience = yearsOfExperience; }
    public VehicleType getVehicleType() { return vehicleType; }
    public void setVehicleType(VehicleType vehicleType) { this.vehicleType = vehicleType; }
    public String getVehicleModel() { return vehicleModel; }
    public void setVehicleModel(String vehicleModel) { this.vehicleModel = vehicleModel; }
    public Boolean getVehicleAirConditioned() { return vehicleAirConditioned; }
    public void setVehicleAirConditioned(Boolean vehicleAirConditioned) { this.vehicleAirConditioned = vehicleAirConditioned; }
    public Currency getCurrency() { return currency; }
    public void setCurrency(Currency currency) { this.currency = currency; }
    public List<GuideSpecialtyArea> getSpecialtyAreas() { return specialtyAreas; }
    public void setSpecialtyAreas(List<GuideSpecialtyArea> specialtyAreas) { this.specialtyAreas = specialtyAreas; }
    public Double getDailyRate() { return dailyRate; }
    public void setDailyRate(Double dailyRate) { this.dailyRate = dailyRate; }
    public Double getHalfDayRate() { return halfDayRate; }
    public void setHalfDayRate(Double halfDayRate) { this.halfDayRate = halfDayRate; }
    public Integer getMaxGroupSizeGuided() { return maxGroupSizeGuided; }
    public void setMaxGroupSizeGuided(Integer maxGroupSizeGuided) { this.maxGroupSizeGuided = maxGroupSizeGuided; }

    public Integer getStarRating() { return starRating; }
    public void setStarRating(Integer starRating) { this.starRating = starRating; }
    public Double getPriceStartFrom() { return priceStartFrom; }
    public void setPriceStartFrom(Double priceStartFrom) { this.priceStartFrom = priceStartFrom; }

    public List<AgencySpecialization> getSpecializations() { return specializations; }
    public void setSpecializations(List<AgencySpecialization> specializations) { this.specializations = specializations; }
    public List<VehicleType> getFleetTypes() { return fleetTypes; }
    public void setFleetTypes(List<VehicleType> fleetTypes) { this.fleetTypes = fleetTypes; }
}
