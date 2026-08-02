package com.blueceylon.catalog_service.presentation.mapper;

import com.blueceylon.catalog_service.domain.model.Business;
import com.blueceylon.catalog_service.domain.model.Hotel;
import com.blueceylon.catalog_service.domain.model.TourAgency;
import com.blueceylon.catalog_service.domain.model.TourGuideProfile;
import com.blueceylon.catalog_service.domain.model.enums.BusinessType;
import com.blueceylon.catalog_service.presentation.dto.response.BusinessProfileResponse;
import org.springframework.stereotype.Component;
import java.util.ArrayList;

@Component
public class BusinessMapper {

    public BusinessProfileResponse toResponse(Object entity) {
        if (entity == null) {
            return null;
        }

        BusinessProfileResponse response = new BusinessProfileResponse();

        if (entity instanceof Business) {
            Business business = (Business) entity;
            response.setId(business.getId());
            response.setType(business.getType());
            response.setStatus(business.getStatus());
            response.setRejectionReason(business.getRejectionReason());
            
            response.setName(business.getName());
            response.setDescription(business.getDescription());
            response.setContactEmail(business.getContactEmail());
            response.setContactPhone(business.getContactPhone());
            response.setCity(business.getCity());
            response.setAddressLine(business.getAddressLine());
            response.setLatitude(business.getLatitude());
            response.setLongitude(business.getLongitude());
            response.setCoverImageUrl(business.getCoverImageUrl());

            if (business instanceof Hotel) {
                Hotel hotel = (Hotel) business;
                response.setStarRating(hotel.getStarRating());
                response.setTotalBranches(hotel.getTotalBranches());
            } else if (business instanceof TourAgency) {
                TourAgency agency = (TourAgency) business;
                response.setLicenseNumber(agency.getLicenseNumber());
                response.setYearsInOperation(agency.getYearsInBusiness());
            }
        } else if (entity instanceof TourGuideProfile) {
            TourGuideProfile guide = (TourGuideProfile) entity;
            response.setId(guide.getId());
            // Map guide to a custom type or leave null
            response.setStatus(guide.getStatus());
            
            response.setName(guide.getName());
            response.setDescription(guide.getDescription());
            response.setCoverImageUrl(guide.getCoverImageUrl());
            
            response.setLicenseNumber(guide.getSltdaLicenseNumber());
            if (guide.getLanguagesSpoken() != null) {
                response.setLanguagesSpoken(new ArrayList<>(guide.getLanguagesSpoken()));
            }
            response.setYearsOfExperience(guide.getYearsOfExperience());
            response.setVehicleType(guide.getVehicleType());
        }

        return response;
    }
}
