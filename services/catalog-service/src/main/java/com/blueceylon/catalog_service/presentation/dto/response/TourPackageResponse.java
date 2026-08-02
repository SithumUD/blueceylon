package com.blueceylon.catalog_service.presentation.dto.response;
import com.blueceylon.catalog_service.presentation.dto.request.TourPackageRequest;
public class TourPackageResponse extends TourPackageRequest {
    private String id;
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
}
