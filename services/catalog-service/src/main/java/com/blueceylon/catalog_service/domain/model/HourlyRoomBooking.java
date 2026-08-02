package com.blueceylon.catalog_service.domain.model;
import com.blueceylon.catalog_service.domain.model.enums.*;
import jakarta.persistence.*;

@Entity
@Table(name = "hourly_room_bookings")
public class HourlyRoomBooking extends BaseModel {
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id")
    private Room room;
    
    private Integer minimumHours;
    private Integer maximumHours;
    private Double hourlyRate;
    @Enumerated(EnumType.STRING)
    private Currency currency = Currency.LKR;
    private Double extraHourRate;
    private String availableSlots;
    private Integer maxOccupancy;
    private Integer cleaningBufferMinutes;
    private Boolean idVerificationRequired;

    public Room getRoom() { return room; }
    public void setRoom(Room room) { this.room = room; }
    public Integer getMinimumHours() { return minimumHours; }
    public void setMinimumHours(Integer minimumHours) { this.minimumHours = minimumHours; }
    public Integer getMaximumHours() { return maximumHours; }
    public void setMaximumHours(Integer maximumHours) { this.maximumHours = maximumHours; }
    public Double getHourlyRate() { return hourlyRate; }
    public void setHourlyRate(Double hourlyRate) { this.hourlyRate = hourlyRate; }
    public Currency getCurrency() { return currency; }
    public void setCurrency(Currency currency) { this.currency = currency; }
    public Double getExtraHourRate() { return extraHourRate; }
    public void setExtraHourRate(Double extraHourRate) { this.extraHourRate = extraHourRate; }
    public String getAvailableSlots() { return availableSlots; }
    public void setAvailableSlots(String availableSlots) { this.availableSlots = availableSlots; }
    public Integer getMaxOccupancy() { return maxOccupancy; }
    public void setMaxOccupancy(Integer maxOccupancy) { this.maxOccupancy = maxOccupancy; }
    public Integer getCleaningBufferMinutes() { return cleaningBufferMinutes; }
    public void setCleaningBufferMinutes(Integer cleaningBufferMinutes) { this.cleaningBufferMinutes = cleaningBufferMinutes; }
    public Boolean getIdVerificationRequired() { return idVerificationRequired; }
    public void setIdVerificationRequired(Boolean idVerificationRequired) { this.idVerificationRequired = idVerificationRequired; }
}
