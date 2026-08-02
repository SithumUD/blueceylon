package com.blueceylon.catalog_service.presentation.controller;

import com.blueceylon.catalog_service.application.service.RoomService;
import com.blueceylon.catalog_service.application.service.ExperiencePackageService;
import com.blueceylon.catalog_service.domain.model.Room;
import com.blueceylon.catalog_service.domain.model.DayOutPackage;
import com.blueceylon.catalog_service.domain.model.NightOutPackage;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/catalog/public/items")
public class PublicItemController {

    private final RoomService roomService;
    private final ExperiencePackageService experiencePackageService;

    public PublicItemController(RoomService roomService, ExperiencePackageService experiencePackageService) {
        this.roomService = roomService;
        this.experiencePackageService = experiencePackageService;
    }

    @GetMapping("/rooms/{id}")
    public ResponseEntity<Room> getRoom(@PathVariable String id) {
        // Assume roomService has a method to get by ID directly or we can add it
        return ResponseEntity.ok(roomService.getRoomById(id));
    }

    @GetMapping("/day-out/{id}")
    public ResponseEntity<DayOutPackage> getDayOutPackage(@PathVariable String id) {
        return ResponseEntity.ok(experiencePackageService.getDayOutPackageById(id));
    }

    @GetMapping("/night-out/{id}")
    public ResponseEntity<NightOutPackage> getNightOutPackage(@PathVariable String id) {
        return ResponseEntity.ok(experiencePackageService.getNightOutPackageById(id));
    }
}
