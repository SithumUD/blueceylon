package com.blueceylon.catalog_service.application.service;

import com.blueceylon.catalog_service.domain.model.*;
import com.blueceylon.catalog_service.domain.model.enums.ApprovalStatus;
import com.blueceylon.catalog_service.infrastructure.persistence.repository.BusinessRepository;
import com.blueceylon.catalog_service.infrastructure.persistence.repository.TourGuideProfileRepository;
import com.blueceylon.catalog_service.presentation.dto.request.BaseBusinessDraftRequest;
import com.blueceylon.catalog_service.presentation.dto.request.HotelDraftRequest;
import com.blueceylon.catalog_service.presentation.dto.request.TourAgencyDraftRequest;
import com.blueceylon.catalog_service.presentation.dto.request.TourGuideDraftRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

@Service
@Transactional
public class BusinessProfileService {

    private final BusinessRepository businessRepository;
    private final NotificationPublisherService notificationPublisherService;
    private final TourGuideProfileRepository guideRepository;

    public BusinessProfileService(BusinessRepository businessRepository, TourGuideProfileRepository guideRepository, NotificationPublisherService notificationPublisherService) {
        this.notificationPublisherService = notificationPublisherService;
        this.businessRepository = businessRepository;
        this.guideRepository = guideRepository;
    }

    public Object getMyProfile(String ownerId) {
        if (guideRepository.existsByUserId(ownerId)) {
            return guideRepository.findByUserId(ownerId).orElse(null);
        }
        return businessRepository.findByOwnerId(ownerId).orElse(null);
    }

    public Business saveHotelDraft(String ownerId, HotelDraftRequest request) {
        checkGuideExists(ownerId);
        Hotel hotel = (Hotel) getOrCreateBusiness(ownerId, Hotel.class);
        mapSharedFields(hotel, request);
        if (request.getStarRating() != null) hotel.setStarRating(request.getStarRating());
        if (request.getTotalBranches() != null) hotel.setTotalBranches(request.getTotalBranches());
        return businessRepository.save(hotel);
    }

    public Business saveTourAgencyDraft(String ownerId, TourAgencyDraftRequest request) {
        checkGuideExists(ownerId);
        TourAgency agency = (TourAgency) getOrCreateBusiness(ownerId, TourAgency.class);
        mapSharedFields(agency, request);
        if (StringUtils.hasText(request.getLicenseNumber())) agency.setLicenseNumber(request.getLicenseNumber());
        if (request.getYearsInOperation() != null) agency.setYearsInBusiness(request.getYearsInOperation());
        return businessRepository.save(agency);
    }

    public TourGuideProfile saveTourGuideDraft(String ownerId, TourGuideDraftRequest request) {
        checkBusinessExists(ownerId);
        TourGuideProfile guide = guideRepository.findByUserId(ownerId).orElse(new TourGuideProfile());
        if (guide.getId() == null) {
            guide.setUserId(ownerId);
            guide.setStatus(ApprovalStatus.DRAFT);
        } else if (guide.getStatus() == ApprovalStatus.PENDING_APPROVAL) {
            throw new IllegalStateException("Cannot update profile while pending approval");
        }

        if (StringUtils.hasText(request.getName())) guide.setName(request.getName());
        if (StringUtils.hasText(request.getDescription())) guide.setDescription(request.getDescription());
        if (StringUtils.hasText(request.getCoverImageUrl())) guide.setCoverImageUrl(request.getCoverImageUrl());
        if (StringUtils.hasText(request.getLicenseNumber())) guide.setSltdaLicenseNumber(request.getLicenseNumber());
        if (request.getLanguagesSpoken() != null) guide.setLanguagesSpoken(new ArrayList<>(request.getLanguagesSpoken()));
        if (request.getYearsOfExperience() != null) guide.setYearsOfExperience(request.getYearsOfExperience());
        if (request.getVehicleType() != null) guide.setVehicleType(request.getVehicleType());
        
        return guideRepository.save(guide);
    }

    public Object submitForApproval(String ownerId) {
        if (guideRepository.existsByUserId(ownerId)) {
            TourGuideProfile guide = guideRepository.findByUserId(ownerId).get();
            if (!StringUtils.hasText(guide.getName())) throw new IllegalArgumentException("Name required");
            guide.setStatus(ApprovalStatus.PENDING_APPROVAL);
            return guideRepository.save(guide);
        }

        Business business = businessRepository.findByOwnerId(ownerId)
                .orElseThrow(() -> new IllegalStateException("Business profile not found"));
        if (!StringUtils.hasText(business.getName())) throw new IllegalArgumentException("Name required");
        business.setStatus(ApprovalStatus.PENDING_APPROVAL);
        business.setRejectionReason(null);
        return businessRepository.save(business);
    }

    public List<Object> getPendingApprovals() {
        List<Object> pending = new ArrayList<>();
        pending.addAll(businessRepository.findByStatus(ApprovalStatus.PENDING_APPROVAL));
        pending.addAll(guideRepository.findByStatus(ApprovalStatus.PENDING_APPROVAL));
        return pending;
    }

    public Object approveProfile(String profileId) {
        if (guideRepository.existsById(profileId)) {
            TourGuideProfile guide = guideRepository.findById(profileId).get();
            guide.setStatus(ApprovalStatus.APPROVED);
            return guideRepository.save(guide);
        }
        Business business = businessRepository.findById(profileId)
                .orElseThrow(() -> new IllegalArgumentException("Profile not found"));
        business.setStatus(ApprovalStatus.APPROVED);
        business.setRejectionReason(null);
        return businessRepository.save(business);
    }

    public Object rejectProfile(String profileId, String reason) {
        if (guideRepository.existsById(profileId)) {
            TourGuideProfile guide = guideRepository.findById(profileId).get();
            guide.setStatus(ApprovalStatus.REJECTED);
            return guideRepository.save(guide);
        }
        Business business = businessRepository.findById(profileId)
                .orElseThrow(() -> new IllegalArgumentException("Profile not found"));
        business.setStatus(ApprovalStatus.REJECTED);
        business.setRejectionReason(reason);
        return businessRepository.save(business);
    }

    public List<Object> getApprovedProfiles() {
        List<Object> approved = new ArrayList<>();
        approved.addAll(businessRepository.findByStatus(ApprovalStatus.APPROVED));
        approved.addAll(guideRepository.findByStatus(ApprovalStatus.APPROVED));
        return approved;
    }

    public java.util.Optional<Object> getProfileById(String profileId) {
        if (guideRepository.existsById(profileId)) {
            return java.util.Optional.of(guideRepository.findById(profileId).get());
        }
        return businessRepository.findById(profileId).map(b -> (Object)b);
    }

    private void checkGuideExists(String ownerId) {
        if (guideRepository.existsByUserId(ownerId)) {
            throw new IllegalStateException("User already has a Tour Guide profile");
        }
    }

    private void checkBusinessExists(String ownerId) {
        if (businessRepository.existsByOwnerId(ownerId)) {
            throw new IllegalStateException("User already has a Hotel or Agency profile");
        }
    }

    private Business getOrCreateBusiness(String ownerId, Class<? extends Business> clazz) {
        Business existing = businessRepository.findByOwnerId(ownerId).orElse(null);
        if (existing != null) {
            if (!existing.getClass().equals(clazz)) {
                throw new IllegalStateException("User already has a profile of type " + existing.getClass().getSimpleName());
            }
            if (existing.getStatus() == ApprovalStatus.PENDING_APPROVAL) {
                throw new IllegalStateException("Cannot update profile while pending approval");
            }
            return existing;
        }

        try {
            Business newBusiness = clazz.getDeclaredConstructor().newInstance();
            newBusiness.setOwnerId(ownerId);
            newBusiness.setStatus(ApprovalStatus.DRAFT);
            return newBusiness;
        } catch (Exception e) {
            throw new RuntimeException("Failed to instantiate business", e);
        }
    }

    private void mapSharedFields(Business business, BaseBusinessDraftRequest request) {
        if (StringUtils.hasText(request.getName())) business.setName(request.getName());
        if (StringUtils.hasText(request.getDescription())) business.setDescription(request.getDescription());
        if (StringUtils.hasText(request.getContactEmail())) business.setContactEmail(request.getContactEmail());
        if (StringUtils.hasText(request.getContactPhone())) business.setContactPhone(request.getContactPhone());
        if (request.getCity() != null) business.setCity(request.getCity());
        if (StringUtils.hasText(request.getAddressLine())) business.setAddressLine(request.getAddressLine());
        if (request.getLatitude() != null) business.setLatitude(request.getLatitude());
        if (request.getLongitude() != null) business.setLongitude(request.getLongitude());
        if (StringUtils.hasText(request.getCoverImagePublicId())) business.setCoverImagePublicId(request.getCoverImagePublicId());
        if (StringUtils.hasText(request.getCoverImageUrl())) business.setCoverImageUrl(request.getCoverImageUrl());
    }

    public void deleteMyBusiness(String ownerId) {
        Business business = businessRepository.findByOwnerId(ownerId)
                .orElseThrow(() -> new RuntimeException("No business profile found for this user"));
        businessRepository.delete(business);
    }
}

