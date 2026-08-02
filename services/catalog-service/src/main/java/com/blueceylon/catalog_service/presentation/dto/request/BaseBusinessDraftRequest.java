package com.blueceylon.catalog_service.presentation.dto.request;

import com.blueceylon.catalog_service.domain.model.enums.SriLankanCity;
import com.blueceylon.catalog_service.domain.model.enums.Region;
import java.util.Map;
import java.util.List;

public class BaseBusinessDraftRequest {
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
    private String coverImagePublicId;
    private String coverImageUrl;
    private List<String> galleryImageUrls;
    private String videoUrl;

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
    public String getCoverImagePublicId() { return coverImagePublicId; }
    public void setCoverImagePublicId(String coverImagePublicId) { this.coverImagePublicId = coverImagePublicId; }
    public String getCoverImageUrl() { return coverImageUrl; }
    public void setCoverImageUrl(String coverImageUrl) { this.coverImageUrl = coverImageUrl; }
    public List<String> getGalleryImageUrls() { return galleryImageUrls; }
    public void setGalleryImageUrls(List<String> galleryImageUrls) { this.galleryImageUrls = galleryImageUrls; }
    public String getVideoUrl() { return videoUrl; }
    public void setVideoUrl(String videoUrl) { this.videoUrl = videoUrl; }
}
