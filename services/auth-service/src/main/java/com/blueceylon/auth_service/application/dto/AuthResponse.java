package com.blueceylon.auth_service.application.dto;

public class AuthResponse {
    private String accessToken;
    private String refreshToken;
    private int expiresIn;
    private UserProfileDto user;

    public AuthResponse(String accessToken, String refreshToken, int expiresIn, UserProfileDto user) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.expiresIn = expiresIn;
        this.user = user;
    }

    public String getAccessToken() { return accessToken; }
    public String getRefreshToken() { return refreshToken; }
    public int getExpiresIn() { return expiresIn; }
    public UserProfileDto getUser() { return user; }
}
