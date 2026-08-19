package com.blueceylon.auth_service.infrastructure.config;

import com.blueceylon.auth_service.domain.model.UserProfile;
import com.blueceylon.auth_service.domain.model.enums.UserRole;
import com.blueceylon.auth_service.domain.repository.UserProfileRepository;
import com.blueceylon.auth_service.infrastructure.keycloak.KeycloakAdminClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class AdminInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(AdminInitializer.class);

    private final UserProfileRepository userProfileRepository;
    private final KeycloakAdminClient keycloakAdminClient;

    @Value("${admin.seed.email:admin@blueceylon.com}")
    private String adminEmail;

    @Value("${admin.seed.password:AdminPassword123!}")
    private String adminPassword;

    @Value("${admin.seed.first-name:System}")
    private String adminFirstName;

    @Value("${admin.seed.last-name:Admin}")
    private String adminLastName;

    public AdminInitializer(UserProfileRepository userProfileRepository, KeycloakAdminClient keycloakAdminClient) {
        this.userProfileRepository = userProfileRepository;
        this.keycloakAdminClient = keycloakAdminClient;
    }

    @Override
    public void run(String... args) {
        try {
            if (userProfileRepository.findByEmail(adminEmail).isPresent()) {
                log.info("System Admin user already exists in database: {}", adminEmail);
                return;
            }

            log.info("Seeding initial System Admin user ({}) into Keycloak & DB...", adminEmail);

            // 1. Create or lookup user in Keycloak and assign ADMIN role
            String keycloakSub = keycloakAdminClient.createUser(
                    adminEmail,
                    adminPassword,
                    adminFirstName,
                    adminLastName,
                    UserRole.ADMIN
            );

            // 2. Mark email verified in Keycloak
            keycloakAdminClient.setEmailVerified(keycloakSub, true);

            // 3. Create and save UserProfile entity in auth_db
            UserProfile adminProfile = userProfileRepository.findByKeycloakSub(keycloakSub)
                    .orElse(new UserProfile());

            adminProfile.setKeycloakSub(keycloakSub);
            adminProfile.setEmail(adminEmail);
            adminProfile.setFirstName(adminFirstName);
            adminProfile.setLastName(adminLastName);
            adminProfile.setRole(UserRole.ADMIN);
            adminProfile.setEmailVerified(true);
            adminProfile.setVerificationToken(null);
            adminProfile.setVerificationTokenExpiresAt(null);

            userProfileRepository.save(adminProfile);

            log.info("✅ Initial System Admin seeded successfully! Email: {}, Password: {}", adminEmail, adminPassword);
        } catch (Exception e) {
            log.error("Failed to seed initial System Admin user: {}", e.getMessage(), e);
        }
    }
}
