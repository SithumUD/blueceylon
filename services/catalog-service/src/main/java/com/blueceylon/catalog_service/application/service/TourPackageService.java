package com.blueceylon.catalog_service.application.service;

import com.blueceylon.catalog_service.domain.model.TourPackage;
import com.blueceylon.catalog_service.domain.repository.TourPackageRepository;
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

    public TourPackageResponse createTourPackage(String ownerId, TourPackageRequest request) {
        TourPackage tour = new TourPackage();
        tour.setOwnerId(ownerId);
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

    private TourPackageResponse mapToResponse(TourPackage tour) {
        TourPackageResponse res = new TourPackageResponse();
        res.setId(tour.getId());
        res.setTitle(tour.getTitle());
        res.setDescription(tour.getDescription());
        res.setPrice(tour.getPrice());
        res.setDurationDays(tour.getDurationDays());
        res.setCategory(tour.getCategory());
        res.setStartingCity(tour.getStartingCity());
        res.setMinGroupSize(tour.getMinGroupSize());
        res.setMaxGroupSize(tour.getMaxGroupSize());
        res.setImageUrls(tour.getImageUrls());
        res.setDifficultyLevel(tour.getDifficultyLevel());
        res.setPhysicalRequirements(tour.getPhysicalRequirements());
        res.setTransportModeIncluded(tour.getTransportModeIncluded());
        res.setMealsIncluded(tour.getMealsIncluded());
        res.setAccommodationIncluded(tour.getAccommodationIncluded());
        res.setIsPrivateTour(tour.getIsPrivateTour());
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
