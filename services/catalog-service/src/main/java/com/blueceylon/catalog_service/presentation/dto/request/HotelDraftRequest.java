package com.blueceylon.catalog_service.presentation.dto.request;
import com.blueceylon.catalog_service.domain.model.enums.PropertyType;
import com.blueceylon.catalog_service.domain.model.enums.PetPolicy;
import java.time.LocalTime;

public class HotelDraftRequest extends BaseBusinessDraftRequest {
    private Integer starRating;
    private Integer totalBranches;
    private PropertyType propertyType;
    private LocalTime checkInTime;
    private LocalTime checkOutTime;
    private PetPolicy petPolicy;
    private Integer totalRooms;
    private Boolean offersDayOutPackages;
    private Boolean offersNightOutPackages;
    private Boolean offersHourlyBooking;

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
    public PetPolicy getPetPolicy() { return petPolicy; }
    public void setPetPolicy(PetPolicy petPolicy) { this.petPolicy = petPolicy; }
    public Integer getTotalRooms() { return totalRooms; }
    public void setTotalRooms(Integer totalRooms) { this.totalRooms = totalRooms; }
    public Boolean getOffersDayOutPackages() { return offersDayOutPackages; }
    public void setOffersDayOutPackages(Boolean offersDayOutPackages) { this.offersDayOutPackages = offersDayOutPackages; }
    public Boolean getOffersNightOutPackages() { return offersNightOutPackages; }
    public void setOffersNightOutPackages(Boolean offersNightOutPackages) { this.offersNightOutPackages = offersNightOutPackages; }
    public Boolean getOffersHourlyBooking() { return offersHourlyBooking; }
    public void setOffersHourlyBooking(Boolean offersHourlyBooking) { this.offersHourlyBooking = offersHourlyBooking; }
}
