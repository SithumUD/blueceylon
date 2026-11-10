package com.blueceylon.booking_service.presentation.controller;

import com.blueceylon.booking_service.application.service.AvailabilityService;
import com.blueceylon.booking_service.presentation.dto.response.AvailabilityCheckResponse;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/v1/bookings/public")
public class PublicAvailabilityController {

    private final AvailabilityService availabilityService;

    public PublicAvailabilityController(AvailabilityService availabilityService) {
        this.availabilityService = availabilityService;
    }

    @GetMapping("/availability/rooms/{roomId}")
    public ResponseEntity<AvailabilityCheckResponse> checkRoomAvailability(
            @PathVariable("roomId") String roomId,
            @RequestParam("checkIn") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkIn,
            @RequestParam("checkOut") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOut,
            @RequestParam(value = "quantity", defaultValue = "1") Integer quantity,
            @RequestParam(value = "guestCount", required = false) Integer guestCount) {
        return ResponseEntity.ok(availabilityService.checkRoomAvailability(roomId, checkIn, checkOut, quantity, guestCount));
    }
}
