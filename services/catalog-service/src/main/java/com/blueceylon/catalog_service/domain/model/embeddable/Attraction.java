package com.blueceylon.catalog_service.domain.model.embeddable;
import jakarta.persistence.Embeddable;
@Embeddable
public class Attraction {
    private String name;
    private Double distanceKm;
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Double getDistanceKm() { return distanceKm; }
    public void setDistanceKm(Double distanceKm) { this.distanceKm = distanceKm; }
}
