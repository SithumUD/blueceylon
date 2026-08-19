package com.blueceylon.catalog_service.presentation.controller;

import com.blueceylon.catalog_service.domain.model.FaqEntry;
import com.blueceylon.catalog_service.domain.repository.FaqEntryRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class FaqController {

    private final FaqEntryRepository faqEntryRepository;

    public FaqController(FaqEntryRepository faqEntryRepository) {
        this.faqEntryRepository = faqEntryRepository;
    }

    @GetMapping("/api/v1/catalog/public/businesses/{businessId}/faqs")
    public ResponseEntity<List<FaqEntry>> getBusinessFaqs(@PathVariable String businessId) {
        return ResponseEntity.ok(faqEntryRepository.findByBusinessId(businessId));
    }

    @PostMapping("/api/v1/catalog/business/me/faqs")
    public ResponseEntity<FaqEntry> addFaq(@AuthenticationPrincipal Jwt jwt, @RequestBody FaqEntry faqEntry) {
        faqEntry.setBusinessId(jwt.getSubject());
        return ResponseEntity.ok(faqEntryRepository.save(faqEntry));
    }

    @DeleteMapping("/api/v1/catalog/business/me/faqs/{faqId}")
    public ResponseEntity<Void> deleteFaq(@PathVariable String faqId) {
        faqEntryRepository.deleteById(faqId);
        return ResponseEntity.noContent().build();
    }
}
