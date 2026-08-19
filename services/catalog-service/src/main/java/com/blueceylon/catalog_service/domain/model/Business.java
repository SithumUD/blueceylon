package com.blueceylon.catalog_service.domain.model;

import com.blueceylon.catalog_service.domain.model.enums.*;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Entity
@Table(name = "businesses", indexes = {
        @Index(name = "idx_business_status", columnList = "business_type,status"),
        @Index(name = "idx_business_owner", columnList = "owner_id")
})
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "business_type", discriminatorType = DiscriminatorType.STRING)
public abstract class Business extends BaseModel {

    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(columnDefinition = "TEXT")
    private String tagline;

    private String contactEmail;
    private String contactPhone;
    private String whatsappNumber;

    @ElementCollection
    @CollectionTable(name = "business_social_links", joinColumns = @JoinColumn(name = "business_id"))
    @MapKeyColumn(name = "platform")
    @Column(name = "url", columnDefinition = "TEXT")
    private Map<String, String> socialLinks = new HashMap<>();

    @Column(columnDefinition = "TEXT")
    private String website;

    @Column(name = "owner_id", nullable = false)
    private String ownerId;

    @Enumerated(EnumType.STRING)
    @Column(name = "business_type", insertable = false, updatable = false)
    private BusinessType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApprovalStatus status = ApprovalStatus.DRAFT;

    @Column(columnDefinition = "TEXT")
    private String rejectionReason;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SriLankanCity city;

    @Enumerated(EnumType.STRING)
    private Region region;

    private Double latitude;
    private Double longitude;

    @Column(name = "address_line", columnDefinition = "TEXT")
    private String addressLine;

    @Column(name = "cover_image_public_id")
    private String coverImagePublicId;

    @Column(name = "cover_image_url", columnDefinition = "TEXT")
    private String coverImageUrl;
    
    @ElementCollection
    @CollectionTable(name = "business_gallery_images", joinColumns = @JoinColumn(name = "business_id"))
    @Column(name = "image_url", columnDefinition = "TEXT")
    private List<String> galleryImageUrls = new ArrayList<>();
    
    @Column(name = "video_url", columnDefinition = "TEXT")
    private String videoUrl;
    
    @Enumerated(EnumType.STRING)
    private VerificationStatus verificationStatus = VerificationStatus.PENDING;
    
    private Double averageRating;
    private Integer reviewCount;
    private Double responseTimeHours;
    private Double responseRate;
    
    private Integer yearsInBusiness;
    
    @ElementCollection
    @CollectionTable(name = "business_sustainability_badges", joinColumns = @JoinColumn(name = "business_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "badge")
    private List<SustainabilityBadge> sustainabilityBadges = new ArrayList<>();
    
    @Enumerated(EnumType.STRING)
    private CancellationPolicy cancellationPolicy;
    
    @ElementCollection
    @CollectionTable(name = "business_payment_methods", joinColumns = @JoinColumn(name = "business_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method")
    private List<PaymentMethod> paymentMethods = new ArrayList<>();
    
    private Boolean depositRequired;
    private Double depositPercentage;

    @OneToMany(mappedBy = "business", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BusinessTranslation> translations = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "business_amenities",
            joinColumns = @JoinColumn(name = "business_id"),
            inverseJoinColumns = @JoinColumn(name = "amenity_id")
    )
    private List<Amenity> amenities = new ArrayList<>();

    // Getters and Setters
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
    public String getOwnerId() { return ownerId; }
    public void setOwnerId(String ownerId) { this.ownerId = ownerId; }
    public BusinessType getType() { return type; }
    public void setType(BusinessType type) { this.type = type; }
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
    public List<BusinessTranslation> getTranslations() { return translations; }
    public void setTranslations(List<BusinessTranslation> translations) { this.translations = translations; }
    public List<Amenity> getAmenities() { return amenities; }
    public void setAmenities(List<Amenity> amenities) { this.amenities = amenities; }
}
