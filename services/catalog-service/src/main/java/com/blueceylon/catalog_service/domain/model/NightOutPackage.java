package com.blueceylon.catalog_service.domain.model;
import com.blueceylon.catalog_service.domain.model.enums.*;
import jakarta.persistence.*;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.time.LocalDate;

@Entity
@Table(name = "night_out_packages")
public class NightOutPackage extends BaseModel {
    private String title;
    @Column(length = 2000)
    private String description;
    private Double price;
    @Enumerated(EnumType.STRING)
    private Currency currency = Currency.LKR;
    @Enumerated(EnumType.STRING)
    private PricingUnit pricingUnit;
    private LocalTime startTime;
    private LocalTime endTime;
    
    private Boolean includesOvernightStay;
    
    @ManyToMany
    @JoinTable(
            name = "night_out_amenities",
            joinColumns = @JoinColumn(name = "package_id"),
            inverseJoinColumns = @JoinColumn(name = "amenity_id")
    )
    private List<Amenity> inclusions = new ArrayList<>();
    
    @ElementCollection
    @CollectionTable(name = "night_out_occasion_tags", joinColumns = @JoinColumn(name = "package_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "tag")
    private List<OccasionTag> occasionTags = new ArrayList<>();
    
    private Integer maxOccupancy;
    private Integer dailyLimit;
    
    @ElementCollection
    @CollectionTable(name = "night_out_images", joinColumns = @JoinColumn(name = "package_id"))
    @Column(name = "image_url")
    private List<String> imageUrls = new ArrayList<>();
    
    @ElementCollection
    @CollectionTable(name = "night_out_seasonal_availability", joinColumns = @JoinColumn(name = "package_id"))
    @Column(name = "available_date")
    private List<LocalDate> seasonalAvailability = new ArrayList<>();
    
    private Integer advanceBookingHoursRequired;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hotel_id")
    private Hotel hotel;

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
    public Currency getCurrency() { return currency; }
    public void setCurrency(Currency currency) { this.currency = currency; }
    public PricingUnit getPricingUnit() { return pricingUnit; }
    public void setPricingUnit(PricingUnit pricingUnit) { this.pricingUnit = pricingUnit; }
    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }
    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }
    public Boolean getIncludesOvernightStay() { return includesOvernightStay; }
    public void setIncludesOvernightStay(Boolean includesOvernightStay) { this.includesOvernightStay = includesOvernightStay; }
    public List<Amenity> getInclusions() { return inclusions; }
    public void setInclusions(List<Amenity> inclusions) { this.inclusions = inclusions; }
    public List<OccasionTag> getOccasionTags() { return occasionTags; }
    public void setOccasionTags(List<OccasionTag> occasionTags) { this.occasionTags = occasionTags; }
    public Integer getMaxOccupancy() { return maxOccupancy; }
    public void setMaxOccupancy(Integer maxOccupancy) { this.maxOccupancy = maxOccupancy; }
    public Integer getDailyLimit() { return dailyLimit; }
    public void setDailyLimit(Integer dailyLimit) { this.dailyLimit = dailyLimit; }
    public List<String> getImageUrls() { return imageUrls; }
    public void setImageUrls(List<String> imageUrls) { this.imageUrls = imageUrls; }
    public List<LocalDate> getSeasonalAvailability() { return seasonalAvailability; }
    public void setSeasonalAvailability(List<LocalDate> seasonalAvailability) { this.seasonalAvailability = seasonalAvailability; }
    public Integer getAdvanceBookingHoursRequired() { return advanceBookingHoursRequired; }
    public void setAdvanceBookingHoursRequired(Integer advanceBookingHoursRequired) { this.advanceBookingHoursRequired = advanceBookingHoursRequired; }
    public Hotel getHotel() { return hotel; }
    public void setHotel(Hotel hotel) { this.hotel = hotel; }
}

