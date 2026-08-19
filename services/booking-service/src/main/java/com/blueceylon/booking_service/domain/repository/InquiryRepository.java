package com.blueceylon.booking_service.domain.repository;

import com.blueceylon.booking_service.domain.model.Inquiry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InquiryRepository extends JpaRepository<Inquiry, String> {
    List<Inquiry> findByCustomerId(String customerId);
    List<Inquiry> findByOwnerId(String ownerId);
}
