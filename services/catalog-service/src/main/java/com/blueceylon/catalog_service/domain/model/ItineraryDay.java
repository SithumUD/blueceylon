package com.blueceylon.catalog_service.domain.model;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import com.blueceylon.catalog_service.domain.model.enums.MealPlan;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "itinerary_days", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"tour_id", "day_number"})
})
@SQLDelete(sql = "UPDATE itinerary_days SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
public class ItineraryDay extends BaseModel {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tour_id", nullable = false)
    private TourPackage tourPackage;

    @Column(name = "day_number", nullable = false)
    private Integer dayNumber;

    private String title;

    @Column(length = 2000)
    private String description;

    private String destinationName;
    private Double latitude;
    private Double longitude;

    private String accommodationNote;
    private String overnightLocation;

    @ElementCollection
    @CollectionTable(name = "itinerary_day_meals", joinColumns = @JoinColumn(name = "itinerary_day_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "meal")
    private List<MealPlan> meals = new ArrayList<>();

    private Double activityDurationHours;

    public TourPackage getTourPackage() { return tourPackage; }
    public void setTourPackage(TourPackage tourPackage) { this.tourPackage = tourPackage; }
    public Integer getDayNumber() { return dayNumber; }
    public void setDayNumber(Integer dayNumber) { this.dayNumber = dayNumber; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getDestinationName() { return destinationName; }
    public void setDestinationName(String destinationName) { this.destinationName = destinationName; }
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public String getAccommodationNote() { return accommodationNote; }
    public void setAccommodationNote(String accommodationNote) { this.accommodationNote = accommodationNote; }
    public String getOvernightLocation() { return overnightLocation; }
    public void setOvernightLocation(String overnightLocation) { this.overnightLocation = overnightLocation; }
    public List<MealPlan> getMeals() { return meals; }
    public void setMeals(List<MealPlan> meals) { this.meals = meals; }
    public Double getActivityDurationHours() { return activityDurationHours; }
    public void setActivityDurationHours(Double activityDurationHours) { this.activityDurationHours = activityDurationHours; }
}
