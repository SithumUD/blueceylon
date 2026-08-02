$base = "c:\Users\sithu\Videos\blue-ceylon\services\auth-service\src\main\java\com\blueceylon\auth_service"

$appServicePath = Join-Path $base "application\service"
$authAppService = @"
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

    public AuthApplicationService(KeycloakAdminClient adminClient, KeycloakTokenExchangeClient tokenClient, UserProfileRepository userProfileRepository) {
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
"@
Set-Content -Path (Join-Path $appServicePath "AuthApplicationService.java") -Value $authAppService -Encoding UTF8

$roleMgmtService = @"
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
    public void escalateToBusinessOwner(String keycloakSub) {
        UserProfile profile = userProfileRepository.findByKeycloakSub(keycloakSub)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        profile.setRole(UserRole.BUSINESS_OWNER);
        userProfileRepository.save(profile);

        adminClient.updateUserRole(keycloakSub, UserRole.BUSINESS_OWNER);
    }
}
"@
Set-Content -Path (Join-Path $appServicePath "RoleManagementService.java") -Value $roleMgmtService -Encoding UTF8

# REST Controllers
$restPath = Join-Path $base "presentation\rest"

$authController = @"
package com.blueceylon.auth_service.presentation.rest;

import com.blueceylon.auth_service.application.dto.*;
import com.blueceylon.auth_service.application.service.AuthApplicationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthApplicationService authService;

    public AuthController(AuthApplicationService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public void register(@Valid @RequestBody RegisterRequest request) {
        authService.register(request);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
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
}
"@
Set-Content -Path (Join-Path $restPath "AuthController.java") -Value $authController -Encoding UTF8

$accountController = @"
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
"@
Set-Content -Path (Join-Path $restPath "AccountController.java") -Value $accountController -Encoding UTF8

# RabbitMQ Listener
$msgPath = Join-Path $base "infrastructure\messaging"

$catalogEventListener = @"
package com.blueceylon.auth_service.infrastructure.messaging;

import com.blueceylon.auth_service.application.service.RoleManagementService;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class CatalogEventListener {

    private final RoleManagementService roleManagementService;

    public CatalogEventListener(RoleManagementService roleManagementService) {
        this.roleManagementService = roleManagementService;
    }

    @RabbitListener(queues = "auth.business.approval.queue")
    public void handleBusinessApprovedEvent(String ownerId) {
        // ownerId corresponds to keycloak_sub
        roleManagementService.escalateToBusinessOwner(ownerId);
    }
}
"@
Set-Content -Path (Join-Path $msgPath "CatalogEventListener.java") -Value $catalogEventListener -Encoding UTF8

Write-Host "Created Services, Controllers, and Event Listener"
