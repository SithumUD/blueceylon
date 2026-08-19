package com.blueceylon.catalog_service.presentation.controller;

import com.blueceylon.catalog_service.application.service.RoomService;
import com.blueceylon.catalog_service.application.service.ExperiencePackageService;
import com.blueceylon.catalog_service.application.service.TourPackageService;
import com.blueceylon.catalog_service.domain.model.Room;
import com.blueceylon.catalog_service.domain.model.DayOutPackage;
import com.blueceylon.catalog_service.domain.model.NightOutPackage;
import com.blueceylon.catalog_service.presentation.dto.response.TourPackageResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<Room> getRoom(@PathVariable("id") String id) {
        return ResponseEntity.ok(roomService.getRoomById(id));
    }

    @GetMapping("/day-out/{id}")
    public ResponseEntity<DayOutPackage> getDayOutPackage(@PathVariable("id") String id) {
        return ResponseEntity.ok(experiencePackageService.getDayOutPackageById(id));
    }

    @GetMapping("/night-out/{id}")
    public ResponseEntity<NightOutPackage> getNightOutPackage(@PathVariable("id") String id) {
        return ResponseEntity.ok(experiencePackageService.getNightOutPackageById(id));
    }

    @GetMapping("/tours/{id}")
    public ResponseEntity<TourPackageResponse> getTourPackage(@PathVariable("id") String id) {
        return ResponseEntity.ok(tourPackageService.getTourPackageById(id));
    }
}
