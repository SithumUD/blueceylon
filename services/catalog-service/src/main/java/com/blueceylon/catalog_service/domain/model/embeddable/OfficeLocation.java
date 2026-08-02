package com.blueceylon.catalog_service.domain.model.embeddable;
import com.blueceylon.catalog_service.domain.model.enums.SriLankanCity;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
@Embeddable
public class OfficeLocation {
    @Enumerated(EnumType.STRING)
    private SriLankanCity city;
    private String addressLine;
    public SriLankanCity getCity() { return city; }
    public void setCity(SriLankanCity city) { this.city = city; }
    public String getAddressLine() { return addressLine; }
    public void setAddressLine(String addressLine) { this.addressLine = addressLine; }
}
