package com.blueceylon.catalog_service.presentation.dto.response;

import com.blueceylon.catalog_service.domain.model.Amenity;
import com.blueceylon.catalog_service.domain.model.enums.Currency;
import com.blueceylon.catalog_service.domain.model.enums.SriLankanCity;
import com.blueceylon.catalog_service.presentation.dto.request.DayOutPackageRequest;
import java.util.List;

public class DayOutPackageResponse extends DayOutPackageRequest {
    private String id;
    private String hotelId;
    private String hotelName;
    private SriLankanCity hotelCity;
    private String hotelCoverImage;
    private Boolean sltdaVerified;
    private Currency currency;
    private List<Amenity> inclusions;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getHotelId() { return hotelId; }
    public void setHotelId(String hotelId) { this.hotelId = hotelId; }
    public String getHotelName() { return hotelName; }
    public void setHotelName(String hotelName) { this.hotelName = hotelName; }
    public SriLankanCity getHotelCity() { return hotelCity; }
    public void setHotelCity(SriLankanCity hotelCity) { this.hotelCity = hotelCity; }
    public String getHotelCoverImage() { return hotelCoverImage; }
    public void setHotelCoverImage(String hotelCoverImage) { this.hotelCoverImage = hotelCoverImage; }
    public Boolean getSltdaVerified() { return sltdaVerified; }
    public void setSltdaVerified(Boolean sltdaVerified) { this.sltdaVerified = sltdaVerified; }
    public Currency getCurrency() { return currency; }
    public void setCurrency(Currency currency) { this.currency = currency; }
    public List<Amenity> getInclusions() { return inclusions; }
    public void setInclusions(List<Amenity> inclusions) { this.inclusions = inclusions; }
}
