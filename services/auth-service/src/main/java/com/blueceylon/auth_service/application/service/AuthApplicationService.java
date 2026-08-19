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
        // 1. Create or get from Keycloak
        String keycloakSub = adminClient.createUser(
                request.getEmail(),
                request.getPassword(),
                request.getFirstName(),
                request.getLastName(),
                request.getRole()
        );

        String verificationToken = java.util.UUID.randomUUID().toString();

        // 2. Create or update in DB
        UserProfile profile = userProfileRepository.findByEmail(request.getEmail())
                .orElseGet(UserProfile::new);
        profile.setKeycloakSub(keycloakSub);
        profile.setEmail(request.getEmail());
        profile.setFirstName(request.getFirstName());
        profile.setLastName(request.getLastName());
        profile.setPhoneNumber(request.getPhoneNumber());
        profile.setRole(request.getRole());
        profile.setVerificationToken(verificationToken);
        profile.setVerificationTokenExpiresAt(LocalDateTime.now().plusHours(24));
        userProfileRepository.save(profile);

        notificationPublisherService.publishWelcomeEvent(request.getEmail(), request.getFirstName());
        notificationPublisherService.publishVerificationEvent(request.getEmail(), request.getFirstName(), verificationToken);
    }

    @Transactional
    public void verifyEmail(String token) {
        UserProfile profile = userProfileRepository.findByVerificationToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid verification token"));

        if (profile.getVerificationTokenExpiresAt() != null && profile.getVerificationTokenExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Verification token has expired");
        }

        profile.setEmailVerified(true);
        profile.setVerificationToken(null);
        profile.setVerificationTokenExpiresAt(null);
        userProfileRepository.save(profile);

        if (profile.getKeycloakSub() != null) {
            adminClient.setEmailVerified(profile.getKeycloakSub(), true);
        }
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

    public AuthResponse refreshToken(String refreshToken) {
        Map<String, Object> tokenResponse = tokenClient.refreshToken(refreshToken);
        if (tokenResponse == null || !tokenResponse.containsKey("access_token")) {
            throw new IllegalArgumentException("Invalid or expired refresh token");
        }
        return new AuthResponse(
                (String) tokenResponse.get("access_token"),
                (String) tokenResponse.get("refresh_token"),
                (Integer) tokenResponse.get("expires_in"),
                null
        );
    }

    @Transactional
    public AuthResponse socialLogin(SocialLoginRequest request) {
        Map<String, Object> tokenResponse = tokenClient.exchangeSocialToken(request.getProvider(), request.getIdToken());
        return new AuthResponse(
                (String) tokenResponse.get("access_token"),
                (String) tokenResponse.get("refresh_token"),
                (Integer) tokenResponse.get("expires_in"),
                null
        );
    }

    public void forgotPassword(ForgotPasswordRequest request) {
        adminClient.triggerForgotPassword(request.getEmail());
    }

    @Transactional(readOnly = true)
    public UserProfileDto getProfileByKeycloakSub(String keycloakSub) {
        UserProfile profile = userProfileRepository.findByKeycloakSub(keycloakSub)
                .orElseThrow(() -> new RuntimeException("Profile not found"));
        return new UserProfileDto(profile);
    }

    @Transactional
    public UserProfileDto updateProfile(String keycloakSub, UpdateProfileRequest request) {
        UserProfile profile = userProfileRepository.findByKeycloakSub(keycloakSub)
                .orElseThrow(() -> new RuntimeException("Profile not found"));
        profile.setFirstName(request.getFirstName());
        profile.setLastName(request.getLastName());
        if (request.getPhoneNumber() != null) profile.setPhoneNumber(request.getPhoneNumber());
        if (request.getProfileImageUrl() != null) profile.setProfileImageUrl(request.getProfileImageUrl());
        userProfileRepository.save(profile);
        return new UserProfileDto(profile);
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
