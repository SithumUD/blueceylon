package com.blueceylon.catalog_service.presentation.dto.request;
import com.blueceylon.catalog_service.domain.model.enums.ViewType;
import com.blueceylon.catalog_service.domain.model.enums.RoomType;
import com.blueceylon.catalog_service.domain.model.enums.Currency;
import java.util.List;
public class RoomRequest {
    private String roomNumber;
    private RoomType roomType;
    private Double pricePerNight;
    private Currency currency;
    private Integer capacity;
    private Integer totalUnits;
    private Integer bedCount;
    private Double sizeSquareMeters;
    private List<String> imageUrls;
    private ViewType viewType;
    private String bedConfiguration;
    private Boolean smokingAllowed;
    private Boolean isHourlyBookable;

    public String getRoomNumber() { return roomNumber; }
    public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }
    public RoomType getRoomType() { return roomType; }
    public void setRoomType(RoomType roomType) { this.roomType = roomType; }
    public Double getPricePerNight() { return pricePerNight; }
    public void setPricePerNight(Double pricePerNight) { this.pricePerNight = pricePerNight; }
    public Currency getCurrency() { return currency; }
    public void setCurrency(Currency currency) { this.currency = currency; }
    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }
    public Integer getTotalUnits() { return totalUnits; }
    public void setTotalUnits(Integer totalUnits) { this.totalUnits = totalUnits; }
    public Integer getBedCount() { return bedCount; }
    public void setBedCount(Integer bedCount) { this.bedCount = bedCount; }
    public Double getSizeSquareMeters() { return sizeSquareMeters; }
    public void setSizeSquareMeters(Double sizeSquareMeters) { this.sizeSquareMeters = sizeSquareMeters; }
    public List<String> getImageUrls() { return imageUrls; }
    public void setImageUrls(List<String> imageUrls) { this.imageUrls = imageUrls; }
    public ViewType getViewType() { return viewType; }
    public void setViewType(ViewType viewType) { this.viewType = viewType; }
    public String getBedConfiguration() { return bedConfiguration; }
    public void setBedConfiguration(String bedConfiguration) { this.bedConfiguration = bedConfiguration; }
    public Boolean getSmokingAllowed() { return smokingAllowed; }
    public void setSmokingAllowed(Boolean smokingAllowed) { this.smokingAllowed = smokingAllowed; }
    public Boolean getIsHourlyBookable() { return isHourlyBookable; }
    public void setIsHourlyBookable(Boolean isHourlyBookable) { this.isHourlyBookable = isHourlyBookable; }
}

