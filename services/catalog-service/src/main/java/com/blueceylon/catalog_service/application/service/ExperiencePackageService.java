package com.blueceylon.catalog_service.application.service;

import com.blueceylon.catalog_service.domain.model.*;
import com.blueceylon.catalog_service.domain.repository.*;
import com.blueceylon.catalog_service.infrastructure.persistence.repository.BusinessRepository;
import com.blueceylon.catalog_service.presentation.dto.request.*;
import com.blueceylon.catalog_service.presentation.dto.response.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExperiencePackageService {

    @Autowired
    private BusinessRepository businessRepository;

    @Autowired
    private DayOutPackageRepository dayOutRepo;

    @Autowired
    private NightOutPackageRepository nightOutRepo;

    @Autowired
    private HourlyRoomBookingRepository hourlyRepo;

    @Autowired
    private RoomRepository roomRepository;

    public DayOutPackage getDayOutPackageById(String id) {
        return dayOutRepo.findById(id).orElseThrow(() -> new RuntimeException("DayOutPackage not found"));
    }

    public NightOutPackage getNightOutPackageById(String id) {
        return nightOutRepo.findById(id).orElseThrow(() -> new RuntimeException("NightOutPackage not found"));
    }

    public DayOutPackageResponse createDayOutPackage(String ownerId, DayOutPackageRequest request) {
        Hotel hotel = getHotelForOwner(ownerId);
        DayOutPackage pkg = new DayOutPackage();
        pkg.setHotel(hotel);
        pkg.setTitle(request.getTitle());
        pkg.setDescription(request.getDescription());
        pkg.setPrice(request.getPrice());
        pkg.setPricingUnit(request.getPricingUnit());
        pkg.setStartTime(request.getStartTime());
        pkg.setEndTime(request.getEndTime());
        pkg.setMaxOccupancy(request.getMaxOccupancy());
        pkg.setAvailableDays(request.getAvailableDays());
        pkg.setImageUrls(request.getImageUrls());
        pkg.setAdvanceBookingHoursRequired(request.getAdvanceBookingHoursRequired());

        DayOutPackage saved = dayOutRepo.save(pkg);
        return mapToDayOutResponse(saved);
    }

    public List<DayOutPackageResponse> getMyDayOutPackages(String ownerId) {
        return dayOutRepo.findByHotelId(getHotelForOwner(ownerId).getId()).stream()
                .map(this::mapToDayOutResponse).collect(Collectors.toList());
    }

    public NightOutPackageResponse createNightOutPackage(String ownerId, NightOutPackageRequest request) {
        Hotel hotel = getHotelForOwner(ownerId);
        NightOutPackage pkg = new NightOutPackage();
        pkg.setHotel(hotel);
        pkg.setTitle(request.getTitle());
        pkg.setDescription(request.getDescription());
        pkg.setPrice(request.getPrice());
        pkg.setPricingUnit(request.getPricingUnit());
        pkg.setStartTime(request.getStartTime());
        pkg.setEndTime(request.getEndTime());
        pkg.setIncludesOvernightStay(request.getIncludesOvernightStay());
        pkg.setOccasionTags(request.getOccasionTags());
        pkg.setMaxOccupancy(request.getMaxOccupancy());
        pkg.setImageUrls(request.getImageUrls());
        pkg.setAdvanceBookingHoursRequired(request.getAdvanceBookingHoursRequired());

        NightOutPackage saved = nightOutRepo.save(pkg);
        return mapToNightOutResponse(saved);
    }

    public List<NightOutPackageResponse> getMyNightOutPackages(String ownerId) {
        return nightOutRepo.findByHotelId(getHotelForOwner(ownerId).getId()).stream()
                .map(this::mapToNightOutResponse).collect(Collectors.toList());
    }

    public HourlyRoomBookingResponse createHourlyBooking(String ownerId, String roomId, HourlyRoomBookingRequest request) {
        Hotel hotel = getHotelForOwner(ownerId);
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        if (!room.getHotel().getId().equals(hotel.getId())) {
            throw new RuntimeException("You do not own this room");
        }
        if (room.getIsHourlyBookable() == null || !room.getIsHourlyBookable()) {
            throw new RuntimeException("Room is not flagged as hourly bookable");
        }

        HourlyRoomBooking booking = new HourlyRoomBooking();
        booking.setRoom(room);
        booking.setMinimumHours(request.getMinimumHours());
        booking.setMaximumHours(request.getMaximumHours());
        booking.setHourlyRate(request.getHourlyRate());
        booking.setExtraHourRate(request.getExtraHourRate());
        booking.setAvailableSlots(request.getAvailableSlots());
        booking.setMaxOccupancy(request.getMaxOccupancy());
        booking.setCleaningBufferMinutes(request.getCleaningBufferMinutes());
        booking.setIdVerificationRequired(request.getIdVerificationRequired());

        HourlyRoomBooking saved = hourlyRepo.save(booking);
        return mapToHourlyResponse(saved);
    }

    public List<HourlyRoomBookingResponse> getMyHourlyBookings(String ownerId) {
        return hourlyRepo.findByRoomHotelId(getHotelForOwner(ownerId).getId()).stream()
                .map(this::mapToHourlyResponse).collect(Collectors.toList());
    }

    private Hotel getHotelForOwner(String ownerId) {
        Business business = businessRepository.findByOwnerId(ownerId)
                .orElseThrow(() -> new RuntimeException("No business profile found for this user"));
        if (!(business instanceof Hotel)) {
            throw new RuntimeException("Only Hotels can manage these packages");
        }
        return (Hotel) business;
    }

    private DayOutPackageResponse mapToDayOutResponse(DayOutPackage p) {
        DayOutPackageResponse res = new DayOutPackageResponse();
        res.setId(p.getId());
        res.setTitle(p.getTitle());
        res.setDescription(p.getDescription());
        res.setPrice(p.getPrice());
        res.setPricingUnit(p.getPricingUnit());
        res.setStartTime(p.getStartTime());
        res.setEndTime(p.getEndTime());
        res.setMaxOccupancy(p.getMaxOccupancy());
        res.setAvailableDays(p.getAvailableDays());
        res.setImageUrls(p.getImageUrls());
        res.setAdvanceBookingHoursRequired(p.getAdvanceBookingHoursRequired());
        return res;
    }

    private NightOutPackageResponse mapToNightOutResponse(NightOutPackage p) {
        NightOutPackageResponse res = new NightOutPackageResponse();
        res.setId(p.getId());
        res.setTitle(p.getTitle());
        res.setDescription(p.getDescription());
        res.setPrice(p.getPrice());
        res.setPricingUnit(p.getPricingUnit());
        res.setStartTime(p.getStartTime());
        res.setEndTime(p.getEndTime());
        res.setIncludesOvernightStay(p.getIncludesOvernightStay());
        res.setOccasionTags(p.getOccasionTags());
        res.setMaxOccupancy(p.getMaxOccupancy());
        res.setImageUrls(p.getImageUrls());
        res.setAdvanceBookingHoursRequired(p.getAdvanceBookingHoursRequired());
        return res;
    }

    private HourlyRoomBookingResponse mapToHourlyResponse(HourlyRoomBooking b) {
        HourlyRoomBookingResponse res = new HourlyRoomBookingResponse();
        res.setId(b.getId());
        res.setRoomId(b.getRoom().getId());
        res.setMinimumHours(b.getMinimumHours());
        res.setMaximumHours(b.getMaximumHours());
        res.setHourlyRate(b.getHourlyRate());
        res.setExtraHourRate(b.getExtraHourRate());
        res.setAvailableSlots(b.getAvailableSlots());
        res.setMaxOccupancy(b.getMaxOccupancy());
        res.setCleaningBufferMinutes(b.getCleaningBufferMinutes());
        res.setIdVerificationRequired(b.getIdVerificationRequired());
        return res;
    }

    public DayOutPackageResponse updateDayOutPackage(String ownerId, String packageId, DayOutPackageRequest request) {
        Hotel hotel = getHotelForOwner(ownerId);
        DayOutPackage pkg = dayOutRepo.findById(packageId).orElseThrow(() -> new RuntimeException("Package not found"));
        if (!pkg.getHotel().getId().equals(hotel.getId())) throw new RuntimeException("Not your package");

        pkg.setTitle(request.getTitle());
        pkg.setDescription(request.getDescription());
        pkg.setPrice(request.getPrice());
        pkg.setPricingUnit(request.getPricingUnit());
        pkg.setStartTime(request.getStartTime());
        pkg.setEndTime(request.getEndTime());
        pkg.setMaxOccupancy(request.getMaxOccupancy());
        pkg.setAvailableDays(request.getAvailableDays());
        pkg.setImageUrls(request.getImageUrls());
        pkg.setAdvanceBookingHoursRequired(request.getAdvanceBookingHoursRequired());

        return mapToDayOutResponse(dayOutRepo.save(pkg));
    }

    public void deleteDayOutPackage(String ownerId, String packageId) {
        Hotel hotel = getHotelForOwner(ownerId);
        DayOutPackage pkg = dayOutRepo.findById(packageId).orElseThrow(() -> new RuntimeException("Package not found"));
        if (!pkg.getHotel().getId().equals(hotel.getId())) throw new RuntimeException("Not your package");
        dayOutRepo.delete(pkg);
    }

    public NightOutPackageResponse updateNightOutPackage(String ownerId, String packageId, NightOutPackageRequest request) {
        Hotel hotel = getHotelForOwner(ownerId);
        NightOutPackage pkg = nightOutRepo.findById(packageId).orElseThrow(() -> new RuntimeException("Package not found"));
        if (!pkg.getHotel().getId().equals(hotel.getId())) throw new RuntimeException("Not your package");

        pkg.setTitle(request.getTitle());
        pkg.setDescription(request.getDescription());
        pkg.setPrice(request.getPrice());
        pkg.setPricingUnit(request.getPricingUnit());
        pkg.setStartTime(request.getStartTime());
        pkg.setEndTime(request.getEndTime());
        pkg.setIncludesOvernightStay(request.getIncludesOvernightStay());
        pkg.setOccasionTags(request.getOccasionTags());
        pkg.setMaxOccupancy(request.getMaxOccupancy());
        pkg.setImageUrls(request.getImageUrls());
        pkg.setAdvanceBookingHoursRequired(request.getAdvanceBookingHoursRequired());

        return mapToNightOutResponse(nightOutRepo.save(pkg));
    }

    public void deleteNightOutPackage(String ownerId, String packageId) {
        Hotel hotel = getHotelForOwner(ownerId);
        NightOutPackage pkg = nightOutRepo.findById(packageId).orElseThrow(() -> new RuntimeException("Package not found"));
        if (!pkg.getHotel().getId().equals(hotel.getId())) throw new RuntimeException("Not your package");
        nightOutRepo.delete(pkg);
    }

    public HourlyRoomBookingResponse updateHourlyBooking(String ownerId, String bookingId, HourlyRoomBookingRequest request) {
        Hotel hotel = getHotelForOwner(ownerId);
        HourlyRoomBooking booking = hourlyRepo.findById(bookingId).orElseThrow(() -> new RuntimeException("Booking not found"));
        if (!booking.getRoom().getHotel().getId().equals(hotel.getId())) throw new RuntimeException("Not your booking");

        booking.setMinimumHours(request.getMinimumHours());
        booking.setMaximumHours(request.getMaximumHours());
        booking.setHourlyRate(request.getHourlyRate());
        booking.setExtraHourRate(request.getExtraHourRate());
        booking.setAvailableSlots(request.getAvailableSlots());
        booking.setMaxOccupancy(request.getMaxOccupancy());
        booking.setCleaningBufferMinutes(request.getCleaningBufferMinutes());
        booking.setIdVerificationRequired(request.getIdVerificationRequired());

        return mapToHourlyResponse(hourlyRepo.save(booking));
    }

    public void deleteHourlyBooking(String ownerId, String bookingId) {
        Hotel hotel = getHotelForOwner(ownerId);
        HourlyRoomBooking booking = hourlyRepo.findById(bookingId).orElseThrow(() -> new RuntimeException("Booking not found"));
        if (!booking.getRoom().getHotel().getId().equals(hotel.getId())) throw new RuntimeException("Not your booking");
        hourlyRepo.delete(booking);
    }
}

