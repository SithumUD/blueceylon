package com.blueceylon.booking_service.infrastructure.client.dto;

public class CatalogItemDto {
    private String id;
    private Double price;
    private Double pricePerNight;
    private Integer totalUnits;
    private Integer dailyLimit;
    private Integer capacity;

    // We'll normalize the values based on what came back
    public Double getNormalizedPrice() {
        return pricePerNight != null ? pricePerNight : price;
    }

    public Integer getNormalizedCapacity() {
        if (totalUnits != null) return totalUnits;
        if (dailyLimit != null) return dailyLimit;
        return 1; // Default fallback
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
    public Double getPricePerNight() { return pricePerNight; }
    public void setPricePerNight(Double pricePerNight) { this.pricePerNight = pricePerNight; }
    public Integer getTotalUnits() { return totalUnits; }
    public void setTotalUnits(Integer totalUnits) { this.totalUnits = totalUnits; }
    public Integer getDailyLimit() { return dailyLimit; }
    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }
    public void setDailyLimit(Integer dailyLimit) { this.dailyLimit = dailyLimit; }
}

