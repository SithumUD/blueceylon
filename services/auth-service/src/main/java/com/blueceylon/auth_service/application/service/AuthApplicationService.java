package com.blueceylon.auth_service.application.service;

import com.blueceylon.auth_service.application.dto.*;
import com.blueceylon.auth_service.domain.model.UserProfile;
import com.blueceylon.auth_service.domain.repository.UserProfileRepository;
import com.blueceylon.auth_service.infrastructure.keycloak.KeycloakAdminClient;
import com.blueceylon.auth_service.infrastructure.keycloak.KeycloakTokenExchangeClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;

@Service
public class AuthApplicationService {

    private final KeycloakAdminClient adminClient;
    private final KeycloakTokenExchangeClient tokenClient;
    private final UserProfileRepository userProfileRepository;
    private final NotificationPublisherService notificationPublisherService;

    public AuthApplicationService(KeycloakAdminClient adminClient, KeycloakTokenExchangeClient tokenClient, UserProfileRepository userProfileRepository, NotificationPublisherService notificationPublisherService) {
        this.notificationPublisherService = notificationPublisherService;
        this.adminClient = adminClient;
        this.tokenClient = tokenClient;
        this.userProfileRepository = userProfileRepository;
    }

    @Transactional
    public void register(RegisterRequest request) {
        // 1. Create in Keycloak
        String keycloakSub = adminClient.createUser(
                request.getEmail(),
                request.getPassword(),
                request.getFirstName(),
                request.getLastName(),
                request.getRole()
        );

        // 2. Create in DB
        UserProfile profile = new UserProfile();
        profile.setKeycloakSub(keycloakSub);
        profile.setEmail(request.getEmail());
        profile.setFirstName(request.getFirstName());
        profile.setLastName(request.getLastName());
        profile.setPhoneNumber(request.getPhoneNumber());
        profile.setRole(request.getRole());
        userProfileRepository.save(profile);
        notificationPublisherService.publishWelcomeEvent(request.getEmail(), request.getFirstName());
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        Map<String, Object> tokenResponse = tokenClient.login(request.getEmail(), request.getPassword());
        
        UserProfile profile = userProfileRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Profile not found"));
        
        profile.setLastLoginAt(LocalDateTime.now());
        userProfileRepository.save(profile);

        return new AuthResponse(
                (String) tokenResponse.get("access_token"),
                (String) tokenResponse.get("refresh_token"),
                (Integer) tokenResponse.get("expires_in"),
                new UserProfileDto(profile)
        );
    }

    @Transactional
    public AuthResponse socialLogin(SocialLoginRequest request) {
        Map<String, Object> tokenResponse = tokenClient.exchangeSocialToken(request.getProvider(), request.getIdToken());
        // For simplicity, assuming profile sync happens elsewhere or is handled via Keycloak identity brokering sync
        return new AuthResponse(
                (String) tokenResponse.get("access_token"),
                (String) tokenResponse.get("refresh_token"),
                (Integer) tokenResponse.get("expires_in"),
                null // You would fetch the profile using the sub from the token
        );
    }

    public void forgotPassword(ForgotPasswordRequest request) {
        adminClient.triggerForgotPassword(request.getEmail());
    }

    @Transactional
    public void safeDeleteAccount(String keycloakSub) {
        UserProfile profile = userProfileRepository.findByKeycloakSub(keycloakSub)
                .orElseThrow(() -> new RuntimeException("Profile not found"));
        
        // Keycloak disable
        adminClient.safeDeleteUser(keycloakSub);
        
        // Local soft delete
        userProfileRepository.delete(profile);
    }
}


