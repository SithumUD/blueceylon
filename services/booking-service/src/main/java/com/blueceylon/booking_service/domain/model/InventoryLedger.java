package com.blueceylon.booking_service.domain.model;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import org.hibernate.annotations.Check;

import java.time.Instant;

@Entity
@Table(name = "inventory_ledger")
@Check(constraints = "booked_units + held_units <= max_capacity AND booked_units >= 0 AND held_units >= 0")
public class InventoryLedger {

    @EmbeddedId
    private InventoryLedgerId id;

    @Column(nullable = false)
    private Integer maxCapacity;

    @Column(nullable = false)
    private Integer bookedUnits = 0;

    @Column(nullable = false)
    private Integer heldUnits = 0;

    @Version
    private Long version;

    @Column(nullable = false)
    private Instant updatedAt = Instant.now();

    public InventoryLedgerId getId() { return id; }
    public void setId(InventoryLedgerId id) { this.id = id; }
    public Integer getMaxCapacity() { return maxCapacity; }
    public void setMaxCapacity(Integer maxCapacity) { this.maxCapacity = maxCapacity; }
    public Integer getBookedUnits() { return bookedUnits; }
    public void setBookedUnits(Integer bookedUnits) { this.bookedUnits = bookedUnits; }
    public Integer getHeldUnits() { return heldUnits; }
    public void setHeldUnits(Integer heldUnits) { this.heldUnits = heldUnits; }
    public Long getVersion() { return version; }
    public void setVersion(Long version) { this.version = version; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
