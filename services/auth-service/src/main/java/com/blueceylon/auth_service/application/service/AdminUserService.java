package com.blueceylon.auth_service.application.service;

import com.blueceylon.auth_service.application.dto.ImpersonateResponse;
import com.blueceylon.auth_service.application.dto.UserProfileDto;
import com.blueceylon.auth_service.domain.model.UserProfile;
import com.blueceylon.auth_service.domain.model.enums.UserRole;
import com.blueceylon.auth_service.domain.repository.UserProfileRepository;
import com.blueceylon.auth_service.infrastructure.keycloak.KeycloakAdminClient;
import com.blueceylon.auth_service.infrastructure.keycloak.KeycloakTokenExchangeClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AdminUserService {

    private final UserProfileRepository userProfileRepository;
    private final KeycloakAdminClient adminClient;
    private final KeycloakTokenExchangeClient tokenClient;

    public AdminUserService(UserProfileRepository userProfileRepository,
                            KeycloakAdminClient adminClient,
                            KeycloakTokenExchangeClient tokenClient) {
        this.userProfileRepository = userProfileRepository;
        this.adminClient = adminClient;
        this.tokenClient = tokenClient;
    }

    @Transactional(readOnly = true)
    public List<UserProfileDto> getAllUsers(String search, UserRole role) {
        String query = (search != null && !search.isBlank()) ? search.trim() : null;
        List<UserProfile> profiles = userProfileRepository.searchUsers(query, role);
        return profiles.stream().map(UserProfileDto::new).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public UserProfileDto getUserById(String id) {
        UserProfile profile = userProfileRepository.findById(id)
                .orElseGet(() -> userProfileRepository.findByKeycloakSub(id)
                        .orElseThrow(() -> new RuntimeException("User profile not found with ID/sub: " + id)));
        return new UserProfileDto(profile);
    }

    @Transactional
    public UserProfileDto updateUserRole(String id, UserRole newRole, String businessType) {
        UserProfile profile = userProfileRepository.findById(id)
                .orElseGet(() -> userProfileRepository.findByKeycloakSub(id)
                        .orElseThrow(() -> new RuntimeException("User profile not found with ID/sub: " + id)));

        profile.setRole(newRole);
        if (businessType != null) {
            profile.setBusinessType(businessType);
        }
        userProfileRepository.save(profile);

        // Update in Keycloak
        if (profile.getKeycloakSub() != null) {
            adminClient.updateUserRole(profile.getKeycloakSub(), newRole);
        }

        return new UserProfileDto(profile);
    }

    @Transactional
    public void softDeleteUser(String id) {
        UserProfile profile = userProfileRepository.findById(id)
                .orElseGet(() -> userProfileRepository.findByKeycloakSub(id)
                        .orElseThrow(() -> new RuntimeException("User profile not found with ID/sub: " + id)));

        // 1. Disable in Keycloak (soft delete in Keycloak)
        if (profile.getKeycloakSub() != null) {
            adminClient.safeDeleteUser(profile.getKeycloakSub());
        }

        // 2. Soft delete in DB (Hibernate @SQLDelete sets deleted_at = NOW())
        userProfileRepository.delete(profile);
    }

    @Transactional
    public void hardDeleteUser(String id) {
        UserProfile profile = userProfileRepository.findById(id)
                .orElseGet(() -> userProfileRepository.findByKeycloakSub(id)
                        .orElseThrow(() -> new RuntimeException("User profile not found with ID/sub: " + id)));

        // 1. Permanently remove from Keycloak
        if (profile.getKeycloakSub() != null) {
            adminClient.hardDeleteUser(profile.getKeycloakSub());
        }

        // 2. Permanently remove from DB bypassing soft-delete interceptor
        userProfileRepository.hardDeleteById(profile.getId());
    }

    @Transactional
    public ImpersonateResponse impersonateUser(String id, String adminSub) {
        UserProfile profile = userProfileRepository.findById(id)
                .orElseGet(() -> userProfileRepository.findByKeycloakSub(id)
                        .orElseThrow(() -> new RuntimeException("User profile not found with ID/sub: " + id)));

        // Attempt OAuth2 Token Exchange with Keycloak
        Map<String, Object> tokenResponse = null;
        if (profile.getKeycloakSub() != null) {
            tokenResponse = tokenClient.impersonateUser(profile.getKeycloakSub());
        }

        String accessToken = (tokenResponse != null && tokenResponse.containsKey("access_token"))
                ? (String) tokenResponse.get("access_token")
                : "impersonated_access_token_" + profile.getId() + "_" + System.currentTimeMillis();

        String refreshToken = (tokenResponse != null && tokenResponse.containsKey("refresh_token"))
                ? (String) tokenResponse.get("refresh_token")
                : "impersonated_refresh_token_" + profile.getId();

        Integer expiresIn = (tokenResponse != null && tokenResponse.containsKey("expires_in"))
                ? (Integer) tokenResponse.get("expires_in")
                : 3600;

        return new ImpersonateResponse(
                accessToken,
                refreshToken,
                expiresIn,
                new UserProfileDto(profile),
                adminSub
        );
    }
}
