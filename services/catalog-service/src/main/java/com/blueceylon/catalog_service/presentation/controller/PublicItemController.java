package com.blueceylon.catalog_service.presentation.controller;

import com.blueceylon.catalog_service.application.service.RoomService;
import com.blueceylon.catalog_service.application.service.ExperiencePackageService;
import com.blueceylon.catalog_service.application.service.TourPackageService;
import com.blueceylon.catalog_service.domain.model.DayOutPackage;
import com.blueceylon.catalog_service.domain.model.NightOutPackage;
import com.blueceylon.catalog_service.presentation.dto.response.DayOutPackageResponse;
import com.blueceylon.catalog_service.presentation.dto.response.NightOutPackageResponse;
import com.blueceylon.catalog_service.presentation.dto.response.RoomResponse;
import com.blueceylon.catalog_service.presentation.dto.response.TourPackageResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/catalog/public/items")
public class PublicItemController {

    private final RoomService roomService;
    private final ExperiencePackageService experiencePackageService;
    private final TourPackageService tourPackageService;

    public PublicItemController(RoomService roomService, ExperiencePackageService experiencePackageService, TourPackageService tourPackageService) {
        this.roomService = roomService;
        this.experiencePackageService = experiencePackageService;
        this.tourPackageService = tourPackageService;
    }

    @GetMapping("/rooms/{id}")
    public ResponseEntity<RoomResponse> getRoom(@PathVariable("id") String id) {
        return ResponseEntity.ok(roomService.getRoomResponseById(id));
    }

    @GetMapping("/hotels/{hotelId}/rooms")
    public ResponseEntity<List<RoomResponse>> getHotelRooms(@PathVariable("hotelId") String hotelId) {
        return ResponseEntity.ok(roomService.getRoomsByHotelId(hotelId));
    }

    @GetMapping("/day-out")
    public ResponseEntity<List<DayOutPackageResponse>> getAllDayOutPackages() {
        return ResponseEntity.ok(experiencePackageService.getAllDayOutPackages());
    }

    @GetMapping("/night-out")
    public ResponseEntity<List<NightOutPackageResponse>> getAllNightOutPackages() {
        return ResponseEntity.ok(experiencePackageService.getAllNightOutPackages());
    }

    @GetMapping("/hotels/{hotelId}/day-out")
    public ResponseEntity<List<DayOutPackageResponse>> getHotelDayOutPackages(@PathVariable("hotelId") String hotelId) {
        return ResponseEntity.ok(experiencePackageService.getDayOutPackagesByHotelId(hotelId));
    }

    @GetMapping("/hotels/{hotelId}/night-out")
    public ResponseEntity<List<NightOutPackageResponse>> getHotelNightOutPackages(@PathVariable("hotelId") String hotelId) {
        return ResponseEntity.ok(experiencePackageService.getNightOutPackagesByHotelId(hotelId));
    }

    @GetMapping("/day-out/{id}")
    public ResponseEntity<DayOutPackageResponse> getDayOutPackage(@PathVariable("id") String id) {
        return ResponseEntity.ok(experiencePackageService.getDayOutPackageResponseById(id));
    }

    @GetMapping("/night-out/{id}")
    public ResponseEntity<NightOutPackageResponse> getNightOutPackage(@PathVariable("id") String id) {
        return ResponseEntity.ok(experiencePackageService.getNightOutPackageResponseById(id));
    }

    @GetMapping("/businesses/{businessId}/tours")
    public ResponseEntity<List<TourPackageResponse>> getBusinessTours(@PathVariable("businessId") String businessId) {
        return ResponseEntity.ok(tourPackageService.getTourPackagesByBusinessId(businessId));
    }

    @GetMapping("/tours/{id}")
    public ResponseEntity<TourPackageResponse> getTourPackage(@PathVariable("id") String id) {
        return ResponseEntity.ok(tourPackageService.getTourPackageById(id));
    }
}
