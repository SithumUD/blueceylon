package com.blueceylon.catalog_service.domain.model;
import com.blueceylon.catalog_service.domain.model.enums.*;
import jakarta.persistence.*;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.time.DayOfWeek;
import com.blueceylon.catalog_service.domain.model.embeddable.ChildPolicy;

@Entity
@Table(name = "day_out_packages")
public class DayOutPackage extends BaseModel {
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
    
    @ManyToMany
    @JoinTable(
            name = "day_out_amenities",
            joinColumns = @JoinColumn(name = "package_id"),
            inverseJoinColumns = @JoinColumn(name = "amenity_id")
    )
    private List<Amenity> inclusions = new ArrayList<>();
    
    private Integer maxOccupancy;
    private Integer dailyLimit;
    
    @Embedded
    private ChildPolicy childPolicy;
    
    @ElementCollection
    @CollectionTable(name = "day_out_available_days", joinColumns = @JoinColumn(name = "package_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "day_of_week")
    private List<DayOfWeek> availableDays = new ArrayList<>();
    
    @ElementCollection
    @CollectionTable(name = "day_out_images", joinColumns = @JoinColumn(name = "package_id"))
    @Column(name = "image_url")
    private List<String> imageUrls = new ArrayList<>();
    
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
    public List<Amenity> getInclusions() { return inclusions; }
    public void setInclusions(List<Amenity> inclusions) { this.inclusions = inclusions; }
    public Integer getMaxOccupancy() { return maxOccupancy; }
    public void setMaxOccupancy(Integer maxOccupancy) { this.maxOccupancy = maxOccupancy; }
    public Integer getDailyLimit() { return dailyLimit; }
    public void setDailyLimit(Integer dailyLimit) { this.dailyLimit = dailyLimit; }
    public ChildPolicy getChildPolicy() { return childPolicy; }
    public void setChildPolicy(ChildPolicy childPolicy) { this.childPolicy = childPolicy; }
    public List<DayOfWeek> getAvailableDays() { return availableDays; }
    public void setAvailableDays(List<DayOfWeek> availableDays) { this.availableDays = availableDays; }
    public List<String> getImageUrls() { return imageUrls; }
    public void setImageUrls(List<String> imageUrls) { this.imageUrls = imageUrls; }
    public Integer getAdvanceBookingHoursRequired() { return advanceBookingHoursRequired; }
    public void setAdvanceBookingHoursRequired(Integer advanceBookingHoursRequired) { this.advanceBookingHoursRequired = advanceBookingHoursRequired; }
    public Hotel getHotel() { return hotel; }
    public void setHotel(Hotel hotel) { this.hotel = hotel; }
}

