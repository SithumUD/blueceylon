package com.blueceylon.catalog_service.domain.model;

import com.blueceylon.catalog_service.domain.model.enums.*;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Entity
@Table(name = "tour_guide_profiles", indexes = {
        @Index(name = "idx_guide_status", columnList = "status"),
        @Index(name = "idx_guide_user", columnList = "user_id")
})
public class TourGuideProfile extends BaseModel {

    @Column(name = "user_id", nullable = false)
    private String userId;

    private String name;

    @Column(length = 2000)
    private String description;

    @Column(length = 100)
    private String tagline;

    private String contactEmail;
    private String contactPhone;
    private String whatsappNumber;

    @ElementCollection
    @CollectionTable(name = "guide_social_links", joinColumns = @JoinColumn(name = "guide_id"))
    @MapKeyColumn(name = "platform")
    @Column(name = "url")
    private Map<String, String> socialLinks = new HashMap<>();

    private String website;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApprovalStatus status = ApprovalStatus.DRAFT;

    @Column(length = 1000)
    private String rejectionReason;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SriLankanCity city;

    @Enumerated(EnumType.STRING)
    private Region region;

    private Double latitude;
    private Double longitude;
    private String addressLine;

    @Column(name = "cover_image_public_id")
    private String coverImagePublicId;

    @Column(name = "cover_image_url")
    private String coverImageUrl;

    @ElementCollection
    @CollectionTable(name = "guide_gallery_images", joinColumns = @JoinColumn(name = "guide_id"))
    @Column(name = "image_url")
    private List<String> galleryImageUrls = new ArrayList<>();

    private String videoUrl;

    @Enumerated(EnumType.STRING)
    private VerificationStatus verificationStatus = VerificationStatus.PENDING;

    private Double averageRating;
    private Integer reviewCount;
    private Double responseTimeHours;
    private Double responseRate;

    private Integer yearsInBusiness;

    @ElementCollection
    @CollectionTable(name = "guide_sustainability_badges", joinColumns = @JoinColumn(name = "guide_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "badge")
    private List<SustainabilityBadge> sustainabilityBadges = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    private CancellationPolicy cancellationPolicy;

    @ElementCollection
    @CollectionTable(name = "guide_payment_methods", joinColumns = @JoinColumn(name = "guide_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method")
    private List<PaymentMethod> paymentMethods = new ArrayList<>();

    private Boolean depositRequired;
    private Double depositPercentage;

    @Column(name = "sltda_license_number")
    private String sltdaLicenseNumber;

    @Column(name = "license_type")
    private String licenseType;

    @ElementCollection
    @CollectionTable(name = "guide_languages", joinColumns = @JoinColumn(name = "guide_id"))
    @Column(name = "language")
    private List<String> languagesSpoken = new ArrayList<>();

    @Column(name = "years_of_experience")
    private Integer yearsOfExperience;

    @Enumerated(EnumType.STRING)
    @Column(name = "vehicle_type")
    private VehicleType vehicleType;

    @ElementCollection
    @CollectionTable(name = "guide_specialty_areas", joinColumns = @JoinColumn(name = "guide_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "specialty")
    private List<GuideSpecialtyArea> specialtyAreas = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "guide_coverage_regions", joinColumns = @JoinColumn(name = "guide_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "region")
    private List<Region> coverageRegions = new ArrayList<>();

    private Double dailyRate;
    private Double halfDayRate;

    @ElementCollection
    @CollectionTable(name = "guide_certifications", joinColumns = @JoinColumn(name = "guide_id"))
    @Column(name = "certification")
    private List<String> certifications = new ArrayList<>();

    private Integer maxGroupSizeGuided;

    @OneToMany(mappedBy = "guide", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<GuideBlackoutDate> blackoutDates = new ArrayList<>();

    // Getters and Setters
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
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
    public Map<String, String> getSocialLinks() { return socialLinks; }
    public void setSocialLinks(Map<String, String> socialLinks) { this.socialLinks = socialLinks; }
    public String getWebsite() { return website; }
    public void setWebsite(String website) { this.website = website; }
    public ApprovalStatus getStatus() { return status; }
    public void setStatus(ApprovalStatus status) { this.status = status; }
    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }
    public SriLankanCity getCity() { return city; }
    public void setCity(SriLankanCity city) { this.city = city; }
    public Region getRegion() { return region; }
    public void setRegion(Region region) { this.region = region; }
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public String getAddressLine() { return addressLine; }
    public void setAddressLine(String addressLine) { this.addressLine = addressLine; }
    public String getCoverImagePublicId() { return coverImagePublicId; }
    public void setCoverImagePublicId(String coverImagePublicId) { this.coverImagePublicId = coverImagePublicId; }
    public String getCoverImageUrl() { return coverImageUrl; }
    public void setCoverImageUrl(String coverImageUrl) { this.coverImageUrl = coverImageUrl; }
    public List<String> getGalleryImageUrls() { return galleryImageUrls; }
    public void setGalleryImageUrls(List<String> galleryImageUrls) { this.galleryImageUrls = galleryImageUrls; }
    public String getVideoUrl() { return videoUrl; }
    public void setVideoUrl(String videoUrl) { this.videoUrl = videoUrl; }
    public VerificationStatus getVerificationStatus() { return verificationStatus; }
    public void setVerificationStatus(VerificationStatus verificationStatus) { this.verificationStatus = verificationStatus; }
    public Double getAverageRating() { return averageRating; }
    public void setAverageRating(Double averageRating) { this.averageRating = averageRating; }
    public Integer getReviewCount() { return reviewCount; }
    public void setReviewCount(Integer reviewCount) { this.reviewCount = reviewCount; }
    public Double getResponseTimeHours() { return responseTimeHours; }
    public void setResponseTimeHours(Double responseTimeHours) { this.responseTimeHours = responseTimeHours; }
    public Double getResponseRate() { return responseRate; }
    public void setResponseRate(Double responseRate) { this.responseRate = responseRate; }
    public Integer getYearsInBusiness() { return yearsInBusiness; }
    public void setYearsInBusiness(Integer yearsInBusiness) { this.yearsInBusiness = yearsInBusiness; }
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
    public String getLicenseType() { return licenseType; }
    public void setLicenseType(String licenseType) { this.licenseType = licenseType; }
    public List<String> getLanguagesSpoken() { return languagesSpoken; }
    public void setLanguagesSpoken(List<String> languagesSpoken) { this.languagesSpoken = languagesSpoken; }
    public Integer getYearsOfExperience() { return yearsOfExperience; }
    public void setYearsOfExperience(Integer yearsOfExperience) { this.yearsOfExperience = yearsOfExperience; }
    public VehicleType getVehicleType() { return vehicleType; }
    public void setVehicleType(VehicleType vehicleType) { this.vehicleType = vehicleType; }
    public List<GuideSpecialtyArea> getSpecialtyAreas() { return specialtyAreas; }
    public void setSpecialtyAreas(List<GuideSpecialtyArea> specialtyAreas) { this.specialtyAreas = specialtyAreas; }
    public List<Region> getCoverageRegions() { return coverageRegions; }
    public void setCoverageRegions(List<Region> coverageRegions) { this.coverageRegions = coverageRegions; }
    public Double getDailyRate() { return dailyRate; }
    public void setDailyRate(Double dailyRate) { this.dailyRate = dailyRate; }
    public Double getHalfDayRate() { return halfDayRate; }
    public void setHalfDayRate(Double halfDayRate) { this.halfDayRate = halfDayRate; }
    public List<String> getCertifications() { return certifications; }
    public void setCertifications(List<String> certifications) { this.certifications = certifications; }
    public Integer getMaxGroupSizeGuided() { return maxGroupSizeGuided; }
    public void setMaxGroupSizeGuided(Integer maxGroupSizeGuided) { this.maxGroupSizeGuided = maxGroupSizeGuided; }
    public List<GuideBlackoutDate> getBlackoutDates() { return blackoutDates; }
    public void setBlackoutDates(List<GuideBlackoutDate> blackoutDates) { this.blackoutDates = blackoutDates; }
}
