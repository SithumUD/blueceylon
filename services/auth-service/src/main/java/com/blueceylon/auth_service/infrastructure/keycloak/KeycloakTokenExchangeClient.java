package com.blueceylon.auth_service.infrastructure.keycloak;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Map;

@Service
public class KeycloakTokenExchangeClient {

    private final WebClient webClient;

    @Value("${keycloak.auth-server-url}")
    private String authServerUrl;

    @Value("${keycloak.realm}")
    private String realm;

    @Value("${keycloak.client-id}")
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

    /**
     * Admin Impersonation: Performs Keycloak OAuth2 Token Exchange for a target user
     * without requiring their login password.
     */
    public Map<String, Object> impersonateUser(String targetSubjectOrEmail) {
        MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
        formData.add("client_id", clientId);
        formData.add("grant_type", "urn:ietf:params:oauth:grant-type:token-exchange");
        formData.add("requested_subject", targetSubjectOrEmail);
        formData.add("requested_token_type", "urn:ietf:params:oauth:token-type:access_token");

        try {
            return webClient.post()
                    .uri(authServerUrl + "/realms/" + realm + "/protocol/openid-connect/token")
                    .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                    .body(BodyInserters.fromFormData(formData))
                    .retrieve()
                    .bodyToMono(Map.class)
                    .onErrorResume(e -> Mono.empty())
                    .block();
        } catch (Exception e) {
            System.err.println("Warning: Keycloak Token Exchange impersonation call failed: " + e.getMessage());
            return null;
        }
    }
}
