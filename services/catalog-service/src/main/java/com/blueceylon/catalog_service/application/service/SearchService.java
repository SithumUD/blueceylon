package com.blueceylon.catalog_service.application.service;

import com.blueceylon.catalog_service.domain.model.enums.BusinessType;
import com.blueceylon.catalog_service.domain.model.enums.SriLankanCity;
import com.blueceylon.catalog_service.domain.model.enums.TourCategory;
import com.blueceylon.catalog_service.domain.repository.RoomRepository;
import com.blueceylon.catalog_service.domain.repository.TourPackageRepository;
import com.blueceylon.catalog_service.infrastructure.persistence.repository.BusinessRepository;
import com.blueceylon.catalog_service.presentation.dto.response.BusinessSummaryResponse;
import com.blueceylon.catalog_service.presentation.dto.response.RoomResponse;
import com.blueceylon.catalog_service.presentation.dto.response.TourPackageResponse;
import com.blueceylon.catalog_service.presentation.mapper.BusinessMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.blueceylon.catalog_service.infrastructure.persistence.repository.TourGuideProfileRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.BeanUtils;

@Service
@Transactional(readOnly = true)
public class SearchService {

    private final BusinessRepository businessRepository;
    private final TourGuideProfileRepository guideRepository;
    private final RoomRepository roomRepository;
    private final TourPackageRepository tourPackageRepository;
    private final TourPackageService tourPackageService;
    private final BusinessMapper businessMapper;

    public SearchService(BusinessRepository businessRepository, TourGuideProfileRepository guideRepository, RoomRepository roomRepository, TourPackageRepository tourPackageRepository, TourPackageService tourPackageService, BusinessMapper businessMapper) {
        this.businessRepository = businessRepository;
        this.guideRepository = guideRepository;
        this.roomRepository = roomRepository;
        this.tourPackageRepository = tourPackageRepository;
        this.tourPackageService = tourPackageService;
        this.businessMapper = businessMapper;
    }

    public Page<BusinessSummaryResponse> searchBusinesses(BusinessType type, SriLankanCity city, Pageable pageable) {
        if (type == BusinessType.TOUR_GUIDE) {
            return guideRepository.searchGuides(city, pageable).map(g -> {
                BusinessSummaryResponse r = new BusinessSummaryResponse();
                r.setId(g.getId());
                r.setName(g.getName());
                r.setTagline(g.getTagline());
                r.setDescription(g.getDescription());
                r.setType(BusinessType.TOUR_GUIDE);
                r.setCity(g.getCity());
                r.setRegion(g.getRegion());
                r.setAddressLine(g.getAddressLine());
                r.setCoverImageUrl(g.getCoverImageUrl());
                r.setAverageRating(g.getAverageRating() != null ? g.getAverageRating() : 5.0);
                r.setReviewCount(g.getReviewCount() != null ? g.getReviewCount() : 0);
                r.setVerificationStatus(g.getVerificationStatus());
                r.setContactEmail(g.getContactEmail());
                r.setContactPhone(g.getContactPhone());
                r.setWhatsappNumber(g.getWhatsappNumber());
                r.setSltdaLicenseNumber(g.getSltdaLicenseNumber());
                r.setLicenseNumber(g.getSltdaLicenseNumber());
                r.setLicenseType(g.getLicenseType());
                if (g.getLanguagesSpoken() != null) {
                    r.setLanguagesSpoken(new java.util.ArrayList<>(g.getLanguagesSpoken()));
                }
                r.setYearsOfExperience(g.getYearsOfExperience());
                r.setVehicleType(g.getVehicleType());
                r.setVehicleModel(g.getVehicleModel());
                r.setVehicleAirConditioned(g.getVehicleAirConditioned());
                r.setCurrency(g.getCurrency());
                if (g.getSpecialtyAreas() != null) {
                    r.setSpecialtyAreas(new java.util.ArrayList<>(g.getSpecialtyAreas()));
                }
                r.setDailyRate(g.getDailyRate());
                r.setHalfDayRate(g.getHalfDayRate());
                r.setMaxGroupSizeGuided(g.getMaxGroupSizeGuided());
                return r;
            });
        }
        return businessRepository.searchBusinesses(type, city, pageable).map(b -> {
            BusinessSummaryResponse r = new BusinessSummaryResponse();
            r.setId(b.getId());
            r.setName(b.getName());
            r.setTagline(b.getTagline());
            r.setDescription(b.getDescription());
            r.setType(b.getType());
            r.setCity(b.getCity());
            r.setRegion(b.getRegion());
            r.setAddressLine(b.getAddressLine());
            r.setCoverImageUrl(b.getCoverImageUrl());
            r.setAverageRating(b.getAverageRating());
            r.setReviewCount(b.getReviewCount());
            r.setContactEmail(b.getContactEmail());
            r.setContactPhone(b.getContactPhone());
            r.setWhatsappNumber(b.getWhatsappNumber());

            if (b instanceof com.blueceylon.catalog_service.domain.model.Hotel) {
                com.blueceylon.catalog_service.domain.model.Hotel h = (com.blueceylon.catalog_service.domain.model.Hotel) b;
                r.setStarRating(h.getStarRating());
                r.setSltdaLicenseNumber(h.getSltdaLicenseNumber());
                r.setLicenseNumber(h.getSltdaLicenseNumber());
                if (h.getRooms() != null && !h.getRooms().isEmpty()) {
                    double minPrice = h.getRooms().stream()
                            .filter(rm -> rm.getPricePerNight() != null)
                            .mapToDouble(rm -> rm.getPricePerNight())
                            .min()
                            .orElse(0.0);
                    r.setPriceStartFrom(minPrice);
                }
            } else if (b instanceof com.blueceylon.catalog_service.domain.model.TourAgency) {
                com.blueceylon.catalog_service.domain.model.TourAgency a = (com.blueceylon.catalog_service.domain.model.TourAgency) b;
                r.setLicenseNumber(a.getLicenseNumber());
                r.setSltdaLicenseNumber(a.getLicenseNumber());
                if (a.getSpecializations() != null) {
                    r.setSpecializations(new java.util.ArrayList<>(a.getSpecializations()));
                }
                if (a.getFleetTypes() != null) {
                    r.setFleetTypes(new java.util.ArrayList<>(a.getFleetTypes()));
                }
            }
            return r;
        });
    }

    public Page<RoomResponse> searchRooms(SriLankanCity city, Double minPrice, Double maxPrice, Pageable pageable) {
        return roomRepository.searchRooms(city, minPrice != null ? minPrice : 0.0, maxPrice != null ? maxPrice : Double.MAX_VALUE, pageable).map(r -> {
            RoomResponse resp = new RoomResponse();
            BeanUtils.copyProperties(r, resp);
            resp.setDisplayName(r.getDisplayName() != null && !r.getDisplayName().trim().isEmpty()
                    ? r.getDisplayName()
                    : (r.getRoomType() != null ? r.getRoomType().name().replace("_", " ") + " Room" : ("Room " + r.getRoomNumber())));
            resp.setCity(r.getCity());
            if (r.getHotel() != null) {
                resp.setHotelId(r.getHotel().getId());
                resp.setHotelName(r.getHotel().getName());
                resp.setHotelCoverImage(r.getHotel().getCoverImageUrl());
                resp.setHotelRating(r.getHotel().getAverageRating() != null ? r.getHotel().getAverageRating() : 5.0);
                if (r.getHotel().getCity() != null) {
                    resp.setHotelCity(r.getHotel().getCity().name());
                }
                resp.setHotelAddress(r.getHotel().getAddressLine());
                resp.setSltdaVerified(r.getHotel().getVerificationStatus() == com.blueceylon.catalog_service.domain.model.enums.VerificationStatus.VERIFIED);
            }
            return resp;
        });
    }

    public Page<TourPackageResponse> searchTours(SriLankanCity city, TourCategory category, com.blueceylon.catalog_service.domain.model.enums.OwnerType ownerType, Double minPrice, Double maxPrice, Pageable pageable) {
        return tourPackageRepository.searchTours(city, category, ownerType, minPrice, maxPrice, pageable)
                .map(tourPackageService::mapToResponse);
    }
}
