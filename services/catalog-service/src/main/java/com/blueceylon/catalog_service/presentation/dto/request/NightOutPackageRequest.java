package com.blueceylon.catalog_service.presentation.dto.request;
import com.blueceylon.catalog_service.domain.model.enums.PricingUnit;
import com.blueceylon.catalog_service.domain.model.enums.OccasionTag;
import java.time.LocalTime;
import java.util.List;
public class NightOutPackageRequest {
    private String title;
    private String description;
    private Double price;
    private PricingUnit pricingUnit;
    private LocalTime startTime;
    private LocalTime endTime;
    private Boolean includesOvernightStay;
    private List<OccasionTag> occasionTags;
    private Integer maxOccupancy;
    private List<String> imageUrls;
    private Integer advanceBookingHoursRequired;

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
    public PricingUnit getPricingUnit() { return pricingUnit; }
    public void setPricingUnit(PricingUnit pricingUnit) { this.pricingUnit = pricingUnit; }
    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }
    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }
    public Boolean getIncludesOvernightStay() { return includesOvernightStay; }
    public void setIncludesOvernightStay(Boolean includesOvernightStay) { this.includesOvernightStay = includesOvernightStay; }
    public List<OccasionTag> getOccasionTags() { return occasionTags; }
    public void setOccasionTags(List<OccasionTag> occasionTags) { this.occasionTags = occasionTags; }
    public Integer getMaxOccupancy() { return maxOccupancy; }
    public void setMaxOccupancy(Integer maxOccupancy) { this.maxOccupancy = maxOccupancy; }
    public List<String> getImageUrls() { return imageUrls; }
    public void setImageUrls(List<String> imageUrls) { this.imageUrls = imageUrls; }
    public Integer getAdvanceBookingHoursRequired() { return advanceBookingHoursRequired; }
    public void setAdvanceBookingHoursRequired(Integer advanceBookingHoursRequired) { this.advanceBookingHoursRequired = advanceBookingHoursRequired; }
}
