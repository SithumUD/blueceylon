package com.blueceylon.catalog_service.presentation.controller;

import com.blueceylon.catalog_service.application.service.BusinessProfileService;
import com.blueceylon.catalog_service.presentation.dto.response.BusinessProfileResponse;
import com.blueceylon.catalog_service.presentation.mapper.BusinessMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/catalog/public/business")
public class PublicBusinessController {

    private final BusinessProfileService service;
    private final BusinessMapper mapper;

    public PublicBusinessController(BusinessProfileService service, BusinessMapper mapper) {
        this.service = service;
        this.mapper = mapper;
    }

    @GetMapping
    public ResponseEntity<List<BusinessProfileResponse>> getApprovedBusinesses() {
        List<BusinessProfileResponse> responses = service.getApprovedProfiles().stream()
                .map(mapper::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }
}
