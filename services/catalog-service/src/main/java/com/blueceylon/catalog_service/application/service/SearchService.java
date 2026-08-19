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
    private final BusinessMapper businessMapper;

    public SearchService(BusinessRepository businessRepository, TourGuideProfileRepository guideRepository, RoomRepository roomRepository, TourPackageRepository tourPackageRepository, BusinessMapper businessMapper) {
        this.businessRepository = businessRepository;
        this.guideRepository = guideRepository;
        this.roomRepository = roomRepository;
        this.tourPackageRepository = tourPackageRepository;
        this.businessMapper = businessMapper;
    }

    public Page<BusinessSummaryResponse> searchBusinesses(BusinessType type, SriLankanCity city, Pageable pageable) {
        if (type == BusinessType.TOUR_GUIDE) {
            return guideRepository.searchGuides(city, pageable).map(g -> {
                BusinessSummaryResponse r = new BusinessSummaryResponse();
                r.setId(g.getId());
                r.setName(g.getName());
                r.setTagline(g.getTagline());
                r.setType(BusinessType.TOUR_GUIDE);
                r.setCity(g.getCity());
                r.setCoverImageUrl(g.getCoverImageUrl());
                r.setAverageRating(g.getAverageRating() != null ? g.getAverageRating() : 5.0);
                r.setReviewCount(g.getReviewCount() != null ? g.getReviewCount() : 0);
                return r;
            });
        }
        return businessRepository.searchBusinesses(type, city, pageable).map(b -> {
            BusinessSummaryResponse r = new BusinessSummaryResponse();
            r.setId(b.getId());
            r.setName(b.getName());
            r.setTagline(b.getTagline());
            r.setType(b.getType());
            r.setCity(b.getCity());
            r.setCoverImageUrl(b.getCoverImageUrl());
            r.setAverageRating(b.getAverageRating());
            r.setReviewCount(b.getReviewCount());
            return r;
        });
    }

    public Page<RoomResponse> searchRooms(SriLankanCity city, Double minPrice, Double maxPrice, Pageable pageable) {
        return roomRepository.searchRooms(city, minPrice != null ? minPrice : 0.0, maxPrice != null ? maxPrice : Double.MAX_VALUE, pageable).map(r -> {
            RoomResponse resp = new RoomResponse();
            BeanUtils.copyProperties(r, resp);
            return resp;
        });
    }

    public Page<TourPackageResponse> searchTours(SriLankanCity city, TourCategory category, com.blueceylon.catalog_service.domain.model.enums.OwnerType ownerType, Double minPrice, Double maxPrice, Pageable pageable) {
        return tourPackageRepository.searchTours(city, category, ownerType, minPrice != null ? minPrice : 0.0, maxPrice != null ? maxPrice : Double.MAX_VALUE, pageable).map(t -> {
            TourPackageResponse resp = new TourPackageResponse();
            BeanUtils.copyProperties(t, resp);
            return resp;
        });
    }
}
