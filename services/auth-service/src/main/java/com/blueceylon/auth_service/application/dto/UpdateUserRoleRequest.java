package com.blueceylon.auth_service.application.dto;

import com.blueceylon.auth_service.domain.model.enums.UserRole;
import jakarta.validation.constraints.NotNull;

public class UpdateUserRoleRequest {

    @NotNull(message = "User role is required")
    private UserRole role;

    private String businessType;

    public UpdateUserRoleRequest() {}

    public UpdateUserRoleRequest(UserRole role, String businessType) {
        this.role = role;
        this.businessType = businessType;
    }

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }

    public String getBusinessType() {
        return businessType;
    }

    public void setBusinessType(String businessType) {
        this.businessType = businessType;
    }
}
