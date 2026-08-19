package com.blueceylon.catalog_service.application.dto;

import java.io.Serializable;

public class BusinessApprovedEvent implements Serializable {
    private String ownerId;
    private String businessType; // HOTEL, TOUR_AGENCY, or TOUR_GUIDE

    public BusinessApprovedEvent() {}

    public BusinessApprovedEvent(String ownerId, String businessType) {
        this.ownerId = ownerId;
        this.businessType = businessType;
    }

    public String getOwnerId() { return ownerId; }
    public void setOwnerId(String ownerId) { this.ownerId = ownerId; }
    public String getBusinessType() { return businessType; }
    public void setBusinessType(String businessType) { this.businessType = businessType; }
}
