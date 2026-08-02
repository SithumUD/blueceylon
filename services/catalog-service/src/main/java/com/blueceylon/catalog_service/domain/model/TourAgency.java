package com.blueceylon.catalog_service.domain.model;

import com.blueceylon.catalog_service.domain.model.enums.AgencySpecialization;
import com.blueceylon.catalog_service.domain.model.enums.VehicleType;
import com.blueceylon.catalog_service.domain.model.embeddable.OfficeLocation;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@DiscriminatorValue("TOUR_AGENCY")
public class TourAgency extends Business {

    @Column(name = "license_number")
    private String licenseNumber;

    @ElementCollection
    @CollectionTable(name = "agency_specializations", joinColumns = @JoinColumn(name = "agency_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "specialization")
    private List<AgencySpecialization> specializations = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "agency_fleet_types", joinColumns = @JoinColumn(name = "agency_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "vehicle_type")
    private List<VehicleType> fleetTypes = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "agency_office_locations", joinColumns = @JoinColumn(name = "agency_id"))
    private List<OfficeLocation> officeLocations = new ArrayList<>();

    private Integer partnerNetworkSize;

    public String getLicenseNumber() { return licenseNumber; }
    public void setLicenseNumber(String licenseNumber) { this.licenseNumber = licenseNumber; }
    public List<AgencySpecialization> getSpecializations() { return specializations; }
    public void setSpecializations(List<AgencySpecialization> specializations) { this.specializations = specializations; }
    public List<VehicleType> getFleetTypes() { return fleetTypes; }
    public void setFleetTypes(List<VehicleType> fleetTypes) { this.fleetTypes = fleetTypes; }
    public List<OfficeLocation> getOfficeLocations() { return officeLocations; }
    public void setOfficeLocations(List<OfficeLocation> officeLocations) { this.officeLocations = officeLocations; }
    public Integer getPartnerNetworkSize() { return partnerNetworkSize; }
    public void setPartnerNetworkSize(Integer partnerNetworkSize) { this.partnerNetworkSize = partnerNetworkSize; }
}
