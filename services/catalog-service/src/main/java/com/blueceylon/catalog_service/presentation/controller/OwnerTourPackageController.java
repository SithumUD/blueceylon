package com.blueceylon.catalog_service.presentation.controller;

import com.blueceylon.catalog_service.application.service.TourPackageService;
import com.blueceylon.catalog_service.presentation.dto.request.TourPackageRequest;
import com.blueceylon.catalog_service.presentation.dto.response.TourPackageResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/catalog/business/me/tour-packages")
public class OwnerTourPackageController {

    @Autowired
    private TourPackageService tourPackageService;

    @PostMapping
    public ResponseEntity<TourPackageResponse> createTourPackage(@AuthenticationPrincipal Jwt jwt, @RequestBody TourPackageRequest request) {
        return ResponseEntity.ok(tourPackageService.createTourPackage(jwt.getSubject(), request));
    }

    @GetMapping
    public ResponseEntity<List<TourPackageResponse>> getMyTourPackages(@AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(tourPackageService.getMyTourPackages(jwt.getSubject()));
    }

    @PutMapping("/{packageId}")
    public ResponseEntity<TourPackageResponse> updateTourPackage(@AuthenticationPrincipal Jwt jwt, @PathVariable String packageId, @RequestBody TourPackageRequest request) {
        return ResponseEntity.ok(tourPackageService.updateTourPackage(jwt.getSubject(), packageId, request));
    }

    @DeleteMapping("/{packageId}")
    public ResponseEntity<Void> deleteTourPackage(@AuthenticationPrincipal Jwt jwt, @PathVariable String packageId) {
        tourPackageService.deleteTourPackage(jwt.getSubject(), packageId);
        return ResponseEntity.noContent().build();
    }
}
