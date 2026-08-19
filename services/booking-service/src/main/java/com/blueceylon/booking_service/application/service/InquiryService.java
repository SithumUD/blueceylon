package com.blueceylon.booking_service.application.service;

import com.blueceylon.booking_service.domain.model.Inquiry;
import com.blueceylon.booking_service.domain.repository.InquiryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class InquiryService {

    private final InquiryRepository inquiryRepository;

    public InquiryService(InquiryRepository inquiryRepository) {
        this.inquiryRepository = inquiryRepository;
    }

    @Transactional
    public Inquiry createInquiry(String customerId, Inquiry inquiry) {
        inquiry.setCustomerId(customerId);
        return inquiryRepository.save(inquiry);
    }

    public List<Inquiry> getMyInquiries(String customerId) {
        return inquiryRepository.findByCustomerId(customerId);
    }

    public List<Inquiry> getBusinessInquiries(String ownerId) {
        return inquiryRepository.findByOwnerId(ownerId);
    }
}
