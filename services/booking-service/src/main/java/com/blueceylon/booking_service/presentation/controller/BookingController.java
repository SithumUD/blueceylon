package com.blueceylon.booking_service.presentation.controller;

import com.blueceylon.booking_service.application.service.BookingApplicationService;
import com.blueceylon.booking_service.domain.model.enums.BookingStatus;
import com.blueceylon.booking_service.presentation.dto.request.BookingRequest;
import com.blueceylon.booking_service.presentation.dto.response.BookingResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import com.blueceylon.booking_service.application.service.IdempotencyService;
import com.blueceylon.booking_service.domain.model.IdempotencyRecord;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Optional;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/v1/bookings")
public class BookingController {

    private final BookingApplicationService service;
    private final IdempotencyService idempotencyService;
    private final ObjectMapper objectMapper;

    public BookingController(BookingApplicationService service, IdempotencyService idempotencyService, ObjectMapper objectMapper) {
        this.service = service;
        this.idempotencyService = idempotencyService;
        this.objectMapper = objectMapper;
    }

    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(
            @AuthenticationPrincipal Jwt jwt, 
            @RequestHeader(value = "Idempotency-Key", required = false) String idempotencyKey,
            @RequestBody BookingRequest request) {

        if (idempotencyKey != null) {
            Optional<IdempotencyRecord> existing = idempotencyService.find(idempotencyKey);
            if (existing.isPresent()) {
                if (!idempotencyService.matchesHash(existing.get(), request)) {
                    return ResponseEntity.status(409).build();
                }
                try {
                    BookingResponse cachedResponse = objectMapper.readValue(existing.get().getResponseBody(), BookingResponse.class);
                    return ResponseEntity.ok(cachedResponse);
                } catch (Exception e) {
                    return ResponseEntity.status(500).build();
                }
            }
        }
        String userId = jwt.getSubject();
        BookingResponse response = service.createBooking(userId, request);
        if (idempotencyKey != null) {
            idempotencyService.record(idempotencyKey, request, response);
        }
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<List<BookingResponse>> getMyBookings(@AuthenticationPrincipal Jwt jwt) {
        String userId = jwt.getSubject();
        return ResponseEntity.ok(service.getMyBookings(userId));
    }

    @GetMapping("/business/{businessId}")
    public ResponseEntity<List<BookingResponse>> getBusinessBookings(
            @PathVariable String businessId, 
            @AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(service.getBusinessBookings(businessId));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<BookingResponse> cancelBooking(
            @PathVariable String id,
            @AuthenticationPrincipal Jwt jwt) {
        String userId = jwt.getSubject();
        return ResponseEntity.ok(service.cancelBooking(userId, id));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<BookingResponse> updateBookingStatus(
            @PathVariable String id,
            @AuthenticationPrincipal Jwt jwt,
            @RequestBody Map<String, String> body) {
        String statusStr = body.get("status");
        BookingStatus status = BookingStatus.valueOf(statusStr.toUpperCase());
        String businessId = jwt.getSubject();
        return ResponseEntity.ok(service.updateBookingStatus(businessId, id, status));
    }
}
