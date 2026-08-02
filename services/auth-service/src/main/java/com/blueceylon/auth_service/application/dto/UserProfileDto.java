package com.blueceylon.auth_service.application.dto;

import com.blueceylon.auth_service.domain.model.UserProfile;
import com.blueceylon.auth_service.domain.model.enums.UserRole;

public class UserProfileDto {
    private String id;
    private String email;
    private String firstName;
    private String lastName;
    private UserRole role;
    private String businessType;

    public UserProfileDto(UserProfile profile) {
        this.id = profile.getId();
        this.email = profile.getEmail();
        this.firstName = profile.getFirstName();
        this.lastName = profile.getLastName();
        this.role = profile.getRole();
        this.businessType = profile.getBusinessType();
    }
    
    public String getId() { return id; }
    public String getEmail() { return email; }
    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
    public UserRole getRole() { return role; }
    public String getBusinessType() { return businessType; }
}
