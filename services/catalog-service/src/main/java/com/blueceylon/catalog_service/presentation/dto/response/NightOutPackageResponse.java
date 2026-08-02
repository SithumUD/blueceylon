package com.blueceylon.catalog_service.presentation.dto.response;
import com.blueceylon.catalog_service.presentation.dto.request.NightOutPackageRequest;
public class NightOutPackageResponse extends NightOutPackageRequest {
    private String id;
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
}
