package com.blueceylon.auth_service.presentation.rest;

import com.blueceylon.auth_service.application.dto.*;
import com.blueceylon.auth_service.application.service.AuthApplicationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping({"/api/auth", "/api/v1/auth"})
public class AuthController {

    private final AuthApplicationService authService;

    public AuthController(AuthApplicationService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<java.util.Map<String, String>> register(@Valid @RequestBody RegisterRequest request) {
        authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(java.util.Collections.singletonMap("message", "Registration successful"));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshToken(@RequestBody java.util.Map<String, String> request) {
        String refreshToken = request.get("refreshToken");
        if (refreshToken == null || refreshToken.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(authService.refreshToken(refreshToken));
    }

    @PostMapping("/social/google")
    public ResponseEntity<AuthResponse> googleLogin(@Valid @RequestBody SocialLoginRequest request) {
        request.setProvider("google");
        return ResponseEntity.ok(authService.socialLogin(request));
    }

    @PostMapping("/social/apple")
    public ResponseEntity<AuthResponse> appleLogin(@Valid @RequestBody SocialLoginRequest request) {
        request.setProvider("apple");
        return ResponseEntity.ok(authService.socialLogin(request));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Void> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        authService.forgotPassword(request);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/verify-email")
    public ResponseEntity<java.util.Map<String, String>> verifyEmail(@RequestParam("token") String token) {
        authService.verifyEmail(token);
        return ResponseEntity.ok(java.util.Collections.singletonMap("message", "Email verified successfully"));
    }
}
