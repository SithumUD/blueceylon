package com.blueceylon.catalog_service.domain.model;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;


import jakarta.persistence.*;

@Entity
@Table(name = "group_pricing_tiers")
@SQLDelete(sql = "UPDATE group_pricing_tiers SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
public class GroupPricingTier extends BaseModel {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tour_id", nullable = false)
    private TourPackage tourPackage;


    @Column(name = "min_travelers", nullable = false)
    private Integer minTravelers;

    /** Null means "and above" â€” an open-ended top tier. */
    @Column(name = "max_travelers")
    private Integer maxTravelers;

    @Column(name = "price_per_person", nullable = false)
    private Double pricePerPerson;

    public TourPackage getTourPackage() { return tourPackage; }

    public void setTourPackage(TourPackage tourPackage) { this.tourPackage = tourPackage; }

    public Integer getMinTravelers() { return minTravelers; }
    public void setMinTravelers(Integer minTravelers) { this.minTravelers = minTravelers; }
    public Integer getMaxTravelers() { return maxTravelers; }
    public void setMaxTravelers(Integer maxTravelers) { this.maxTravelers = maxTravelers; }
    public Double getPricePerPerson() { return pricePerPerson; }
    public void setPricePerPerson(Double pricePerPerson) { this.pricePerPerson = pricePerPerson; }
}

