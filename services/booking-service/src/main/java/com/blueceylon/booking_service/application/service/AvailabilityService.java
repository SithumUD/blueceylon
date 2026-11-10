package com.blueceylon.booking_service.application.service;

import com.blueceylon.booking_service.domain.model.Booking;
import com.blueceylon.booking_service.domain.model.InventoryLedger;
import com.blueceylon.booking_service.domain.model.InventoryLedgerId;
import com.blueceylon.booking_service.domain.model.enums.ItemType;
import com.blueceylon.booking_service.domain.repository.BookingRepository;
import com.blueceylon.booking_service.domain.repository.InventoryLedgerRepository;
import com.blueceylon.booking_service.infrastructure.client.CatalogClient;
import com.blueceylon.booking_service.infrastructure.client.dto.CatalogItemDto;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
public class AvailabilityService {

    private final InventoryLedgerRepository inventoryLedgerRepository;
    private final CatalogClient catalogClient;

    public AvailabilityService(InventoryLedgerRepository inventoryLedgerRepository, CatalogClient catalogClient) {
        this.inventoryLedgerRepository = inventoryLedgerRepository;
        this.catalogClient = catalogClient;
    }

    public void ensureLedgerRowsExist(ItemType itemType, String itemId, LocalDate checkInDate, LocalDate checkOutDate, Integer maxCapacity) {
        for (LocalDate date = checkInDate; date.isBefore(checkOutDate); date = date.plusDays(1)) {
            InventoryLedgerId id = new InventoryLedgerId(itemType, itemId, date);
            if (!inventoryLedgerRepository.existsById(id)) {
                InventoryLedger ledger = new InventoryLedger();
                ledger.setId(id);
                ledger.setMaxCapacity(maxCapacity);
                inventoryLedgerRepository.save(ledger);
            }
        }
    }

    @Transactional
    public void tryReserveDateRange(ItemType itemType, String itemId, LocalDate checkInDate, LocalDate checkOutDate, Integer requestedQuantity, Integer guestCount) {
        CatalogItemDto item = catalogClient.getItem(itemType, itemId);
        if (item == null) {
            throw new RuntimeException("Item not found in catalog");
        }
        
        Integer maxCapacity = item.getNormalizedCapacity();
        
        if (guestCount != null && item.getCapacity() != null) {
            int maxGuestsAllowed = item.getCapacity() * requestedQuantity;
            if (guestCount > maxGuestsAllowed) {
                throw new RuntimeException(String.format("Guest count exceeds the limit. %d requested item(s) can only accommodate up to %d guests.", requestedQuantity, maxGuestsAllowed));
            }
        }

        // Ensure rows exist (simple upsert equivalent for MVP)
        ensureLedgerRowsExist(itemType, itemId, checkInDate, checkOutDate, maxCapacity);

        for (LocalDate date = checkInDate; date.isBefore(checkOutDate); date = date.plusDays(1)) {
            int rowsUpdated = inventoryLedgerRepository.atomicIncrementHeld(itemType, itemId, date, requestedQuantity);
            if (rowsUpdated == 0) {
                // Because this is @Transactional, throwing an exception rolls back the entire transaction.
                // Any dates previously incremented in this loop will be reverted.
                throw new RuntimeException("Insufficient inventory for date: " + date);
            }
        }
    }

    @Transactional
    public void confirmHold(Booking booking) {
        for (LocalDate date = booking.getCheckInDate(); date.isBefore(booking.getCheckOutDate()); date = date.plusDays(1)) {
            int rowsUpdated = inventoryLedgerRepository.atomicConvertHoldToBooked(
                    booking.getItemType(), booking.getItemId(), date, booking.getQuantity());
            if (rowsUpdated == 0) {
                throw new RuntimeException("Failed to confirm hold (inventory mismatch) for date: " + date);
            }
        }
    }

    @Transactional
    public void releaseHold(Booking booking) {
        for (LocalDate date = booking.getCheckInDate(); date.isBefore(booking.getCheckOutDate()); date = date.plusDays(1)) {
            inventoryLedgerRepository.atomicReleaseHold(
                    booking.getItemType(), booking.getItemId(), date, booking.getQuantity());
        }
    }

    public com.blueceylon.booking_service.presentation.dto.response.AvailabilityCheckResponse checkRoomAvailability(
            String roomId, LocalDate checkInDate, LocalDate checkOutDate, Integer requestedQuantity, Integer guestCount) {
        if (requestedQuantity == null || requestedQuantity < 1) requestedQuantity = 1;
        if (checkInDate == null || checkOutDate == null || !checkInDate.isBefore(checkOutDate)) {
            return new com.blueceylon.booking_service.presentation.dto.response.AvailabilityCheckResponse(false, 0, "Invalid check-in and check-out dates");
        }
        CatalogItemDto item = catalogClient.getItem(ItemType.ROOM, roomId);
        if (item == null) {
            return new com.blueceylon.booking_service.presentation.dto.response.AvailabilityCheckResponse(false, 0, "Room not found in catalog");
        }
        Integer maxCapacity = item.getNormalizedCapacity();
        if (guestCount != null && item.getCapacity() != null) {
            int maxGuestsAllowed = item.getCapacity() * requestedQuantity;
            if (guestCount > maxGuestsAllowed) {
                return new com.blueceylon.booking_service.presentation.dto.response.AvailabilityCheckResponse(
                        false, 0, "Requested " + guestCount + " guests exceeds room max capacity of " + maxGuestsAllowed);
            }
        }

        int minAvailableUnits = maxCapacity;
        for (LocalDate date = checkInDate; date.isBefore(checkOutDate); date = date.plusDays(1)) {
            InventoryLedgerId id = new InventoryLedgerId(ItemType.ROOM, roomId, date);
            java.util.Optional<InventoryLedger> ledgerOpt = inventoryLedgerRepository.findById(id);
            int availableOnDate = maxCapacity;
            if (ledgerOpt.isPresent()) {
                InventoryLedger l = ledgerOpt.get();
                int booked = l.getBookedUnits() != null ? l.getBookedUnits() : 0;
                int held = l.getHeldUnits() != null ? l.getHeldUnits() : 0;
                int cap = l.getMaxCapacity() != null ? l.getMaxCapacity() : maxCapacity;
                availableOnDate = cap - (booked + held);
            }
            if (availableOnDate < requestedQuantity) {
                return new com.blueceylon.booking_service.presentation.dto.response.AvailabilityCheckResponse(
                        false, 0, "No rooms available on " + date);
            }
            minAvailableUnits = Math.min(minAvailableUnits, availableOnDate);
        }

        com.blueceylon.booking_service.presentation.dto.response.AvailabilityCheckResponse resp =
                new com.blueceylon.booking_service.presentation.dto.response.AvailabilityCheckResponse(
                        true, minAvailableUnits, "Room is available for selected dates");
        long nights = java.time.temporal.ChronoUnit.DAYS.between(checkInDate, checkOutDate);
        resp.setTotalNights(nights);
        resp.setPricePerNight(item.getNormalizedPrice());
        if (item.getNormalizedPrice() != null) {
            resp.setTotalPrice(item.getNormalizedPrice() * requestedQuantity * nights);
        }
        return resp;
    }
}
