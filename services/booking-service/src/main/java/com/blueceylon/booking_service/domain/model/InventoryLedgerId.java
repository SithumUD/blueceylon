package com.blueceylon.booking_service.domain.model;

import com.blueceylon.booking_service.domain.model.enums.ItemType;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.Objects;

@Embeddable
public class InventoryLedgerId implements Serializable {

    @Enumerated(EnumType.STRING)
    private ItemType itemType;

    private String itemId;

    private LocalDate stayDate;

    public InventoryLedgerId() {}

    public InventoryLedgerId(ItemType itemType, String itemId, LocalDate stayDate) {
        this.itemType = itemType;
        this.itemId = itemId;
        this.stayDate = stayDate;
    }

    public ItemType getItemType() { return itemType; }
    public void setItemType(ItemType itemType) { this.itemType = itemType; }
    public String getItemId() { return itemId; }
    public void setItemId(String itemId) { this.itemId = itemId; }
    public LocalDate getStayDate() { return stayDate; }
    public void setStayDate(LocalDate stayDate) { this.stayDate = stayDate; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        InventoryLedgerId that = (InventoryLedgerId) o;
        return itemType == that.itemType && Objects.equals(itemId, that.itemId) && Objects.equals(stayDate, that.stayDate);
    }

    @Override
    public int hashCode() {
        return Objects.hash(itemType, itemId, stayDate);
    }
}
