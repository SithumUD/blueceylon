package com.blueceylon.booking_service.domain.repository;

import com.blueceylon.booking_service.domain.model.InventoryLedger;
import com.blueceylon.booking_service.domain.model.InventoryLedgerId;
import com.blueceylon.booking_service.domain.model.enums.ItemType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;

public interface InventoryLedgerRepository extends JpaRepository<InventoryLedger, InventoryLedgerId> {

    @Modifying
    @Query("UPDATE InventoryLedger il SET il.heldUnits = il.heldUnits + :quantity, il.version = il.version + 1, il.updatedAt = CURRENT_TIMESTAMP " +
           "WHERE il.id.itemType = :itemType AND il.id.itemId = :itemId AND il.id.stayDate = :date " +
           "AND il.bookedUnits + il.heldUnits + :quantity <= il.maxCapacity")
    int atomicIncrementHeld(
            @Param("itemType") ItemType itemType, 
            @Param("itemId") String itemId, 
            @Param("date") LocalDate date, 
            @Param("quantity") int quantity);

    @Modifying
    @Query("UPDATE InventoryLedger il SET il.heldUnits = il.heldUnits - :quantity, il.bookedUnits = il.bookedUnits + :quantity, il.version = il.version + 1, il.updatedAt = CURRENT_TIMESTAMP " +
           "WHERE il.id.itemType = :itemType AND il.id.itemId = :itemId AND il.id.stayDate = :date " +
           "AND il.heldUnits >= :quantity")
    int atomicConvertHoldToBooked(
            @Param("itemType") ItemType itemType, 
            @Param("itemId") String itemId, 
            @Param("date") LocalDate date, 
            @Param("quantity") int quantity);

    @Modifying
    @Query("UPDATE InventoryLedger il SET il.heldUnits = il.heldUnits - :quantity, il.version = il.version + 1, il.updatedAt = CURRENT_TIMESTAMP " +
           "WHERE il.id.itemType = :itemType AND il.id.itemId = :itemId AND il.id.stayDate = :date " +
           "AND il.heldUnits >= :quantity")
    int atomicReleaseHold(
            @Param("itemType") ItemType itemType, 
            @Param("itemId") String itemId, 
            @Param("date") LocalDate date, 
            @Param("quantity") int quantity);
}
