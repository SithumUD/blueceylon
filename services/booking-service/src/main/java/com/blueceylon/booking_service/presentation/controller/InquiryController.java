package com.blueceylon.booking_service.presentation.controller;

import com.blueceylon.booking_service.application.service.InquiryService;
import com.blueceylon.booking_service.domain.model.Inquiry;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/inquiries")
public class InquiryController {

    private final InquiryService inquiryService;

    public InquiryController(InquiryService inquiryService) {
        this.inquiryService = inquiryService;
    }

    @PostMapping
    public ResponseEntity<Inquiry> createInquiry(@AuthenticationPrincipal Jwt jwt, @RequestBody Inquiry inquiry) {
        String customerId = jwt.getSubject();
        return ResponseEntity.ok(inquiryService.createInquiry(customerId, inquiry));
    }

    @GetMapping("/me")
    public ResponseEntity<List<Inquiry>> getMyInquiries(@AuthenticationPrincipal Jwt jwt) {
        String customerId = jwt.getSubject();
        return ResponseEntity.ok(inquiryService.getMyInquiries(customerId));
    }

    @GetMapping("/business/{businessId}")
    public ResponseEntity<List<Inquiry>> getBusinessInquiries(@PathVariable String businessId) {
        return ResponseEntity.ok(inquiryService.getBusinessInquiries(businessId));
    }
}
