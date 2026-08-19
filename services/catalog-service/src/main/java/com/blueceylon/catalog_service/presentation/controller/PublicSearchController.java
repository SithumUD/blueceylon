package com.blueceylon.catalog_service.presentation.controller;

import com.blueceylon.catalog_service.application.service.BusinessProfileService;
import com.blueceylon.catalog_service.application.service.SearchService;
import com.blueceylon.catalog_service.domain.model.enums.BusinessType;
import com.blueceylon.catalog_service.domain.model.enums.SriLankanCity;
import com.blueceylon.catalog_service.domain.model.enums.TourCategory;
import com.blueceylon.catalog_service.presentation.dto.response.BusinessProfileResponse;
import com.blueceylon.catalog_service.presentation.dto.response.BusinessSummaryResponse;
import com.blueceylon.catalog_service.presentation.dto.response.RoomResponse;
import com.blueceylon.catalog_service.presentation.dto.response.TourPackageResponse;
import com.blueceylon.catalog_service.presentation.mapper.BusinessMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/catalog/public/search")
public class PublicSearchController {

    private final SearchService searchService;
    private final BusinessProfileService businessProfileService;
    private final BusinessMapper mapper;

    public PublicSearchController(SearchService searchService, BusinessProfileService businessProfileService, BusinessMapper mapper) {
        this.searchService = searchService;
        this.businessProfileService = businessProfileService;
        this.mapper = mapper;
    }

    @GetMapping("/businesses")
    public ResponseEntity<Page<BusinessSummaryResponse>> searchBusinesses(
            @RequestParam(name = "type", required = false) BusinessType type,
            @RequestParam(name = "city", required = false) SriLankanCity city,
            Pageable pageable) {
        return ResponseEntity.ok(searchService.searchBusinesses(type, city, pageable));
    }

    @GetMapping("/business/{id}")
    public ResponseEntity<BusinessProfileResponse> getBusinessDetails(@PathVariable("id") String id) {
        return businessProfileService.getProfileById(id)
                .map(mapper::toResponse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/rooms")
    public ResponseEntity<Page<RoomResponse>> searchRooms(
            @RequestParam(name = "city", required = false) SriLankanCity city,
            @RequestParam(name = "minPrice", required = false) Double minPrice,
            @RequestParam(name = "maxPrice", required = false) Double maxPrice,
            Pageable pageable) {
        return ResponseEntity.ok(searchService.searchRooms(city, minPrice, maxPrice, pageable));
    }

    @GetMapping("/tours")
    public ResponseEntity<Page<TourPackageResponse>> searchTours(
            @RequestParam(name = "city", required = false) SriLankanCity city,
            @RequestParam(name = "category", required = false) TourCategory category,
            @RequestParam(name = "providerType", required = false) com.blueceylon.catalog_service.domain.model.enums.OwnerType providerType,
            @RequestParam(name = "minPrice", required = false) Double minPrice,
            @RequestParam(name = "maxPrice", required = false) Double maxPrice,
            Pageable pageable) {
        return ResponseEntity.ok(searchService.searchTours(city, category, providerType, minPrice, maxPrice, pageable));
    }
}
