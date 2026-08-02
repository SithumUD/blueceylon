package com.blueceylon.auth_service.application.dto;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
public class ForgotPasswordRequest {
    @NotBlank @Email private String email;
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}
