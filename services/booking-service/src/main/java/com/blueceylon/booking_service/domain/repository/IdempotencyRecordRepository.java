package com.blueceylon.booking_service.domain.repository;

import com.blueceylon.booking_service.domain.model.IdempotencyRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;

public interface IdempotencyRecordRepository extends JpaRepository<IdempotencyRecord, String> {
    
    @Modifying
    @Query("DELETE FROM IdempotencyRecord i WHERE i.createdAt < :threshold")
    void deleteByCreatedAtBefore(@Param("threshold") Instant threshold);
}
