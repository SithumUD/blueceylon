package com.blueceylon.auth_service.application.dto;

import jakarta.validation.constraints.NotBlank;

public class SocialLoginRequest {
    @NotBlank private String provider; // "google" or "apple"
    @NotBlank private String idToken;

    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }
    public String getIdToken() { return idToken; }
    public void setIdToken(String idToken) { this.idToken = idToken; }
}
