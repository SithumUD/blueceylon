$base = "c:\Users\sithu\Videos\blue-ceylon\services\booking-service\src\main\java\com\blueceylon\booking_service\domain\model"

# BaseModel.java
$baseModel = @"
package com.blueceylon.booking_service.domain.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@MappedSuperclass
public abstract class BaseModel {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    public LocalDateTime getDeletedAt() { return deletedAt; }
    public void setDeletedAt(LocalDateTime deletedAt) { this.deletedAt = deletedAt; }
}
"@
Set-Content -Path (Join-Path $base "BaseModel.java") -Value $baseModel -Encoding UTF8

# BookingStatus.java
$bookingStatus = @"
package com.blueceylon.booking_service.domain.model.enums;

public enum BookingStatus {
    PENDING_PAYMENT,
    CONFIRMED,
    CANCELLED,
    REFUNDED
}
"@
Set-Content -Path (Join-Path $base "enums\BookingStatus.java") -Value $bookingStatus -Encoding UTF8

# InquiryStatus.java
$inquiryStatus = @"
package com.blueceylon.booking_service.domain.model.enums;

public enum InquiryStatus {
    NEW,
    IN_PROGRESS,
    CLOSED
}
"@
Set-Content -Path (Join-Path $base "enums\InquiryStatus.java") -Value $inquiryStatus -Encoding UTF8

# Currency.java
$currency = @"
package com.blueceylon.booking_service.domain.model.enums;

public enum Currency {
    USD,
    LKR,
    EUR,
    GBP
}
"@
Set-Content -Path (Join-Path $base "enums\Currency.java") -Value $currency -Encoding UTF8

# TargetType.java
$targetType = @"
package com.blueceylon.booking_service.domain.model.enums;

public enum TargetType {
    ROOM,
    HOTEL_TOUR
}
"@
Set-Content -Path (Join-Path $base "enums\TargetType.java") -Value $targetType -Encoding UTF8

# OwnerType.java
$ownerType = @"
package com.blueceylon.booking_service.domain.model.enums;

public enum OwnerType {
    HOTEL,
    TOUR_AGENCY,
    TOUR_GUIDE
}
"@
Set-Content -Path (Join-Path $base "enums\OwnerType.java") -Value $ownerType -Encoding UTF8

# Booking.java
$booking = @"
package com.blueceylon.booking_service.domain.model;

import com.blueceylon.booking_service.domain.model.enums.BookingStatus;
import com.blueceylon.booking_service.domain.model.enums.Currency;
import com.blueceylon.booking_service.domain.model.enums.TargetType;
import jakarta.persistence.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDate;

@Entity
@Table(name = "bookings", indexes = {
        @Index(name = "idx_booking_customer", columnList = "customer_id"),
        @Index(name = "idx_booking_target", columnList = "target_type,target_id")
})
@SQLDelete(sql = "UPDATE bookings SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
public class Booking extends BaseModel {

    @Column(name = "customer_id", nullable = false)
    private String customerId; // User ID from IAM/catalog

    @Enumerated(EnumType.STRING)
    @Column(name = "target_type", nullable = false)
    private TargetType targetType;

    @Column(name = "target_id", nullable = false)
    private String targetId; // Room ID or Hotel TourPackage ID

    @Column(name = "check_in_date")
    private LocalDate checkInDate;

    @Column(name = "check_out_date")
    private LocalDate checkOutDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status = BookingStatus.PENDING_PAYMENT;

    @Column(name = "total_amount", nullable = false)
    private Double totalAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Currency currency = Currency.USD;

    public String getCustomerId() { return customerId; }
    public void setCustomerId(String customerId) { this.customerId = customerId; }
    public TargetType getTargetType() { return targetType; }
    public void setTargetType(TargetType targetType) { this.targetType = targetType; }
    public String getTargetId() { return targetId; }
    public void setTargetId(String targetId) { this.targetId = targetId; }
    public LocalDate getCheckInDate() { return checkInDate; }
    public void setCheckInDate(LocalDate checkInDate) { this.checkInDate = checkInDate; }
    public LocalDate getCheckOutDate() { return checkOutDate; }
    public void setCheckOutDate(LocalDate checkOutDate) { this.checkOutDate = checkOutDate; }
    public BookingStatus getStatus() { return status; }
    public void setStatus(BookingStatus status) { this.status = status; }
    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }
    public Currency getCurrency() { return currency; }
    public void setCurrency(Currency currency) { this.currency = currency; }
}
"@
Set-Content -Path (Join-Path $base "Booking.java") -Value $booking -Encoding UTF8

# Inquiry.java
$inquiry = @"
package com.blueceylon.booking_service.domain.model;

import com.blueceylon.booking_service.domain.model.enums.InquiryStatus;
import com.blueceylon.booking_service.domain.model.enums.OwnerType;
import jakarta.persistence.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDate;

@Entity
@Table(name = "inquiries", indexes = {
        @Index(name = "idx_inquiry_customer", columnList = "customer_id"),
        @Index(name = "idx_inquiry_owner", columnList = "owner_type,owner_id"),
        @Index(name = "idx_inquiry_tour", columnList = "tour_package_id")
})
@SQLDelete(sql = "UPDATE inquiries SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
public class Inquiry extends BaseModel {

    @Column(name = "customer_id", nullable = false)
    private String customerId; // User ID from IAM/catalog

    @Enumerated(EnumType.STRING)
    @Column(name = "owner_type", nullable = false)
    private OwnerType ownerType; // Should be TOUR_AGENCY or TOUR_GUIDE

    @Column(name = "owner_id", nullable = false)
    private String ownerId; // Agency ID or Guide ID

    @Column(name = "tour_package_id", nullable = false)
    private String tourPackageId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InquiryStatus status = InquiryStatus.NEW;

    /** Storing the initial lead message that starts the chat thread. */
    @Column(name = "initial_message", length = 3000)
    private String initialMessage;

    @Column(name = "intended_start_date")
    private LocalDate intendedStartDate;

    @Column(name = "traveler_count")
    private Integer travelerCount;

    public String getCustomerId() { return customerId; }
    public void setCustomerId(String customerId) { this.customerId = customerId; }
    public OwnerType getOwnerType() { return ownerType; }
    public void setOwnerType(OwnerType ownerType) { this.ownerType = ownerType; }
    public String getOwnerId() { return ownerId; }
    public void setOwnerId(String ownerId) { this.ownerId = ownerId; }
    public String getTourPackageId() { return tourPackageId; }
    public void setTourPackageId(String tourPackageId) { this.tourPackageId = tourPackageId; }
    public InquiryStatus getStatus() { return status; }
    public void setStatus(InquiryStatus status) { this.status = status; }
    public String getInitialMessage() { return initialMessage; }
    public void setInitialMessage(String initialMessage) { this.initialMessage = initialMessage; }
    public LocalDate getIntendedStartDate() { return intendedStartDate; }
    public void setIntendedStartDate(LocalDate intendedStartDate) { this.intendedStartDate = intendedStartDate; }
    public Integer getTravelerCount() { return travelerCount; }
    public void setTravelerCount(Integer travelerCount) { this.travelerCount = travelerCount; }
}
"@
Set-Content -Path (Join-Path $base "Inquiry.java") -Value $inquiry -Encoding UTF8

Write-Host "Generated Domain Models."
