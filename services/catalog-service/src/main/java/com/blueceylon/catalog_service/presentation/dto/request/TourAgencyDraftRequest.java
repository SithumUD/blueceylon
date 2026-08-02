package com.blueceylon.catalog_service.presentation.dto.request;
import com.blueceylon.catalog_service.domain.model.enums.AgencySpecialization;
import com.blueceylon.catalog_service.domain.model.enums.VehicleType;
import java.util.List;

public class TourAgencyDraftRequest extends BaseBusinessDraftRequest {
    private String licenseNumber;
    private Integer yearsInOperation;
    private Integer partnerNetworkSize;
    private List<AgencySpecialization> specializations;
    private List<VehicleType> fleetTypes;

    public String getLicenseNumber() { return licenseNumber; }
    public void setLicenseNumber(String licenseNumber) { this.licenseNumber = licenseNumber; }
    public Integer getYearsInOperation() { return yearsInOperation; }
    public void setYearsInOperation(Integer yearsInOperation) { this.yearsInOperation = yearsInOperation; }
    public Integer getPartnerNetworkSize() { return partnerNetworkSize; }
    public void setPartnerNetworkSize(Integer partnerNetworkSize) { this.partnerNetworkSize = partnerNetworkSize; }
    public List<AgencySpecialization> getSpecializations() { return specializations; }
    public void setSpecializations(List<AgencySpecialization> specializations) { this.specializations = specializations; }
    public List<VehicleType> getFleetTypes() { return fleetTypes; }
    public void setFleetTypes(List<VehicleType> fleetTypes) { this.fleetTypes = fleetTypes; }
}
