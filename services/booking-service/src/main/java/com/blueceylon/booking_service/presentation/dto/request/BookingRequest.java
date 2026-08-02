package com.blueceylon.booking_service.presentation.dto.request;

import com.blueceylon.booking_service.domain.model.enums.ItemType;
import com.blueceylon.booking_service.domain.model.enums.PaymentMethod;

import java.time.LocalDate;
import java.time.LocalTime;

public class BookingRequest {
    private String businessId;
    private ItemType itemType;
    private String itemId;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private Integer quantity;
    private Integer guestCount;
    private PaymentMethod paymentMethod;

    // Getters and Setters
    public String getBusinessId() { return businessId; }
    public void setBusinessId(String businessId) { this.businessId = businessId; }
    public ItemType getItemType() { return itemType; }
    public void setItemType(ItemType itemType) { this.itemType = itemType; }
    public String getItemId() { return itemId; }
    public void setItemId(String itemId) { this.itemId = itemId; }
    public LocalDate getCheckInDate() { return checkInDate; }
    public void setCheckInDate(LocalDate checkInDate) { this.checkInDate = checkInDate; }
    public LocalDate getCheckOutDate() { return checkOutDate; }
    public void setCheckOutDate(LocalDate checkOutDate) { this.checkOutDate = checkOutDate; }
    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }
    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public Integer getGuestCount() { return guestCount; }
    public void setGuestCount(Integer guestCount) { this.guestCount = guestCount; }
    public PaymentMethod getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(PaymentMethod paymentMethod) { this.paymentMethod = paymentMethod; }
}

