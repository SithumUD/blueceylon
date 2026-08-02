package com.blueceylon.auth_service.presentation.rest;

import com.blueceylon.auth_service.application.service.AuthApplicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/account")
public class AccountController {

    private final AuthApplicationService authService;

    public AccountController(AuthApplicationService authService) {
        this.authService = authService;
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteAccount(@RequestHeader("X-User-Sub") String keycloakSub) {
        authService.safeDeleteAccount(keycloakSub);
        return ResponseEntity.ok().build();
    }
}
