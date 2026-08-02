package com.blueceylon.auth_service.application.dto;

public class ImpersonateResponse {

    private String accessToken;
    private String refreshToken;
    private Integer expiresIn;
    private UserProfileDto impersonatedUser;
    private String impersonatedByAdminSub;

    public ImpersonateResponse() {}

    public ImpersonateResponse(String accessToken, String refreshToken, Integer expiresIn, UserProfileDto impersonatedUser, String impersonatedByAdminSub) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.expiresIn = expiresIn;
        this.impersonatedUser = impersonatedUser;
        this.impersonatedByAdminSub = impersonatedByAdminSub;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    public Integer getExpiresIn() {
        return expiresIn;
    }

    public void setExpiresIn(Integer expiresIn) {
        this.expiresIn = expiresIn;
    }

    public UserProfileDto getImpersonatedUser() {
        return impersonatedUser;
    }

    public void setImpersonatedUser(UserProfileDto impersonatedUser) {
        this.impersonatedUser = impersonatedUser;
    }

    public String getImpersonatedByAdminSub() {
        return impersonatedByAdminSub;
    }

    public void setImpersonatedByAdminSub(String impersonatedByAdminSub) {
        this.impersonatedByAdminSub = impersonatedByAdminSub;
    }
}
