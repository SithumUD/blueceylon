package com.blueceylon.auth_service.presentation.rest;

import com.blueceylon.auth_service.application.dto.ImpersonateResponse;
import com.blueceylon.auth_service.application.dto.UpdateUserRoleRequest;
import com.blueceylon.auth_service.application.dto.UserProfileDto;
import com.blueceylon.auth_service.application.service.AdminUserService;
import com.blueceylon.auth_service.domain.model.enums.UserRole;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/auth/admin/users")
public class AdminUserController {

    private final AdminUserService adminUserService;

    public AdminUserController(AdminUserService adminUserService) {
        this.adminUserService = adminUserService;
    }

    /**
     * Get list of users with optional search filter and role filter.
     * GET /api/v1/auth/admin/users?search=amal&role=TRAVELER
     */
    @GetMapping
    public ResponseEntity<List<UserProfileDto>> getAllUsers(
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "role", required = false) UserRole role) {
        return ResponseEntity.ok(adminUserService.getAllUsers(search, role));
    }

    /**
     * Get specific user profile by ID or Keycloak SUB.
     * GET /api/v1/auth/admin/users/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<UserProfileDto> getUserById(@PathVariable("id") String id) {
        return ResponseEntity.ok(adminUserService.getUserById(id));
    }

    /**
     * Update user role (e.g. promote to ADMIN, BUSINESS_OWNER, TOUR_GUIDE, TRAVELER).
     * PUT /api/v1/auth/admin/users/{id}/role
     */
    @PutMapping("/{id}/role")
    public ResponseEntity<UserProfileDto> updateUserRole(
            @PathVariable("id") String id,
            @Valid @RequestBody UpdateUserRoleRequest request) {
        return ResponseEntity.ok(adminUserService.updateUserRole(id, request.getRole(), request.getBusinessType()));
    }

    /**
     * Soft delete user (disables user in Keycloak & sets deleted_at in DB).
     * DELETE /api/v1/auth/admin/users/{id}/soft-delete
     */
    @DeleteMapping("/{id}/soft-delete")
    public ResponseEntity<Void> softDeleteUser(@PathVariable("id") String id) {
        adminUserService.softDeleteUser(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Hard delete user (permanently removes from Keycloak & DB).
     * DELETE /api/v1/auth/admin/users/{id}/hard-delete
     */
    @DeleteMapping("/{id}/hard-delete")
    public ResponseEntity<Void> hardDeleteUser(@PathVariable("id") String id) {
        adminUserService.hardDeleteUser(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Admin Impersonation: Allows admin to generate an access token for a target user
     * without knowing their password to troubleshoot user issues.
     * POST /api/v1/auth/admin/users/{id}/impersonate
     */
    @PostMapping("/{id}/impersonate")
    public ResponseEntity<ImpersonateResponse> impersonateUser(
            @PathVariable("id") String id,
            @RequestHeader(value = "X-Admin-Sub", required = false, defaultValue = "admin-sub") String adminSub) {
        return ResponseEntity.ok(adminUserService.impersonateUser(id, adminSub));
    }
}
