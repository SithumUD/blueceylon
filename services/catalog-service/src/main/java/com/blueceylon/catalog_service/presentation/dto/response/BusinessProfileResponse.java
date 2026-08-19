package com.blueceylon.catalog_service.presentation.dto.response;

import com.blueceylon.catalog_service.domain.model.enums.*;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

public class BusinessProfileResponse {
    private String id;
    private BusinessType type;
    private ApprovalStatus status;
    private String rejectionReason;

    // Shared fields
    private String name;
    private String description;
    private String tagline;
    private String contactEmail;
    private String contactPhone;
    private String whatsappNumber;
    private String website;
    private Map<String, String> socialLinks;
    private SriLankanCity city;
    private Region region;
    private String addressLine;
    private Double latitude;
    private Double longitude;
    private String coverImageUrl;
    private List<String> galleryImageUrls;
    private String videoUrl;
    private Double averageRating;
    private Integer reviewCount;
    private Double priceStartFrom;
    private List<SustainabilityBadge> sustainabilityBadges;
    private CancellationPolicy cancellationPolicy;
    private List<PaymentMethod> paymentMethods;
    private Boolean depositRequired;
    private Double depositPercentage;
    private String sltdaLicenseNumber;

    // Hotel specifics
    private Integer starRating;
    private Integer totalBranches;
    private PropertyType propertyType;
    private String checkInTime;
    private String checkOutTime;
    private PetPolicy petPolicy;
    private Integer totalRooms;
    private Boolean offersDayOutPackages;
    private Boolean offersNightOutPackages;
    private Boolean offersHourlyBooking;

    // Agency/Guide specifics
    private String licenseNumber;
    private Integer yearsInOperation;
    private Integer partnerNetworkSize;
    private List<AgencySpecialization> specializations;
    private List<VehicleType> fleetTypes;
    private String licenseType;
    private List<String> languagesSpoken;
    private Integer yearsOfExperience;
    private VehicleType vehicleType;
    private String vehicleModel;
    private Boolean vehicleAirConditioned;
    private Currency currency;
    private Integer maxGroupSizeGuided;
    private Double dailyRate;
    private Double halfDayRate;

    public List<String> getGalleryImageUrls() { return galleryImageUrls; }
    public void setGalleryImageUrls(List<String> galleryImageUrls) { this.galleryImageUrls = galleryImageUrls; }
    public Double getAverageRating() { return averageRating; }
    public void setAverageRating(Double averageRating) { this.averageRating = averageRating; }
    public Integer getReviewCount() { return reviewCount; }
    public void setReviewCount(Integer reviewCount) { this.reviewCount = reviewCount; }
    public Double getPriceStartFrom() { return priceStartFrom; }
    public void setPriceStartFrom(Double priceStartFrom) { this.priceStartFrom = priceStartFrom; }
    public List<SustainabilityBadge> getSustainabilityBadges() { return sustainabilityBadges; }
    public void setSustainabilityBadges(List<SustainabilityBadge> sustainabilityBadges) { this.sustainabilityBadges = sustainabilityBadges; }
    public CancellationPolicy getCancellationPolicy() { return cancellationPolicy; }
    public void setCancellationPolicy(CancellationPolicy cancellationPolicy) { this.cancellationPolicy = cancellationPolicy; }
    public List<PaymentMethod> getPaymentMethods() { return paymentMethods; }
    public void setPaymentMethods(List<PaymentMethod> paymentMethods) { this.paymentMethods = paymentMethods; }
    public Boolean getDepositRequired() { return depositRequired; }
    public void setDepositRequired(Boolean depositRequired) { this.depositRequired = depositRequired; }
    public Double getDepositPercentage() { return depositPercentage; }
    public void setDepositPercentage(Double depositPercentage) { this.depositPercentage = depositPercentage; }
    public String getSltdaLicenseNumber() { return sltdaLicenseNumber; }
    public void setSltdaLicenseNumber(String sltdaLicenseNumber) { this.sltdaLicenseNumber = sltdaLicenseNumber; }
    public String getVehicleModel() { return vehicleModel; }
    public void setVehicleModel(String vehicleModel) { this.vehicleModel = vehicleModel; }
    public Boolean getVehicleAirConditioned() { return vehicleAirConditioned; }
    public void setVehicleAirConditioned(Boolean vehicleAirConditioned) { this.vehicleAirConditioned = vehicleAirConditioned; }
    public Currency getCurrency() { return currency; }
    public void setCurrency(Currency currency) { this.currency = currency; }

    public Integer getMaxGroupSizeGuided() { return maxGroupSizeGuided; }
    public void setMaxGroupSizeGuided(Integer maxGroupSizeGuided) { this.maxGroupSizeGuided = maxGroupSizeGuided; }
    public Double getDailyRate() { return dailyRate; }
    public void setDailyRate(Double dailyRate) { this.dailyRate = dailyRate; }
    public Double getHalfDayRate() { return halfDayRate; }
    public void setHalfDayRate(Double halfDayRate) { this.halfDayRate = halfDayRate; }

    public Integer getPartnerNetworkSize() { return partnerNetworkSize; }
    public void setPartnerNetworkSize(Integer partnerNetworkSize) { this.partnerNetworkSize = partnerNetworkSize; }
    public List<AgencySpecialization> getSpecializations() { return specializations; }
    public void setSpecializations(List<AgencySpecialization> specializations) { this.specializations = specializations; }
    public List<VehicleType> getFleetTypes() { return fleetTypes; }
    public void setFleetTypes(List<VehicleType> fleetTypes) { this.fleetTypes = fleetTypes; }

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
    public String getTagline() { return tagline; }
    public void setTagline(String tagline) { this.tagline = tagline; }
    public String getContactEmail() { return contactEmail; }
    public void setContactEmail(String contactEmail) { this.contactEmail = contactEmail; }
    public String getContactPhone() { return contactPhone; }
    public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }
    public String getWhatsappNumber() { return whatsappNumber; }
    public void setWhatsappNumber(String whatsappNumber) { this.whatsappNumber = whatsappNumber; }
    public String getWebsite() { return website; }
    public void setWebsite(String website) { this.website = website; }
    public Map<String, String> getSocialLinks() { return socialLinks; }
    public void setSocialLinks(Map<String, String> socialLinks) { this.socialLinks = socialLinks; }
    public SriLankanCity getCity() { return city; }
    public void setCity(SriLankanCity city) { this.city = city; }
    public Region getRegion() { return region; }
    public void setRegion(Region region) { this.region = region; }
    public String getAddressLine() { return addressLine; }
    public void setAddressLine(String addressLine) { this.addressLine = addressLine; }
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public String getCoverImageUrl() { return coverImageUrl; }
    public void setCoverImageUrl(String coverImageUrl) { this.coverImageUrl = coverImageUrl; }
    public String getVideoUrl() { return videoUrl; }
    public void setVideoUrl(String videoUrl) { this.videoUrl = videoUrl; }

    public Integer getStarRating() { return starRating; }
    public void setStarRating(Integer starRating) { this.starRating = starRating; }
    public Integer getTotalBranches() { return totalBranches; }
    public void setTotalBranches(Integer totalBranches) { this.totalBranches = totalBranches; }
    public PropertyType getPropertyType() { return propertyType; }
    public void setPropertyType(PropertyType propertyType) { this.propertyType = propertyType; }
    public String getCheckInTime() { return checkInTime; }
    public void setCheckInTime(String checkInTime) { this.checkInTime = checkInTime; }
    public String getCheckOutTime() { return checkOutTime; }
    public void setCheckOutTime(String checkOutTime) { this.checkOutTime = checkOutTime; }
    public PetPolicy getPetPolicy() { return petPolicy; }
    public void setPetPolicy(PetPolicy petPolicy) { this.petPolicy = petPolicy; }
    public Integer getTotalRooms() { return totalRooms; }
    public void setTotalRooms(Integer totalRooms) { this.totalRooms = totalRooms; }
    public Boolean getOffersDayOutPackages() { return offersDayOutPackages; }
    public void setOffersDayOutPackages(Boolean offersDayOutPackages) { this.offersDayOutPackages = offersDayOutPackages; }
    public Boolean getOffersNightOutPackages() { return offersNightOutPackages; }
    public void setOffersNightOutPackages(Boolean offersNightOutPackages) { this.offersNightOutPackages = offersNightOutPackages; }
    public Boolean getOffersHourlyBooking() { return offersHourlyBooking; }
    public void setOffersHourlyBooking(Boolean offersHourlyBooking) { this.offersHourlyBooking = offersHourlyBooking; }

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
