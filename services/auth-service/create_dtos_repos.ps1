$base = "c:\Users\sithu\Videos\blue-ceylon\services\auth-service\src\main\java\com\blueceylon\auth_service"

# DTOs
$dtoPath = Join-Path $base "application\dto"
New-Item -ItemType Directory -Force -Path $dtoPath | Out-Null

$registerRequest = @"
package com.blueceylon.auth_service.application.dto;

import com.blueceylon.auth_service.domain.model.enums.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class RegisterRequest {
    @NotBlank @Email private String email;
    @NotBlank private String password;
    @NotBlank private String firstName;
    @NotBlank private String lastName;
    private String phoneNumber;
    @NotNull private UserRole role; // Expected TRAVELER, BUSINESS_OWNER, or TOUR_GUIDE

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    public UserRole getRole() { return role; }
    public void setRole(UserRole role) { this.role = role; }
}
"@
Set-Content -Path (Join-Path $dtoPath "RegisterRequest.java") -Value $registerRequest -Encoding UTF8

$loginRequest = @"
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
"@
Set-Content -Path (Join-Path $dtoPath "LoginRequest.java") -Value $loginRequest -Encoding UTF8

$authResponse = @"
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
"@
Set-Content -Path (Join-Path $dtoPath "AuthResponse.java") -Value $authResponse -Encoding UTF8

$userProfileDto = @"
package com.blueceylon.auth_service.application.dto;

import com.blueceylon.auth_service.domain.model.UserProfile;
import com.blueceylon.auth_service.domain.model.enums.UserRole;

public class UserProfileDto {
    private String id;
    private String email;
    private String firstName;
    private String lastName;
    private UserRole role;

    public UserProfileDto(UserProfile profile) {
        this.id = profile.getId();
        this.email = profile.getEmail();
        this.firstName = profile.getFirstName();
        this.lastName = profile.getLastName();
        this.role = profile.getRole();
    }
    
    public String getId() { return id; }
    public String getEmail() { return email; }
    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
    public UserRole getRole() { return role; }
}
"@
Set-Content -Path (Join-Path $dtoPath "UserProfileDto.java") -Value $userProfileDto -Encoding UTF8

$socialLoginReq = @"
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
"@
Set-Content -Path (Join-Path $dtoPath "SocialLoginRequest.java") -Value $socialLoginReq -Encoding UTF8

$forgotPasswordReq = @"
package com.blueceylon.auth_service.application.dto;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
public class ForgotPasswordRequest {
    @NotBlank @Email private String email;
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}
"@
Set-Content -Path (Join-Path $dtoPath "ForgotPasswordRequest.java") -Value $forgotPasswordReq -Encoding UTF8

# Repositories
$repoPath = Join-Path $base "domain\repository"
$userProfileRepo = @"
package com.blueceylon.auth_service.domain.repository;

import com.blueceylon.auth_service.domain.model.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserProfileRepository extends JpaRepository<UserProfile, String> {
    Optional<UserProfile> findByKeycloakSub(String keycloakSub);
    Optional<UserProfile> findByEmail(String email);
}
"@
Set-Content -Path (Join-Path $repoPath "UserProfileRepository.java") -Value $userProfileRepo -Encoding UTF8

Write-Host "Created DTOs and Repositories"
