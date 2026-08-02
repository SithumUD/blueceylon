package com.blueceylon.catalog_service.presentation.dto.request;
import com.blueceylon.catalog_service.domain.model.enums.*;
import java.util.List;
public class TourPackageRequest {
    private String title;
    private String description;
    private Double price;
    private Integer durationDays;
    private TourCategory category;
    private SriLankanCity startingCity;
    private Integer minGroupSize;
    private Integer maxGroupSize;
    private List<String> imageUrls;
    private DifficultyLevel difficultyLevel;
    private String physicalRequirements;
    private VehicleType transportModeIncluded;
    private MealPlan mealsIncluded;
    private Boolean accommodationIncluded;
    private Boolean isPrivateTour;

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
    public Integer getDurationDays() { return durationDays; }
    public void setDurationDays(Integer durationDays) { this.durationDays = durationDays; }
    public TourCategory getCategory() { return category; }
    public void setCategory(TourCategory category) { this.category = category; }
    public SriLankanCity getStartingCity() { return startingCity; }
    public void setStartingCity(SriLankanCity startingCity) { this.startingCity = startingCity; }
    public Integer getMinGroupSize() { return minGroupSize; }
    public void setMinGroupSize(Integer minGroupSize) { this.minGroupSize = minGroupSize; }
    public Integer getMaxGroupSize() { return maxGroupSize; }
    public void setMaxGroupSize(Integer maxGroupSize) { this.maxGroupSize = maxGroupSize; }
    public List<String> getImageUrls() { return imageUrls; }
    public void setImageUrls(List<String> imageUrls) { this.imageUrls = imageUrls; }
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
