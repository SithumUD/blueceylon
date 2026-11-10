package com.blueceylon.catalog_service.application.service;

import com.blueceylon.catalog_service.domain.model.Business;
import com.blueceylon.catalog_service.domain.model.TourPackage;
import com.blueceylon.catalog_service.domain.model.enums.OwnerType;
import com.blueceylon.catalog_service.domain.repository.TourPackageRepository;
import com.blueceylon.catalog_service.infrastructure.persistence.repository.BusinessRepository;
import com.blueceylon.catalog_service.infrastructure.persistence.repository.TourGuideProfileRepository;
import com.blueceylon.catalog_service.presentation.dto.request.TourPackageRequest;
import com.blueceylon.catalog_service.presentation.dto.response.TourPackageResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TourPackageService {

    @Autowired
    private TourPackageRepository tourPackageRepository;

    @Autowired
    private BusinessRepository businessRepository;

    @Autowired
    private TourGuideProfileRepository guideRepository;

    public TourPackageResponse createTourPackage(String ownerId, TourPackageRequest request) {
        TourPackage tour = new TourPackage();
        tour.setOwnerId(ownerId);

        // Determine ownerType automatically based on ownerId
        OwnerType ownerType = OwnerType.TOUR_AGENCY;
        if (guideRepository.existsByUserId(ownerId)) {
            ownerType = OwnerType.TOUR_GUIDE;
        } else if (businessRepository.existsByOwnerId(ownerId)) {
            Business b = businessRepository.findByOwnerId(ownerId).orElse(null);
            if (b != null && b.getType() != null) {
                ownerType = OwnerType.valueOf(b.getType().name());
            }
        }
        tour.setOwnerType(ownerType);

        tour.setTitle(request.getTitle());
        tour.setDescription(request.getDescription());
        tour.setPrice(request.getPrice());
        tour.setDurationDays(request.getDurationDays());
        tour.setCategory(request.getCategory());
        tour.setStartingCity(request.getStartingCity());
        tour.setMinGroupSize(request.getMinGroupSize());
        tour.setMaxGroupSize(request.getMaxGroupSize());
        tour.setImageUrls(request.getImageUrls());
        tour.setDifficultyLevel(request.getDifficultyLevel());
        tour.setPhysicalRequirements(request.getPhysicalRequirements());
        tour.setTransportModeIncluded(request.getTransportModeIncluded());
        tour.setMealsIncluded(request.getMealsIncluded());
        tour.setAccommodationIncluded(request.getAccommodationIncluded());
        tour.setIsPrivateTour(request.getIsPrivateTour());

        TourPackage saved = tourPackageRepository.save(tour);
        return mapToResponse(saved);
    }

    public List<TourPackageResponse> getMyTourPackages(String ownerId) {
        return tourPackageRepository.findByOwnerId(ownerId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<TourPackageResponse> getTourPackagesByBusinessId(String businessId) {
        Business b = businessRepository.findById(businessId).orElse(null);
        String ownerId = b != null ? b.getOwnerId() : businessId;
        return tourPackageRepository.findAll().stream()
                .filter(t -> businessId.equals(t.getOwnerId()) || (ownerId != null && ownerId.equals(t.getOwnerId())))
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public TourPackageResponse getTourPackageById(String packageId) {
        TourPackage tour = tourPackageRepository.findById(packageId)
                .orElseThrow(() -> new RuntimeException("Tour Package not found"));
        return mapToResponse(tour);
    }

    public TourPackageResponse mapToResponse(TourPackage tour) {
        TourPackageResponse res = new TourPackageResponse();
        res.setId(tour.getId());
        res.setTitle(tour.getTitle());
        res.setDescription(tour.getDescription());
        res.setPrice(tour.getPrice());
        res.setCurrency(tour.getCurrency() != null ? tour.getCurrency() : com.blueceylon.catalog_service.domain.model.enums.Currency.USD);
        res.setDurationDays(tour.getDurationDays());
        res.setDurationLabel(tour.getDurationDays() != null ? (tour.getDurationDays() > 1 ? tour.getDurationDays() + " Days" : "Full Day (8 Hours)") : "1 Day");
        res.setCategory(tour.getCategory());
        res.setStartingCity(tour.getStartingCity());
        res.setLocation(tour.getStartingCity() != null ? tour.getStartingCity().name() : "Sri Lanka");
        res.setMinGroupSize(tour.getMinGroupSize());
        res.setMaxGroupSize(tour.getMaxGroupSize());
        res.setImageUrls(tour.getImageUrls());
        if (tour.getImageUrls() != null && !tour.getImageUrls().isEmpty()) {
            res.setCoverImageUrl(tour.getImageUrls().get(0));
        }
        res.setDifficultyLevel(tour.getDifficultyLevel());
        res.setPhysicalRequirements(tour.getPhysicalRequirements());
        res.setTransportModeIncluded(tour.getTransportModeIncluded());
        res.setMealsIncluded(tour.getMealsIncluded());
        res.setAccommodationIncluded(tour.getAccommodationIncluded());
        res.setIsPrivateTour(tour.getIsPrivateTour());
        res.setProviderId(tour.getOwnerId());
        res.setProviderType(tour.getOwnerType());

        // Resolve Provider Name & Verification
        if (tour.getOwnerId() != null) {
            if (guideRepository.existsByUserId(tour.getOwnerId())) {
                guideRepository.findByUserId(tour.getOwnerId()).ifPresent(g -> {
                    res.setProviderName(g.getName());
                    res.setSltdaVerified(g.getStatus() == com.blueceylon.catalog_service.domain.model.enums.ApprovalStatus.APPROVED);
                    if (res.getCoverImageUrl() == null) res.setCoverImageUrl(g.getCoverImageUrl());
                });
            } else if (businessRepository.existsByOwnerId(tour.getOwnerId())) {
                businessRepository.findByOwnerId(tour.getOwnerId()).ifPresent(b -> {
                    res.setProviderName(b.getName());
                    res.setSltdaVerified(b.getVerificationStatus() == com.blueceylon.catalog_service.domain.model.enums.VerificationStatus.VERIFIED);
                    if (res.getCoverImageUrl() == null) res.setCoverImageUrl(b.getCoverImageUrl());
                });
            } else if (businessRepository.existsById(tour.getOwnerId())) {
                businessRepository.findById(tour.getOwnerId()).ifPresent(b -> {
                    res.setProviderName(b.getName());
                    res.setSltdaVerified(b.getVerificationStatus() == com.blueceylon.catalog_service.domain.model.enums.VerificationStatus.VERIFIED);
                    if (res.getCoverImageUrl() == null) res.setCoverImageUrl(b.getCoverImageUrl());
                });
            }
        }
        if (res.getProviderName() == null) {
            res.setProviderName(tour.getOwnerType() == OwnerType.TOUR_GUIDE ? "Private Tour Guide" : (tour.getOwnerType() == OwnerType.HOTEL ? "Verified Hotel Partner" : "Certified Tour Agency"));
        }
        if (res.getSltdaVerified() == null) {
            res.setSltdaVerified(false);
        }
        if (res.getCoverImageUrl() == null) {
            res.setCoverImageUrl("https://images.unsplash.com/photo-1546708973-b339540b5162");
        }
        return res;
    }

    public TourPackageResponse updateTourPackage(String ownerId, String packageId, TourPackageRequest request) {
        TourPackage tour = tourPackageRepository.findById(packageId)
                .orElseThrow(() -> new RuntimeException("Tour Package not found"));
        
        if (!tour.getOwnerId().equals(ownerId)) {
            throw new RuntimeException("You do not own this tour package");
        }

        tour.setTitle(request.getTitle());
        tour.setDescription(request.getDescription());
        tour.setPrice(request.getPrice());
        tour.setDurationDays(request.getDurationDays());
        tour.setCategory(request.getCategory());
        tour.setStartingCity(request.getStartingCity());
        tour.setMinGroupSize(request.getMinGroupSize());
        tour.setMaxGroupSize(request.getMaxGroupSize());
        tour.setImageUrls(request.getImageUrls());
        tour.setDifficultyLevel(request.getDifficultyLevel());
        tour.setPhysicalRequirements(request.getPhysicalRequirements());
        tour.setTransportModeIncluded(request.getTransportModeIncluded());
        tour.setMealsIncluded(request.getMealsIncluded());
        tour.setAccommodationIncluded(request.getAccommodationIncluded());
        tour.setIsPrivateTour(request.getIsPrivateTour());

        return mapToResponse(tourPackageRepository.save(tour));
    }

    public void deleteTourPackage(String ownerId, String packageId) {
        TourPackage tour = tourPackageRepository.findById(packageId)
                .orElseThrow(() -> new RuntimeException("Tour Package not found"));
        
        if (!tour.getOwnerId().equals(ownerId)) {
            throw new RuntimeException("You do not own this tour package");
        }
        
        tourPackageRepository.delete(tour);
    }
}
