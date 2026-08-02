package com.blueceylon.auth_service.infrastructure.messaging;

public class BusinessApprovedEvent {
    private String ownerId;
    private String businessType; // HOTEL or TOUR_AGENCY

    public String getOwnerId() { return ownerId; }
    public void setOwnerId(String ownerId) { this.ownerId = ownerId; }
    public String getBusinessType() { return businessType; }
    public void setBusinessType(String businessType) { this.businessType = businessType; }
}
