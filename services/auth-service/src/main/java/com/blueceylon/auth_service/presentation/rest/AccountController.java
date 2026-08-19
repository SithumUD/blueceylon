package com.blueceylon.auth_service.presentation.rest;

import com.blueceylon.auth_service.application.dto.UpdateProfileRequest;
import com.blueceylon.auth_service.application.dto.UserProfileDto;
import com.blueceylon.auth_service.application.service.AuthApplicationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/account")
public class AccountController {

    private final AuthApplicationService authService;

    public AccountController(AuthApplicationService authService) {
        this.authService = authService;
    }

    @GetMapping("/me")
    public ResponseEntity<UserProfileDto> getMyProfile(@RequestHeader("X-User-Sub") String keycloakSub) {
        return ResponseEntity.ok(authService.getProfileByKeycloakSub(keycloakSub));
    }

    @PutMapping("/me")
    public ResponseEntity<UserProfileDto> updateMyProfile(
            @RequestHeader("X-User-Sub") String keycloakSub,
            @Valid @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(authService.updateProfile(keycloakSub, request));
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteAccount(@RequestHeader("X-User-Sub") String keycloakSub) {
        authService.safeDeleteAccount(keycloakSub);
        return ResponseEntity.ok().build();
    }
}
