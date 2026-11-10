package com.blueceylon.catalog_service.presentation.dto.response;

import com.blueceylon.catalog_service.domain.model.enums.SriLankanCity;
import com.blueceylon.catalog_service.presentation.dto.request.RoomRequest;

public class RoomResponse extends RoomRequest {
    private String id;
    private String hotelId;
    private String hotelName;
    private String hotelCoverImage;
    private Double hotelRating;
    private String hotelCity;
    private String hotelAddress;
    private Boolean sltdaVerified;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getHotelId() { return hotelId; }
    public void setHotelId(String hotelId) { this.hotelId = hotelId; }
    public String getHotelName() { return hotelName; }
    public void setHotelName(String hotelName) { this.hotelName = hotelName; }
    public String getHotelCoverImage() { return hotelCoverImage; }
    public void setHotelCoverImage(String hotelCoverImage) { this.hotelCoverImage = hotelCoverImage; }
    public Double getHotelRating() { return hotelRating; }
    public void setHotelRating(Double hotelRating) { this.hotelRating = hotelRating; }
    public String getHotelCity() { return hotelCity; }
    public void setHotelCity(String hotelCity) { this.hotelCity = hotelCity; }
    public String getHotelAddress() { return hotelAddress; }
    public void setHotelAddress(String hotelAddress) { this.hotelAddress = hotelAddress; }
    public Boolean getSltdaVerified() { return sltdaVerified; }
    public void setSltdaVerified(Boolean sltdaVerified) { this.sltdaVerified = sltdaVerified; }
}


