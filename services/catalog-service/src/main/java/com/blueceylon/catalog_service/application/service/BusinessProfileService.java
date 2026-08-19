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

import com.blueceylon.catalog_service.infrastructure.cloudinary.CloudinaryService;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

@Service
@Transactional
public class BusinessProfileService {

    private final BusinessRepository businessRepository;
    private final NotificationPublisherService notificationPublisherService;
    private final TourGuideProfileRepository guideRepository;
    private final CloudinaryService cloudinaryService;

    public BusinessProfileService(
            BusinessRepository businessRepository,
            TourGuideProfileRepository guideRepository,
            NotificationPublisherService notificationPublisherService,
            CloudinaryService cloudinaryService
    ) {
        this.notificationPublisherService = notificationPublisherService;
        this.businessRepository = businessRepository;
        this.guideRepository = guideRepository;
        this.cloudinaryService = cloudinaryService;
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
        if (request.getPropertyType() != null) hotel.setPropertyType(request.getPropertyType());
        if (request.getCheckInTime() != null) hotel.setCheckInTime(request.getCheckInTime());
        if (request.getCheckOutTime() != null) hotel.setCheckOutTime(request.getCheckOutTime());
        if (request.getPetPolicy() != null) hotel.setPetPolicy(request.getPetPolicy());
        if (request.getTotalRooms() != null) hotel.setTotalRooms(request.getTotalRooms());
        if (request.getOffersDayOutPackages() != null) hotel.setOffersDayOutPackages(request.getOffersDayOutPackages());
        if (request.getOffersNightOutPackages() != null) hotel.setOffersNightOutPackages(request.getOffersNightOutPackages());
        if (request.getOffersHourlyBooking() != null) hotel.setOffersHourlyBooking(request.getOffersHourlyBooking());
        if (StringUtils.hasText(request.getSltdaLicenseNumber())) hotel.setSltdaLicenseNumber(request.getSltdaLicenseNumber());
        return businessRepository.save(hotel);
    }

    public Business saveTourAgencyDraft(String ownerId, TourAgencyDraftRequest request) {
        checkGuideExists(ownerId);
        TourAgency agency = (TourAgency) getOrCreateBusiness(ownerId, TourAgency.class);
        mapSharedFields(agency, request);
        if (StringUtils.hasText(request.getLicenseNumber())) agency.setLicenseNumber(request.getLicenseNumber());
        if (request.getYearsInOperation() != null) agency.setYearsInBusiness(request.getYearsInOperation());
        if (request.getPartnerNetworkSize() != null) agency.setPartnerNetworkSize(request.getPartnerNetworkSize());
        if (request.getSpecializations() != null) agency.setSpecializations(new ArrayList<>(request.getSpecializations()));
        if (request.getFleetTypes() != null) agency.setFleetTypes(new ArrayList<>(request.getFleetTypes()));
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
        if (StringUtils.hasText(request.getTagline())) guide.setTagline(request.getTagline());
        if (StringUtils.hasText(request.getContactEmail())) guide.setContactEmail(request.getContactEmail());
        if (StringUtils.hasText(request.getContactPhone())) guide.setContactPhone(request.getContactPhone());
        if (StringUtils.hasText(request.getWhatsappNumber())) guide.setWhatsappNumber(request.getWhatsappNumber());
        if (request.getCity() != null) guide.setCity(request.getCity());
        if (request.getRegion() != null) guide.setRegion(request.getRegion());
        if (StringUtils.hasText(request.getCoverImageUrl())) guide.setCoverImageUrl(request.getCoverImageUrl());
        if (StringUtils.hasText(request.getLicenseNumber())) guide.setSltdaLicenseNumber(request.getLicenseNumber());
        if (StringUtils.hasText(request.getLicenseType())) guide.setLicenseType(request.getLicenseType());
        if (request.getLanguagesSpoken() != null) guide.setLanguagesSpoken(new ArrayList<>(request.getLanguagesSpoken()));
        if (request.getYearsOfExperience() != null) guide.setYearsOfExperience(request.getYearsOfExperience());
        if (request.getVehicleType() != null) guide.setVehicleType(request.getVehicleType());
        if (StringUtils.hasText(request.getVehicleModel())) guide.setVehicleModel(request.getVehicleModel());
        if (request.getVehicleAirConditioned() != null) guide.setVehicleAirConditioned(request.getVehicleAirConditioned());
        if (request.getCurrency() != null) guide.setCurrency(request.getCurrency());
        if (request.getMaxGroupSizeGuided() != null) guide.setMaxGroupSizeGuided(request.getMaxGroupSizeGuided());
        if (request.getDailyRate() != null) guide.setDailyRate(request.getDailyRate());
        if (request.getHalfDayRate() != null) guide.setHalfDayRate(request.getHalfDayRate());

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
            guide.setVerificationStatus(com.blueceylon.catalog_service.domain.model.enums.VerificationStatus.VERIFIED);
            TourGuideProfile saved = guideRepository.save(guide);

            notificationPublisherService.publishApprovalEvent(saved.getContactEmail(), saved.getName());
            notificationPublisherService.publishBusinessApprovedEvent(saved.getUserId(), "TOUR_GUIDE");
            return saved;
        }

        Business business = businessRepository.findById(profileId)
                .orElseThrow(() -> new IllegalArgumentException("Profile not found"));
        business.setStatus(ApprovalStatus.APPROVED);
        business.setVerificationStatus(com.blueceylon.catalog_service.domain.model.enums.VerificationStatus.VERIFIED);
        business.setRejectionReason(null);
        Business saved = businessRepository.save(business);

        notificationPublisherService.publishApprovalEvent(saved.getContactEmail(), saved.getName());
        notificationPublisherService.publishBusinessApprovedEvent(saved.getOwnerId(), saved.getType() != null ? saved.getType().name() : "HOTEL");
        return saved;
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
        if (StringUtils.hasText(request.getTagline())) business.setTagline(request.getTagline());
        if (StringUtils.hasText(request.getContactEmail())) business.setContactEmail(request.getContactEmail());
        if (StringUtils.hasText(request.getContactPhone())) business.setContactPhone(request.getContactPhone());
        if (StringUtils.hasText(request.getWhatsappNumber())) business.setWhatsappNumber(request.getWhatsappNumber());
        if (StringUtils.hasText(request.getWebsite())) business.setWebsite(request.getWebsite());
        if (request.getSocialLinks() != null) business.setSocialLinks(request.getSocialLinks());
        if (request.getCity() != null) business.setCity(request.getCity());
        if (request.getRegion() != null) business.setRegion(request.getRegion());
        if (StringUtils.hasText(request.getAddressLine())) business.setAddressLine(request.getAddressLine());
        if (request.getLatitude() != null) business.setLatitude(request.getLatitude());
        if (request.getLongitude() != null) business.setLongitude(request.getLongitude());
        if (StringUtils.hasText(request.getCoverImagePublicId())) business.setCoverImagePublicId(request.getCoverImagePublicId());
        
        if (StringUtils.hasText(request.getCoverImageUrl())) {
            String coverUrl = request.getCoverImageUrl();
            if (coverUrl.startsWith("data:") && cloudinaryService != null) {
                try {
                    coverUrl = cloudinaryService.uploadBase64(coverUrl, "covers");
                } catch (Exception e) {
                    // Fallback to raw string
                }
            }
            business.setCoverImageUrl(coverUrl);
        }

        if (StringUtils.hasText(request.getVideoUrl())) {
            String videoUrl = request.getVideoUrl();
            if (videoUrl.startsWith("data:") && cloudinaryService != null) {
                try {
                    videoUrl = cloudinaryService.uploadBase64(videoUrl, "videos");
                } catch (Exception e) {
                    // Fallback to raw string
                }
            }
            business.setVideoUrl(videoUrl);
        }

        if (request.getGalleryImageUrls() != null) business.setGalleryImageUrls(request.getGalleryImageUrls());
        if (request.getYearsInBusiness() != null) business.setYearsInBusiness(request.getYearsInBusiness());
        if (request.getSustainabilityBadges() != null) business.setSustainabilityBadges(new ArrayList<>(request.getSustainabilityBadges()));
        if (request.getCancellationPolicy() != null) business.setCancellationPolicy(request.getCancellationPolicy());
        if (request.getPaymentMethods() != null) business.setPaymentMethods(new ArrayList<>(request.getPaymentMethods()));
        if (request.getDepositRequired() != null) business.setDepositRequired(request.getDepositRequired());
        if (request.getDepositPercentage() != null) business.setDepositPercentage(request.getDepositPercentage());
    }

    public void deleteMyBusiness(String ownerId) {
        Business business = businessRepository.findByOwnerId(ownerId)
                .orElseThrow(() -> new RuntimeException("No business profile found for this user"));
        businessRepository.delete(business);
    }
}

