package com.blueceylon.catalog_service.presentation.mapper;

import com.blueceylon.catalog_service.domain.model.Business;
import com.blueceylon.catalog_service.domain.model.Hotel;
import com.blueceylon.catalog_service.domain.model.TourAgency;
import com.blueceylon.catalog_service.domain.model.TourGuideProfile;
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
            response.setTagline(business.getTagline());
            response.setContactEmail(business.getContactEmail());
            response.setContactPhone(business.getContactPhone());
            response.setWhatsappNumber(business.getWhatsappNumber());
            response.setWebsite(business.getWebsite());
            response.setSocialLinks(business.getSocialLinks());
            response.setCity(business.getCity());
            response.setRegion(business.getRegion());
            response.setAddressLine(business.getAddressLine());
            response.setLatitude(business.getLatitude());
            response.setLongitude(business.getLongitude());
            response.setCoverImageUrl(business.getCoverImageUrl());
            if (business.getGalleryImageUrls() != null) {
                response.setGalleryImageUrls(new ArrayList<>(business.getGalleryImageUrls()));
            }
            response.setVideoUrl(business.getVideoUrl());
            response.setAverageRating(business.getAverageRating());
            response.setReviewCount(business.getReviewCount());
            response.setYearsInOperation(business.getYearsInBusiness());
            if (business.getSustainabilityBadges() != null) {
                response.setSustainabilityBadges(new ArrayList<>(business.getSustainabilityBadges()));
            }
            response.setCancellationPolicy(business.getCancellationPolicy());
            if (business.getPaymentMethods() != null) {
                response.setPaymentMethods(new ArrayList<>(business.getPaymentMethods()));
            }
            response.setDepositRequired(business.getDepositRequired());
            response.setDepositPercentage(business.getDepositPercentage());

            if (business instanceof Hotel) {
                Hotel hotel = (Hotel) business;
                response.setStarRating(hotel.getStarRating());
                response.setTotalBranches(hotel.getTotalBranches());
                response.setPropertyType(hotel.getPropertyType());
                response.setCheckInTime(hotel.getCheckInTime() != null ? hotel.getCheckInTime().toString() : null);
                response.setCheckOutTime(hotel.getCheckOutTime() != null ? hotel.getCheckOutTime().toString() : null);
                response.setPetPolicy(hotel.getPetPolicy());
                response.setTotalRooms(hotel.getTotalRooms());
                response.setOffersDayOutPackages(hotel.getOffersDayOutPackages());
                response.setOffersNightOutPackages(hotel.getOffersNightOutPackages());
                response.setOffersHourlyBooking(hotel.getOffersHourlyBooking());
                response.setSltdaLicenseNumber(hotel.getSltdaLicenseNumber());
                response.setLicenseNumber(hotel.getSltdaLicenseNumber());

                if (hotel.getRooms() != null && !hotel.getRooms().isEmpty()) {
                    double minPrice = hotel.getRooms().stream()
                            .filter(r -> r.getPricePerNight() != null)
                            .mapToDouble(r -> r.getPricePerNight())
                            .min()
                            .orElse(0.0);
                    response.setPriceStartFrom(minPrice);
                }
            } else if (business instanceof TourAgency) {
                TourAgency agency = (TourAgency) business;
                response.setLicenseNumber(agency.getLicenseNumber());
                response.setSltdaLicenseNumber(agency.getLicenseNumber());
                response.setYearsInOperation(agency.getYearsInBusiness());
                response.setPartnerNetworkSize(agency.getPartnerNetworkSize());
                if (agency.getSpecializations() != null) {
                    response.setSpecializations(new ArrayList<>(agency.getSpecializations()));
                }
                if (agency.getFleetTypes() != null) {
                    response.setFleetTypes(new ArrayList<>(agency.getFleetTypes()));
                }
            }
        } else if (entity instanceof TourGuideProfile) {
            TourGuideProfile guide = (TourGuideProfile) entity;
            response.setId(guide.getId());
            response.setStatus(guide.getStatus());
            
            response.setName(guide.getName());
            response.setTagline(guide.getTagline());
            response.setDescription(guide.getDescription());
            response.setContactEmail(guide.getContactEmail());
            response.setContactPhone(guide.getContactPhone());
            response.setWhatsappNumber(guide.getWhatsappNumber());
            response.setCity(guide.getCity());
            response.setRegion(guide.getRegion());
            response.setAddressLine(guide.getAddressLine());
            response.setCoverImageUrl(guide.getCoverImageUrl());
            if (guide.getGalleryImageUrls() != null) {
                response.setGalleryImageUrls(new ArrayList<>(guide.getGalleryImageUrls()));
            }
            response.setVideoUrl(guide.getVideoUrl());
            response.setAverageRating(guide.getAverageRating());
            response.setReviewCount(guide.getReviewCount());
            
            response.setLicenseNumber(guide.getSltdaLicenseNumber());
            response.setSltdaLicenseNumber(guide.getSltdaLicenseNumber());
            response.setLicenseType(guide.getLicenseType());
            if (guide.getLanguagesSpoken() != null) {
                response.setLanguagesSpoken(new ArrayList<>(guide.getLanguagesSpoken()));
            }
            response.setYearsOfExperience(guide.getYearsOfExperience());
            response.setVehicleType(guide.getVehicleType());
            response.setVehicleModel(guide.getVehicleModel());
            response.setVehicleAirConditioned(guide.getVehicleAirConditioned());
            response.setCurrency(guide.getCurrency());
            response.setMaxGroupSizeGuided(guide.getMaxGroupSizeGuided());
            response.setDailyRate(guide.getDailyRate());
            response.setHalfDayRate(guide.getHalfDayRate());
            if (guide.getSustainabilityBadges() != null) {
                response.setSustainabilityBadges(new ArrayList<>(guide.getSustainabilityBadges()));
            }
            response.setCancellationPolicy(guide.getCancellationPolicy());
            if (guide.getPaymentMethods() != null) {
                response.setPaymentMethods(new ArrayList<>(guide.getPaymentMethods()));
            }
        }

        return response;
    }
}
