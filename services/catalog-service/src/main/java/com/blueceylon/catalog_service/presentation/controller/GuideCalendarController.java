package com.blueceylon.catalog_service.presentation.controller;

import com.blueceylon.catalog_service.domain.model.GuideBlackoutDate;
import com.blueceylon.catalog_service.domain.model.TourGuideProfile;
import com.blueceylon.catalog_service.domain.repository.GuideBlackoutDateRepository;
import com.blueceylon.catalog_service.infrastructure.persistence.repository.TourGuideProfileRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class GuideCalendarController {

    private final GuideBlackoutDateRepository repository;
    private final TourGuideProfileRepository guideProfileRepository;

    public GuideCalendarController(GuideBlackoutDateRepository repository, TourGuideProfileRepository guideProfileRepository) {
        this.repository = repository;
        this.guideProfileRepository = guideProfileRepository;
    }

    @GetMapping("/api/v1/catalog/public/guides/{guideId}/blackout-dates")
    public ResponseEntity<List<GuideBlackoutDate>> getBlackoutDates(@PathVariable String guideId) {
        return ResponseEntity.ok(repository.findByGuideId(guideId));
    }

    @PostMapping("/api/v1/catalog/business/me/blackout-dates")
    public ResponseEntity<GuideBlackoutDate> addBlackoutDate(@AuthenticationPrincipal Jwt jwt, @RequestBody GuideBlackoutDate blackoutDate) {
        String ownerId = jwt.getSubject();
        TourGuideProfile guide = guideProfileRepository.findByUserId(ownerId)
                .orElseGet(() -> guideProfileRepository.findById(ownerId)
                .orElseThrow(() -> new RuntimeException("Tour Guide profile not found for owner: " + ownerId)));
        blackoutDate.setGuide(guide);
        return ResponseEntity.ok(repository.save(blackoutDate));
    }

    @DeleteMapping("/api/v1/catalog/business/me/blackout-dates/{id}")
    public ResponseEntity<Void> deleteBlackoutDate(@PathVariable String id) {
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
