package com.blueceylon.booking_service.infrastructure.client;

import com.blueceylon.booking_service.domain.model.enums.ItemType;
import com.blueceylon.booking_service.infrastructure.client.dto.CatalogItemDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.http.client.HttpClient;

import java.time.Duration;

@Component
public class CatalogClient {

    private final WebClient webClient;

    public CatalogClient(@Value("${catalog-service.url:http://localhost:8082}") String catalogServiceUrl) {
        HttpClient httpClient = HttpClient.create().responseTimeout(Duration.ofMillis(800));
        
        this.webClient = WebClient.builder()
                .baseUrl(catalogServiceUrl + "/api/v1/catalog/public/items")
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .build();
    }

    // A real implementation would have @CircuitBreaker(name="catalogService") and @Retry(name="catalogService")
    // Due to MVP POM missing full Resilience4j setup, we just use @Cacheable for basic degradation fallback
    @Cacheable(value = "catalogItems", key = "#type.name() + '-' + #itemId", unless = "#result == null")
    public CatalogItemDto getItem(ItemType type, String itemId) {
        String path = "";
        switch (type) {
            case ROOM:
                path = "/rooms/{id}";
                break;
            case DAY_OUT_PACKAGE:
                path = "/day-out/{id}";
                break;
            case NIGHT_OUT_PACKAGE:
                path = "/night-out/{id}";
                break;
            case HOURLY_ROOM:
                throw new UnsupportedOperationException("Hourly room fetching not yet implemented in catalog API");
            default:
                throw new IllegalArgumentException("Unknown item type");
        }

        return webClient.get()
                .uri(path, itemId)
                .retrieve()
                .bodyToMono(CatalogItemDto.class)
                .block();
    }
}
