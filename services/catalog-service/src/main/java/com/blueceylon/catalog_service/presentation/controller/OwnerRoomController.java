package com.blueceylon.catalog_service.presentation.controller;

import com.blueceylon.catalog_service.application.service.RoomService;
import com.blueceylon.catalog_service.presentation.dto.request.RoomRequest;
import com.blueceylon.catalog_service.presentation.dto.response.RoomResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/catalog/business/me/rooms")
public class OwnerRoomController {

    @Autowired
    private RoomService roomService;

    @PostMapping
    public ResponseEntity<RoomResponse> createRoom(@AuthenticationPrincipal Jwt jwt, @RequestBody RoomRequest request) {
        return ResponseEntity.ok(roomService.createRoom(jwt.getSubject(), request));
    }

    @GetMapping
    public ResponseEntity<List<RoomResponse>> getMyRooms(@AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(roomService.getMyRooms(jwt.getSubject()));
    }

    @PutMapping("/{roomId}")
    public ResponseEntity<RoomResponse> updateRoom(@AuthenticationPrincipal Jwt jwt, @PathVariable String roomId, @RequestBody RoomRequest request) {
        return ResponseEntity.ok(roomService.updateRoom(jwt.getSubject(), roomId, request));
    }

    @DeleteMapping("/{roomId}")
    public ResponseEntity<Void> deleteRoom(@AuthenticationPrincipal Jwt jwt, @PathVariable String roomId) {
        roomService.deleteRoom(jwt.getSubject(), roomId);
        return ResponseEntity.noContent().build();
    }
}
