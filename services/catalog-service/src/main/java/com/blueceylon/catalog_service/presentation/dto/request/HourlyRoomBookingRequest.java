package com.blueceylon.catalog_service.presentation.dto.request;
public class HourlyRoomBookingRequest {
    private String roomId;
    private Integer minimumHours;
    private Integer maximumHours;
    private Double hourlyRate;
    private Double extraHourRate;
    private String availableSlots;
    private Integer maxOccupancy;
    private Integer cleaningBufferMinutes;
    private Boolean idVerificationRequired;

    public String getRoomId() { return roomId; }
    public void setRoomId(String roomId) { this.roomId = roomId; }
    public Integer getMinimumHours() { return minimumHours; }
    public void setMinimumHours(Integer minimumHours) { this.minimumHours = minimumHours; }
    public Integer getMaximumHours() { return maximumHours; }
    public void setMaximumHours(Integer maximumHours) { this.maximumHours = maximumHours; }
    public Double getHourlyRate() { return hourlyRate; }
    public void setHourlyRate(Double hourlyRate) { this.hourlyRate = hourlyRate; }
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
