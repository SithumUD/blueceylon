package com.blueceylon.catalog_service.domain.model;

import com.blueceylon.catalog_service.domain.model.enums.*;
import com.blueceylon.catalog_service.domain.model.embeddable.*;
import jakarta.persistence.*;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@DiscriminatorValue("HOTEL")
public class Hotel extends Business {

    @Column(name = "star_rating")
    private Integer starRating;

    @Column(name = "total_branches")
    private Integer totalBranches = 1;

    @Enumerated(EnumType.STRING)
    private PropertyType propertyType;

    private LocalTime checkInTime;
    private LocalTime checkOutTime;

    @ManyToMany
    @JoinTable(
            name = "hotel_facilities",
            joinColumns = @JoinColumn(name = "hotel_id"),
            inverseJoinColumns = @JoinColumn(name = "amenity_id")
    )
    private List<Amenity> facilities = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "hotel_dining_options", joinColumns = @JoinColumn(name = "hotel_id"))
    private List<DiningOption> diningOptions = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    private PetPolicy petPolicy;

    @Embedded
    private ChildPolicy childPolicy;

    private Integer totalRooms;
    private Boolean offersDayOutPackages;
    private Boolean offersNightOutPackages;
    private Boolean offersHourlyBooking;

    @OneToMany(mappedBy = "hotel", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Room> rooms = new ArrayList<>();

    public Integer getStarRating() { return starRating; }
    public void setStarRating(Integer starRating) { this.starRating = starRating; }
    public Integer getTotalBranches() { return totalBranches; }
    public void setTotalBranches(Integer totalBranches) { this.totalBranches = totalBranches; }
    public PropertyType getPropertyType() { return propertyType; }
    public void setPropertyType(PropertyType propertyType) { this.propertyType = propertyType; }
    public LocalTime getCheckInTime() { return checkInTime; }
    public void setCheckInTime(LocalTime checkInTime) { this.checkInTime = checkInTime; }
    public LocalTime getCheckOutTime() { return checkOutTime; }
    public void setCheckOutTime(LocalTime checkOutTime) { this.checkOutTime = checkOutTime; }
    public List<Amenity> getFacilities() { return facilities; }
    public void setFacilities(List<Amenity> facilities) { this.facilities = facilities; }
    public List<DiningOption> getDiningOptions() { return diningOptions; }
    public void setDiningOptions(List<DiningOption> diningOptions) { this.diningOptions = diningOptions; }
    public PetPolicy getPetPolicy() { return petPolicy; }
    public void setPetPolicy(PetPolicy petPolicy) { this.petPolicy = petPolicy; }
    public ChildPolicy getChildPolicy() { return childPolicy; }
    public void setChildPolicy(ChildPolicy childPolicy) { this.childPolicy = childPolicy; }
    public Integer getTotalRooms() { return totalRooms; }
    public void setTotalRooms(Integer totalRooms) { this.totalRooms = totalRooms; }
    public Boolean getOffersDayOutPackages() { return offersDayOutPackages; }
    public void setOffersDayOutPackages(Boolean offersDayOutPackages) { this.offersDayOutPackages = offersDayOutPackages; }
    public Boolean getOffersNightOutPackages() { return offersNightOutPackages; }
    public void setOffersNightOutPackages(Boolean offersNightOutPackages) { this.offersNightOutPackages = offersNightOutPackages; }
    public Boolean getOffersHourlyBooking() { return offersHourlyBooking; }
    public void setOffersHourlyBooking(Boolean offersHourlyBooking) { this.offersHourlyBooking = offersHourlyBooking; }
    public List<Room> getRooms() { return rooms; }
    public void setRooms(List<Room> rooms) { this.rooms = rooms; }
}
