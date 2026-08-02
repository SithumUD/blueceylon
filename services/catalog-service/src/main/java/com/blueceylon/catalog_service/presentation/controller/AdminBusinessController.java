package com.blueceylon.catalog_service.presentation.controller;

import com.blueceylon.catalog_service.application.service.BusinessProfileService;
import com.blueceylon.catalog_service.application.service.NotificationPublisherService;
import com.blueceylon.catalog_service.domain.model.Business;
import com.blueceylon.catalog_service.presentation.dto.request.AdminRejectRequest;
import com.blueceylon.catalog_service.presentation.dto.response.BusinessProfileResponse;
import com.blueceylon.catalog_service.presentation.mapper.BusinessMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/catalog/admin/business")
public class AdminBusinessController {

    private final BusinessProfileService service;
    private final BusinessMapper mapper;
    private final NotificationPublisherService notificationPublisherService;

    public AdminBusinessController(BusinessProfileService service, BusinessMapper mapper, NotificationPublisherService notificationPublisherService) {
        this.notificationPublisherService = notificationPublisherService;
        this.service = service;
        this.mapper = mapper;
    }

    @GetMapping("/pending")
    public ResponseEntity<List<BusinessProfileResponse>> getPendingApprovals() {
        List<BusinessProfileResponse> responses = service.getPendingApprovals().stream()
                .map(mapper::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<BusinessProfileResponse> approveBusiness(@PathVariable("id") String id) {
        Business business = (Business) service.approveProfile(id);
        notificationPublisherService.publishApprovalEvent(business.getContactEmail(), business.getName());
        return ResponseEntity.ok(mapper.toResponse(business));
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<BusinessProfileResponse> rejectBusiness(@PathVariable("id") String id, @RequestBody AdminRejectRequest request) {
        Business business = (Business) service.rejectProfile(id, request.getReason());
        notificationPublisherService.publishRejectionEvent(business.getContactEmail(), business.getName(), request.getReason());
        return ResponseEntity.ok(mapper.toResponse(business));
    }
}

