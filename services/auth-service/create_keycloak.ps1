$base = "c:\Users\sithu\Videos\blue-ceylon\services\auth-service\src\main\java\com\blueceylon\auth_service"

# Keycloak Clients
$keycloakPath = Join-Path $base "infrastructure\keycloak"

$keycloakAdmin = @"
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

    @Value("`${keycloak.realm}")
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

        if (response.getStatus() != 201) {
            throw new RuntimeException("Failed to create user in Keycloak, status: " + response.getStatus());
        }

        String userId = response.getLocation().getPath().replaceAll(".*/([^/]+)$", "$1");

        // Assign Role
        RoleRepresentation realmRole = keycloak.realm(realm).roles().get(role.name()).toRepresentation();
        usersResource.get(userId).roles().realmLevel().add(Collections.singletonList(realmRole));
        
        // Trigger verification email
        usersResource.get(userId).executeActionsEmail(List.of("VERIFY_EMAIL"));

        return userId;
    }

    public void updateUserRole(String keycloakSub, UserRole newRole) {
        UserResource userResource = keycloak.realm(realm).users().get(keycloakSub);
        RoleRepresentation roleRep = keycloak.realm(realm).roles().get(newRole.name()).toRepresentation();
        userResource.roles().realmLevel().add(Collections.singletonList(roleRep));
        // Note: In a production app, you might also want to remove the old TRAVELER role here.
    }

    public void triggerForgotPassword(String email) {
        List<UserRepresentation> users = keycloak.realm(realm).users().search(email, true);
        if (users != null && !users.isEmpty()) {
            UserRepresentation user = users.get(0);
            keycloak.realm(realm).users().get(user.getId()).executeActionsEmail(List.of("UPDATE_PASSWORD"));
        }
        // Always return silently even if user doesn't exist (enumeration protection)
    }

    public void safeDeleteUser(String keycloakSub) {
        UserResource userResource = keycloak.realm(realm).users().get(keycloakSub);
        UserRepresentation user = userResource.toRepresentation();
        user.setEnabled(false); // Disabling user acts as safe delete in Keycloak
        userResource.update(user);
    }
}
"@
Set-Content -Path (Join-Path $keycloakPath "KeycloakAdminClient.java") -Value $keycloakAdmin -Encoding UTF8

$keycloakTokenExchange = @"
package com.blueceylon.auth_service.infrastructure.keycloak;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Service
public class KeycloakTokenExchangeClient {

    private final WebClient webClient;

    @Value("`${keycloak.auth-server-url}")
    private String authServerUrl;

    @Value("`${keycloak.realm}")
    private String realm;

    @Value("`${keycloak.client-id}")
    private String clientId;

    public KeycloakTokenExchangeClient(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    public Map<String, Object> login(String username, String password) {
        MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
        formData.add("client_id", clientId);
        formData.add("grant_type", "password");
        formData.add("username", username);
        formData.add("password", password);

        return webClient.post()
                .uri(authServerUrl + "/realms/" + realm + "/protocol/openid-connect/token")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(BodyInserters.fromFormData(formData))
                .retrieve()
                .bodyToMono(Map.class)
                .block();
    }

    public Map<String, Object> exchangeSocialToken(String provider, String idToken) {
        MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
        formData.add("client_id", clientId);
        formData.add("grant_type", "urn:ietf:params:oauth:grant-type:token-exchange");
        formData.add("subject_token", idToken);
        formData.add("subject_token_type", "urn:ietf:params:oauth:token-type:access_token");
        formData.add("subject_issuer", provider);

        return webClient.post()
                .uri(authServerUrl + "/realms/" + realm + "/protocol/openid-connect/token")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(BodyInserters.fromFormData(formData))
                .retrieve()
                .bodyToMono(Map.class)
                .block();
    }
}
"@
Set-Content -Path (Join-Path $keycloakPath "KeycloakTokenExchangeClient.java") -Value $keycloakTokenExchange -Encoding UTF8

$keycloakConfig = @"
package com.blueceylon.auth_service.infrastructure.config;

import org.keycloak.OAuth2Constants;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class KeycloakConfig {

    @Value("`${keycloak.auth-server-url}")
    private String serverUrl;

    @Value("`${keycloak.realm}")
    private String realm;

    @Value("`${keycloak.admin.client-id}")
    private String clientId;

    @Value("`${keycloak.admin.client-secret}")
    private String clientSecret;

    @Bean
    public Keycloak keycloak() {
        return KeycloakBuilder.builder()
                .serverUrl(serverUrl)
                .realm(realm)
                .grantType(OAuth2Constants.CLIENT_CREDENTIALS)
                .clientId(clientId)
                .clientSecret(clientSecret)
                .build();
    }
}
"@
Set-Content -Path (Join-Path $base "infrastructure\config\KeycloakConfig.java") -Value $keycloakConfig -Encoding UTF8

Write-Host "Created Keycloak Classes"
