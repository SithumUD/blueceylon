package com.blueceylon.auth_service.infrastructure.keycloak;

import com.blueceylon.auth_service.domain.model.enums.UserRole;
import jakarta.ws.rs.core.Response;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class KeycloakAdminClient {

    private final Keycloak keycloak;

    @Value("${keycloak.realm}")
    private String realm;

    public KeycloakAdminClient(Keycloak keycloak) {
        this.keycloak = keycloak;
    }

    public String createUser(String email, String password, String firstName, String lastName, UserRole role) {
        UserRepresentation user = new UserRepresentation();
        user.setUsername(email);
        user.setEmail(email);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEnabled(true);
        user.setEmailVerified(false);

        CredentialRepresentation credential = new CredentialRepresentation();
        credential.setType(CredentialRepresentation.PASSWORD);
        credential.setValue(password);
        credential.setTemporary(false);
        user.setCredentials(Collections.singletonList(credential));

        UsersResource usersResource = keycloak.realm(realm).users();
        Response response = usersResource.create(user);

        if (response.getStatus() == 409) {
            List<UserRepresentation> existingUsers = usersResource.searchByEmail(email, true);
            if (!existingUsers.isEmpty()) {
                return existingUsers.get(0).getId();
            }
            throw new RuntimeException("User with email " + email + " already exists in Keycloak.");
        }

        if (response.getStatus() != 201) {
            throw new RuntimeException("Failed to create user in Keycloak, status: " + response.getStatus());
        }

        String userId = response.getLocation().getPath().replaceAll(".*/([^/]+)$", "$1");

        // Assign Role
        try {
            RoleRepresentation realmRole = keycloak.realm(realm).roles().get(role.name()).toRepresentation();
            usersResource.get(userId).roles().realmLevel().add(Collections.singletonList(realmRole));
        } catch (Exception e) {
            System.err.println("Warning: Could not assign role " + role.name() + " in Keycloak: " + e.getMessage());
        }
        
        return userId;
    }

    public void updateUserRole(String keycloakSub, UserRole newRole) {
        try {
            UserResource userResource = keycloak.realm(realm).users().get(keycloakSub);
            // Fetch existing realm roles for user and remove them to clean up old roles
            List<RoleRepresentation> existingRoles = userResource.roles().realmLevel().listAll();
            if (existingRoles != null && !existingRoles.isEmpty()) {
                userResource.roles().realmLevel().remove(existingRoles);
            }
            // Add new role
            RoleRepresentation roleRep = keycloak.realm(realm).roles().get(newRole.name()).toRepresentation();
            userResource.roles().realmLevel().add(Collections.singletonList(roleRep));
        } catch (Exception e) {
            System.err.println("Warning: Keycloak role update failed for sub " + keycloakSub + ": " + e.getMessage());
        }
    }

    public void setEmailVerified(String keycloakSub, boolean verified) {
        try {
            UserResource userResource = keycloak.realm(realm).users().get(keycloakSub);
            UserRepresentation user = userResource.toRepresentation();
            user.setEmailVerified(verified);
            userResource.update(user);
        } catch (Exception e) {
            System.err.println("Warning: Keycloak setEmailVerified failed for sub " + keycloakSub + ": " + e.getMessage());
        }
    }

    public void triggerForgotPassword(String email) {
        List<UserRepresentation> users = keycloak.realm(realm).users().search(email, true);
        if (users != null && !users.isEmpty()) {
            UserRepresentation user = users.get(0);
            try {
                keycloak.realm(realm).users().get(user.getId()).executeActionsEmail(Collections.singletonList("UPDATE_PASSWORD"));
            } catch (Exception e) {
                System.err.println("Warning: Failed to send forgot password email: " + e.getMessage());
            }
        }
    }

    public void safeDeleteUser(String keycloakSub) {
        try {
            UserResource userResource = keycloak.realm(realm).users().get(keycloakSub);
            UserRepresentation user = userResource.toRepresentation();
            user.setEnabled(false); // Soft delete: disable account
            userResource.update(user);
        } catch (Exception e) {
            System.err.println("Warning: Keycloak safe delete failed for sub " + keycloakSub + ": " + e.getMessage());
        }
    }

    public void hardDeleteUser(String keycloakSub) {
        try {
            keycloak.realm(realm).users().get(keycloakSub).remove();
        } catch (Exception e) {
            System.err.println("Warning: Keycloak hard delete failed for sub " + keycloakSub + ": " + e.getMessage());
        }
    }
}
