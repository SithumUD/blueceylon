package com.blueceylon.auth_service.application.dto;

import jakarta.validation.constraints.NotBlank;

public class LoginRequest {
    @NotBlank private String email;
    @NotBlank private String password;
    private String otp; // For 2FA if needed by Keycloak

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getOtp() { return otp; }
    public void setOtp(String otp) { this.otp = otp; }
}
