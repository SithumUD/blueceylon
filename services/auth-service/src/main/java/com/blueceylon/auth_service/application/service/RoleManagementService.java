package com.blueceylon.auth_service.application.service;

import com.blueceylon.auth_service.domain.model.UserProfile;
import com.blueceylon.auth_service.domain.model.enums.UserRole;
import com.blueceylon.auth_service.domain.repository.UserProfileRepository;
import com.blueceylon.auth_service.infrastructure.keycloak.KeycloakAdminClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RoleManagementService {

    private final KeycloakAdminClient adminClient;
    private final UserProfileRepository userProfileRepository;

    public RoleManagementService(KeycloakAdminClient adminClient, UserProfileRepository userProfileRepository) {
        this.adminClient = adminClient;
        this.userProfileRepository = userProfileRepository;
    }

    @Transactional
    public void escalateToBusinessOwner(String keycloakSub, String businessType) {
        UserProfile profile = userProfileRepository.findByKeycloakSub(keycloakSub)
                .orElse(null);

        if (profile == null) {
            System.err.println("Warning: Could not find UserProfile for keycloakSub: " + keycloakSub);
            return;
        }

        UserRole targetRole = "TOUR_GUIDE".equalsIgnoreCase(businessType) ? UserRole.TOUR_GUIDE : UserRole.BUSINESS_OWNER;
        profile.setRole(targetRole);
        profile.setBusinessType(businessType);
        userProfileRepository.save(profile);

        adminClient.updateUserRole(keycloakSub, targetRole);
    }
}
