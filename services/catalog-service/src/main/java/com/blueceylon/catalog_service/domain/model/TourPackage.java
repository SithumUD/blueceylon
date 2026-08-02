package com.blueceylon.catalog_service.domain.model;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import com.blueceylon.catalog_service.domain.model.enums.*;
import jakarta.persistence.*;


import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "tour_packages", indexes = {
        @Index(name = "idx_tour_search", columnList = "starting_city,category,base_price")
})
@SQLDelete(sql = "UPDATE tour_packages SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
public class TourPackage extends BaseModel {

    private String title;

    @Column(length = 3000)
    private String description;

    @Column(name = "base_price", nullable = false)
    private Double price;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Currency currency = Currency.USD;

    private Integer durationDays;

    @Enumerated(EnumType.STRING)
    private TourCategory category;

    @Enumerated(EnumType.STRING)
    @Column(name = "starting_city")
    private SriLankanCity startingCity;

    @Column(name = "owner_id", nullable = false)
    private String ownerId;

    @Enumerated(EnumType.STRING)
    @Column(name = "owner_type", nullable = false)
    private OwnerType ownerType;

    private Integer minGroupSize = 1;
    private Integer maxGroupSize;

    @ElementCollection
    @CollectionTable(name = "tour_image_urls", joinColumns = @JoinColumn(name = "tour_id"))
    @Column(name = "image_url")
    private List<String> imageUrls = new ArrayList<>();

    @OneToMany(mappedBy = "tourPackage", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("dayNumber ASC")
    private List<ItineraryDay> itineraryDays = new ArrayList<>();

    @OneToMany(mappedBy = "tourPackage", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("minTravelers ASC")
    private List<GroupPricingTier> pricingTiers = new ArrayList<>();

    @OneToMany(mappedBy = "tourPackage", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TourPackageTranslation> translations = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "tour_amenities",
            joinColumns = @JoinColumn(name = "tour_id"),
            inverseJoinColumns = @JoinColumn(name = "amenity_id")
    )
    private List<Amenity> inclusions = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "tour_available_dates", joinColumns = @JoinColumn(name = "tour_id"))
    @Column(name = "available_date")
    private Set<java.time.LocalDate> scheduledDepartureDates = new HashSet<>();

    @Enumerated(EnumType.STRING)
    private DifficultyLevel difficultyLevel;
    
    private String physicalRequirements;
    
    @Enumerated(EnumType.STRING)
    private VehicleType transportModeIncluded;
    
    @Enumerated(EnumType.STRING)
    private MealPlan mealsIncluded;
    
    private Boolean accommodationIncluded;
    private Boolean isPrivateTour;

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
    public Currency getCurrency() { return currency; }
    public void setCurrency(Currency currency) { this.currency = currency; }
    public Integer getDurationDays() { return durationDays; }
    public void setDurationDays(Integer durationDays) { this.durationDays = durationDays; }
    public TourCategory getCategory() { return category; }
    public void setCategory(TourCategory category) { this.category = category; }
    public SriLankanCity getStartingCity() { return startingCity; }
    public void setStartingCity(SriLankanCity startingCity) { this.startingCity = startingCity; }
    public String getOwnerId() { return ownerId; }
    public void setOwnerId(String ownerId) { this.ownerId = ownerId; }
    public OwnerType getOwnerType() { return ownerType; }
    public void setOwnerType(OwnerType ownerType) { this.ownerType = ownerType; }
    public Integer getMinGroupSize() { return minGroupSize; }
    public void setMinGroupSize(Integer minGroupSize) { this.minGroupSize = minGroupSize; }
    public Integer getMaxGroupSize() { return maxGroupSize; }
    public void setMaxGroupSize(Integer maxGroupSize) { this.maxGroupSize = maxGroupSize; }
    public List<String> getImageUrls() { return imageUrls; }
    public void setImageUrls(List<String> imageUrls) { this.imageUrls = imageUrls; }
    public List<ItineraryDay> getItineraryDays() { return itineraryDays; }
    public void setItineraryDays(List<ItineraryDay> itineraryDays) { this.itineraryDays = itineraryDays; }
    public List<GroupPricingTier> getPricingTiers() { return pricingTiers; }
    public void setPricingTiers(List<GroupPricingTier> pricingTiers) { this.pricingTiers = pricingTiers; }
    public List<TourPackageTranslation> getTranslations() { return translations; }
    public void setTranslations(List<TourPackageTranslation> translations) { this.translations = translations; }
    public List<Amenity> getInclusions() { return inclusions; }
    public void setInclusions(List<Amenity> inclusions) { this.inclusions = inclusions; }
    public Set<java.time.LocalDate> getScheduledDepartureDates() { return scheduledDepartureDates; }
    public void setScheduledDepartureDates(Set<java.time.LocalDate> scheduledDepartureDates) { this.scheduledDepartureDates = scheduledDepartureDates; }
    public DifficultyLevel getDifficultyLevel() { return difficultyLevel; }
    public void setDifficultyLevel(DifficultyLevel difficultyLevel) { this.difficultyLevel = difficultyLevel; }
    public String getPhysicalRequirements() { return physicalRequirements; }
    public void setPhysicalRequirements(String physicalRequirements) { this.physicalRequirements = physicalRequirements; }
    public VehicleType getTransportModeIncluded() { return transportModeIncluded; }
    public void setTransportModeIncluded(VehicleType transportModeIncluded) { this.transportModeIncluded = transportModeIncluded; }
    public MealPlan getMealsIncluded() { return mealsIncluded; }
    public void setMealsIncluded(MealPlan mealsIncluded) { this.mealsIncluded = mealsIncluded; }
    public Boolean getAccommodationIncluded() { return accommodationIncluded; }
    public void setAccommodationIncluded(Boolean accommodationIncluded) { this.accommodationIncluded = accommodationIncluded; }
    public Boolean getIsPrivateTour() { return isPrivateTour; }
    public void setIsPrivateTour(Boolean isPrivateTour) { this.isPrivateTour = isPrivateTour; }
}
