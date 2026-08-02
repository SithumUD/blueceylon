$base = "c:\Users\sithu\Videos\blue-ceylon\services\auth-service\src\main\java\com\blueceylon\auth_service"

$folders = @(
    "domain\model\enums",
    "domain\repository",
    "domain\service",
    "domain\exception",
    "application\dto",
    "application\mapper",
    "application\service",
    "application\port",
    "infrastructure\persistence",
    "infrastructure\messaging",
    "infrastructure\config",
    "infrastructure\keycloak",
    "presentation\rest",
    "presentation\exception"
)

foreach ($folder in $folders) {
    $fullPath = Join-Path $base $folder
    if (-not (Test-Path $fullPath)) {
        New-Item -ItemType Directory -Force -Path $fullPath
    }
}

$modelsBase = Join-Path $base "domain\model"

# BaseModel.java
$baseModel = @"
package com.blueceylon.auth_service.domain.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@MappedSuperclass
public abstract class BaseModel {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    public LocalDateTime getDeletedAt() { return deletedAt; }
    public void setDeletedAt(LocalDateTime deletedAt) { this.deletedAt = deletedAt; }
}
"@
Set-Content -Path (Join-Path $modelsBase "BaseModel.java") -Value $baseModel -Encoding UTF8

# UserRole.java
$userRole = @"
package com.blueceylon.auth_service.domain.model.enums;

public enum UserRole {
    TRAVELER,
    BUSINESS_OWNER,
    TOUR_GUIDE,
    ADMIN
}
"@
Set-Content -Path (Join-Path $modelsBase "enums\UserRole.java") -Value $userRole -Encoding UTF8

# UserProfile.java
$userProfile = @"
package com.blueceylon.auth_service.domain.model;

import com.blueceylon.auth_service.domain.model.enums.UserRole;
import jakarta.persistence.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_profiles", indexes = {
        @Index(name = "idx_user_keycloak_sub", columnList = "keycloak_sub", unique = true),
        @Index(name = "idx_user_email", columnList = "email", unique = true)
})
@SQLDelete(sql = "UPDATE user_profiles SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
public class UserProfile extends BaseModel {

    /** The exact 'sub' claim from Keycloak's JWT. This is the primary linkage to IAM. */
    @Column(name = "keycloak_sub", nullable = false, unique = true)
    private String keycloakSub;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "profile_image_url")
    private String profileImageUrl;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role = UserRole.TRAVELER;

    @Column(name = "last_login_at")
    private LocalDateTime lastLoginAt;

    public String getKeycloakSub() { return keycloakSub; }
    public void setKeycloakSub(String keycloakSub) { this.keycloakSub = keycloakSub; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    public String getProfileImageUrl() { return profileImageUrl; }
    public void setProfileImageUrl(String profileImageUrl) { this.profileImageUrl = profileImageUrl; }
    public UserRole getRole() { return role; }
    public void setRole(UserRole role) { this.role = role; }
    public LocalDateTime getLastLoginAt() { return lastLoginAt; }
    public void setLastLoginAt(LocalDateTime lastLoginAt) { this.lastLoginAt = lastLoginAt; }
}
"@
Set-Content -Path (Join-Path $modelsBase "UserProfile.java") -Value $userProfile -Encoding UTF8

Write-Host "Scaffolded auth-service"
