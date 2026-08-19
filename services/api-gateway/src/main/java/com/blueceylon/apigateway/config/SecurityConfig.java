package com.blueceylon.apigateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsConfigurationSource;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(ServerHttpSecurity.CsrfSpec::disable)
            .authorizeExchange(exchanges -> exchanges
                // Preflight OPTIONS requests
                .pathMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // Public auth endpoints
                .pathMatchers("/api/auth/login", "/api/v1/auth/login").permitAll()
                .pathMatchers("/api/auth/register", "/api/v1/auth/register").permitAll()
                .pathMatchers("/api/auth/refresh", "/api/v1/auth/refresh").permitAll()
                .pathMatchers("/api/auth/social/**", "/api/v1/auth/social/**").permitAll()
                .pathMatchers("/api/auth/forgot-password", "/api/v1/auth/forgot-password").permitAll()
                .pathMatchers("/api/auth/verify-email", "/api/v1/auth/verify-email").permitAll()
                
                // Public swagger endpoints
                .pathMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html", "/webjars/**").permitAll()
                
                // Public catalog endpoints (e.g. view hotels/rooms search without logging in)
                .pathMatchers("/api/v1/catalog/public/**").permitAll()
                .pathMatchers("/api/catalog/**").permitAll()

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

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(Arrays.asList("http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:*", "http://127.0.0.1:*"));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH", "HEAD"));
        config.setAllowedHeaders(Arrays.asList("*"));
        config.setExposedHeaders(Arrays.asList("Authorization", "Link", "X-Total-Count"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}

