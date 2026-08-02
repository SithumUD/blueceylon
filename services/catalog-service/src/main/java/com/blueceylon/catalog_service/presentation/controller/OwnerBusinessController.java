package com.blueceylon.catalog_service.presentation.controller;

import com.blueceylon.catalog_service.application.service.BusinessProfileService;
import com.blueceylon.catalog_service.domain.model.Business;
import com.blueceylon.catalog_service.presentation.dto.request.HotelDraftRequest;
import com.blueceylon.catalog_service.presentation.dto.request.TourAgencyDraftRequest;
import com.blueceylon.catalog_service.presentation.dto.request.TourGuideDraftRequest;
import com.blueceylon.catalog_service.presentation.dto.response.BusinessProfileResponse;
import com.blueceylon.catalog_service.presentation.mapper.BusinessMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/catalog/business/me")
public class OwnerBusinessController {

    private final BusinessProfileService service;
    private final BusinessMapper mapper;

    public OwnerBusinessController(BusinessProfileService service, BusinessMapper mapper) {
        this.service = service;
        this.mapper = mapper;
    }

    @GetMapping
    public ResponseEntity<BusinessProfileResponse> getMyProfile(@AuthenticationPrincipal Jwt jwt) {
        Object business = service.getMyProfile(jwt.getSubject());
        if (business == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(mapper.toResponse(business));
    }

    @PostMapping("/hotel/draft")
    public ResponseEntity<BusinessProfileResponse> saveHotelDraft(@AuthenticationPrincipal Jwt jwt, @RequestBody HotelDraftRequest request) {
        Object business = service.saveHotelDraft(jwt.getSubject(), request);
        return ResponseEntity.ok(mapper.toResponse(business));
    }

    @PostMapping("/agency/draft")
    public ResponseEntity<BusinessProfileResponse> saveTourAgencyDraft(@AuthenticationPrincipal Jwt jwt, @RequestBody TourAgencyDraftRequest request) {
        Object business = service.saveTourAgencyDraft(jwt.getSubject(), request);
        return ResponseEntity.ok(mapper.toResponse(business));
    }

    @PostMapping("/guide/draft")
    public ResponseEntity<BusinessProfileResponse> saveTourGuideDraft(@AuthenticationPrincipal Jwt jwt, @RequestBody TourGuideDraftRequest request) {
        Object business = service.saveTourGuideDraft(jwt.getSubject(), request);
        return ResponseEntity.ok(mapper.toResponse(business));
    }

    @PostMapping("/submit")
    public ResponseEntity<BusinessProfileResponse> submitForApproval(@AuthenticationPrincipal Jwt jwt) {
        Object business = service.submitForApproval(jwt.getSubject());
        return ResponseEntity.ok(mapper.toResponse(business));
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteMyBusiness(@AuthenticationPrincipal Jwt jwt) {
        service.deleteMyBusiness(jwt.getSubject());
        return ResponseEntity.noContent().build();
    }
}
