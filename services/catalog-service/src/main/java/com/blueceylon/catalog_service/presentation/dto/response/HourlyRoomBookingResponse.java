package com.blueceylon.catalog_service.presentation.dto.response;
import com.blueceylon.catalog_service.presentation.dto.request.HourlyRoomBookingRequest;
public class HourlyRoomBookingResponse extends HourlyRoomBookingRequest {
    private String id;
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
}
