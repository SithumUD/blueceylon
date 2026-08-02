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
