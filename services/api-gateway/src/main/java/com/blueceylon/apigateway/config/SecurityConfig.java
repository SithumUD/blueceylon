package com.blueceylon.apigateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {
        http
            .csrf(ServerHttpSecurity.CsrfSpec::disable)
            .authorizeExchange(exchanges -> exchanges
                // Public auth endpoints
                .pathMatchers("/api/auth/login").permitAll()
                .pathMatchers("/api/auth/register").permitAll()
                .pathMatchers("/api/auth/social/**").permitAll()
                .pathMatchers("/api/auth/forgot-password").permitAll()
                
                // Public catalog endpoints (e.g. view hotels without logging in)
                .pathMatchers(org.springframework.http.HttpMethod.GET, "/api/catalog/**").permitAll()

                // All other endpoints require authentication
                .anyExchange().authenticated()
            )
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt
                    .jwtAuthenticationConverter(new KeycloakJwtAuthenticationConverter())
                )
            );
        return http.build();
    }
}
