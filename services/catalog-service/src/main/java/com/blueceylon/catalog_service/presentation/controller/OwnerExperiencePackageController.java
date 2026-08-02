package com.blueceylon.catalog_service.presentation.controller;

import com.blueceylon.catalog_service.application.service.ExperiencePackageService;
import com.blueceylon.catalog_service.presentation.dto.request.*;
import com.blueceylon.catalog_service.presentation.dto.response.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/catalog/business/me")
public class OwnerExperiencePackageController {

    @Autowired
    private ExperiencePackageService experienceService;

    @PostMapping("/day-out-packages")
    public ResponseEntity<DayOutPackageResponse> createDayOutPackage(@AuthenticationPrincipal Jwt jwt, @RequestBody DayOutPackageRequest request) {
        return ResponseEntity.ok(experienceService.createDayOutPackage(jwt.getSubject(), request));
    }

    @GetMapping("/day-out-packages")
    public ResponseEntity<List<DayOutPackageResponse>> getMyDayOutPackages(@AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(experienceService.getMyDayOutPackages(jwt.getSubject()));
    }

    @PostMapping("/night-out-packages")
    public ResponseEntity<NightOutPackageResponse> createNightOutPackage(@AuthenticationPrincipal Jwt jwt, @RequestBody NightOutPackageRequest request) {
        return ResponseEntity.ok(experienceService.createNightOutPackage(jwt.getSubject(), request));
    }

    @GetMapping("/night-out-packages")
    public ResponseEntity<List<NightOutPackageResponse>> getMyNightOutPackages(@AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(experienceService.getMyNightOutPackages(jwt.getSubject()));
    }

    @PostMapping("/rooms/{roomId}/hourly-bookings")
    public ResponseEntity<HourlyRoomBookingResponse> createHourlyBooking(@AuthenticationPrincipal Jwt jwt, @PathVariable String roomId, @RequestBody HourlyRoomBookingRequest request) {
        return ResponseEntity.ok(experienceService.createHourlyBooking(jwt.getSubject(), roomId, request));
    }

    @GetMapping("/hourly-bookings")
    public ResponseEntity<List<HourlyRoomBookingResponse>> getMyHourlyBookings(@AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(experienceService.getMyHourlyBookings(jwt.getSubject()));
    }

    @PutMapping("/day-out-packages/{packageId}")
    public ResponseEntity<DayOutPackageResponse> updateDayOutPackage(@AuthenticationPrincipal Jwt jwt, @PathVariable String packageId, @RequestBody DayOutPackageRequest request) {
        return ResponseEntity.ok(experienceService.updateDayOutPackage(jwt.getSubject(), packageId, request));
    }

    @DeleteMapping("/day-out-packages/{packageId}")
    public ResponseEntity<Void> deleteDayOutPackage(@AuthenticationPrincipal Jwt jwt, @PathVariable String packageId) {
        experienceService.deleteDayOutPackage(jwt.getSubject(), packageId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/night-out-packages/{packageId}")
    public ResponseEntity<NightOutPackageResponse> updateNightOutPackage(@AuthenticationPrincipal Jwt jwt, @PathVariable String packageId, @RequestBody NightOutPackageRequest request) {
        return ResponseEntity.ok(experienceService.updateNightOutPackage(jwt.getSubject(), packageId, request));
    }

    @DeleteMapping("/night-out-packages/{packageId}")
    public ResponseEntity<Void> deleteNightOutPackage(@AuthenticationPrincipal Jwt jwt, @PathVariable String packageId) {
        experienceService.deleteNightOutPackage(jwt.getSubject(), packageId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/hourly-bookings/{bookingId}")
    public ResponseEntity<HourlyRoomBookingResponse> updateHourlyBooking(@AuthenticationPrincipal Jwt jwt, @PathVariable String bookingId, @RequestBody HourlyRoomBookingRequest request) {
        return ResponseEntity.ok(experienceService.updateHourlyBooking(jwt.getSubject(), bookingId, request));
    }

    @DeleteMapping("/hourly-bookings/{bookingId}")
    public ResponseEntity<Void> deleteHourlyBooking(@AuthenticationPrincipal Jwt jwt, @PathVariable String bookingId) {
        experienceService.deleteHourlyBooking(jwt.getSubject(), bookingId);
        return ResponseEntity.noContent().build();
    }
}
