package com.blueceylon.booking_service.application.service;

import com.blueceylon.booking_service.domain.model.IdempotencyRecord;
import com.blueceylon.booking_service.domain.repository.IdempotencyRecordRepository;
import com.blueceylon.booking_service.presentation.dto.request.BookingRequest;
import com.blueceylon.booking_service.presentation.dto.response.BookingResponse;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.Optional;

@Service
public class IdempotencyService {

    private final IdempotencyRecordRepository repository;
    private final ObjectMapper objectMapper;

    public IdempotencyService(IdempotencyRecordRepository repository, ObjectMapper objectMapper) {
        this.repository = repository;
        this.objectMapper = objectMapper;
    }

    public Optional<IdempotencyRecord> find(String key) {
        return repository.findById(key);
    }

    public void record(String key, BookingRequest request, BookingResponse response) {
        IdempotencyRecord record = new IdempotencyRecord();
        record.setIdempotencyKey(key);
        record.setRequestHash(hashRequest(request));
        record.setResponseStatus(200);
        try {
            record.setResponseBody(objectMapper.writeValueAsString(response));
        } catch (JsonProcessingException e) {
            record.setResponseBody("{}");
        }
        record.setBookingId(response.getId());
        repository.save(record);
    }

    public boolean matchesHash(IdempotencyRecord record, BookingRequest request) {
        return record.getRequestHash().equals(hashRequest(request));
    }

    private String hashRequest(BookingRequest request) {
        try {
            String json = objectMapper.writeValueAsString(request);
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(json.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hash);
        } catch (JsonProcessingException | NoSuchAlgorithmException e) {
            throw new RuntimeException("Failed to hash request", e);
        }
    }
}
