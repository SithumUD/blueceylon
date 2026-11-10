package com.blueceylon.booking_service.presentation.dto.response;

public class AvailabilityCheckResponse {
    private boolean available;
    private int availableUnits;
    private String message;
    private Double pricePerNight;
    private Long totalNights;
    private Double totalPrice;

    public AvailabilityCheckResponse() {}

    public AvailabilityCheckResponse(boolean available, int availableUnits, String message) {
        this.available = available;
        this.availableUnits = availableUnits;
        this.message = message;
    }

    public boolean isAvailable() { return available; }
    public void setAvailable(boolean available) { this.available = available; }
    public int getAvailableUnits() { return availableUnits; }
    public void setAvailableUnits(int availableUnits) { this.availableUnits = availableUnits; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public Double getPricePerNight() { return pricePerNight; }
    public void setPricePerNight(Double pricePerNight) { this.pricePerNight = pricePerNight; }
    public Long getTotalNights() { return totalNights; }
    public void setTotalNights(Long totalNights) { this.totalNights = totalNights; }
    public Double getTotalPrice() { return totalPrice; }
    public void setTotalPrice(Double totalPrice) { this.totalPrice = totalPrice; }
}
