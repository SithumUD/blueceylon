package com.blueceylon.catalog_service.application.service;

import com.blueceylon.catalog_service.domain.model.Business;
import com.blueceylon.catalog_service.domain.model.Hotel;
import com.blueceylon.catalog_service.domain.model.Room;
import com.blueceylon.catalog_service.infrastructure.persistence.repository.BusinessRepository;
import com.blueceylon.catalog_service.domain.repository.RoomRepository;
import com.blueceylon.catalog_service.presentation.dto.request.RoomRequest;
import com.blueceylon.catalog_service.presentation.dto.response.RoomResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RoomService {

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private BusinessRepository businessRepository;

    public Room getRoomById(String roomId) {
        return roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));
    }

    public RoomResponse createRoom(String ownerId, RoomRequest request) {
        Business business = businessRepository.findByOwnerId(ownerId)
                .orElseThrow(() -> new RuntimeException("No business profile found for this user"));

        if (!(business instanceof Hotel)) {
            throw new RuntimeException("Only Hotels can create Rooms");
        }

        Room room = new Room();
        room.setHotel((Hotel) business);
        room.setCity(business.getCity());
        room.setRoomNumber(request.getRoomNumber());
        room.setRoomType(request.getRoomType());
        room.setPricePerNight(request.getPricePerNight());
        room.setCurrency(request.getCurrency());
        room.setCapacity(request.getCapacity());
        if (request.getTotalUnits() != null) {
            room.setTotalUnits(request.getTotalUnits());
        }
        room.setBedCount(request.getBedCount());
        room.setSizeSquareMeters(request.getSizeSquareMeters());
        room.setImageUrls(request.getImageUrls());
        room.setViewType(request.getViewType());
        room.setBedConfiguration(request.getBedConfiguration());
        room.setSmokingAllowed(request.getSmokingAllowed());
        room.setIsHourlyBookable(request.getIsHourlyBookable());

        Room saved = roomRepository.save(room);
        return mapToResponse(saved);
    }

    public List<RoomResponse> getMyRooms(String ownerId) {
        Business business = businessRepository.findByOwnerId(ownerId)
                .orElseThrow(() -> new RuntimeException("No business profile found"));
        return roomRepository.findByHotelId(business.getId()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private RoomResponse mapToResponse(Room room) {
        RoomResponse response = new RoomResponse();
        response.setId(room.getId());
        response.setRoomNumber(room.getRoomNumber());
        response.setRoomType(room.getRoomType());
        response.setPricePerNight(room.getPricePerNight());
        response.setCurrency(room.getCurrency());
        response.setCapacity(room.getCapacity());
        response.setTotalUnits(room.getTotalUnits());
        response.setBedCount(room.getBedCount());
        response.setSizeSquareMeters(room.getSizeSquareMeters());
        response.setImageUrls(room.getImageUrls());
        response.setViewType(room.getViewType());
        response.setBedConfiguration(room.getBedConfiguration());
        response.setSmokingAllowed(room.getSmokingAllowed());
        response.setIsHourlyBookable(room.getIsHourlyBookable());
        return response;
    }

    public RoomResponse updateRoom(String ownerId, String roomId, RoomRequest request) {
        Business business = businessRepository.findByOwnerId(ownerId)
                .orElseThrow(() -> new RuntimeException("No business profile found"));
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));
        
        if (!room.getHotel().getId().equals(business.getId())) {
            throw new RuntimeException("You do not own this room");
        }

        room.setRoomNumber(request.getRoomNumber());
        room.setRoomType(request.getRoomType());
        room.setPricePerNight(request.getPricePerNight());
        room.setCurrency(request.getCurrency());
        room.setCapacity(request.getCapacity());
        if (request.getTotalUnits() != null) {
            room.setTotalUnits(request.getTotalUnits());
        }
        room.setBedCount(request.getBedCount());
        room.setSizeSquareMeters(request.getSizeSquareMeters());
        room.setImageUrls(request.getImageUrls());
        room.setViewType(request.getViewType());
        room.setBedConfiguration(request.getBedConfiguration());
        room.setSmokingAllowed(request.getSmokingAllowed());
        room.setIsHourlyBookable(request.getIsHourlyBookable());

        return mapToResponse(roomRepository.save(room));
    }

    public void deleteRoom(String ownerId, String roomId) {
        Business business = businessRepository.findByOwnerId(ownerId)
                .orElseThrow(() -> new RuntimeException("No business profile found"));
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));
        
        if (!room.getHotel().getId().equals(business.getId())) {
            throw new RuntimeException("You do not own this room");
        }
        
        roomRepository.delete(room);
    }
}

