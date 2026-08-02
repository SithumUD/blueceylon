package com.blueceylon.catalog_service.domain.model;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;


import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "guide_blackout_dates", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"guide_id", "blocked_date"})
})
@SQLDelete(sql = "UPDATE guide_blackout_dates SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
public class GuideBlackoutDate extends BaseModel {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "guide_id", nullable = false)
    private TourGuideProfile guide;

    @Column(name = "blocked_date", nullable = false)
    private LocalDate blockedDate;

    /** e.g. "Booked â€” Sigiriya day tour" or "Personal leave". Optional context for the owner's own calendar view. */
    private String reason;

    /** Set by the Booking Service via an event when a booking is confirmed against this guide/date, vs. manually blocked by the guide. */
    @Column(name = "auto_blocked_by_booking")
    private Boolean autoBlockedByBooking = false;

    public TourGuideProfile getGuide() { return guide; }
    public void setGuide(TourGuideProfile guide) { this.guide = guide; }
    public LocalDate getBlockedDate() { return blockedDate; }
    public void setBlockedDate(LocalDate blockedDate) { this.blockedDate = blockedDate; }
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
    public Boolean getAutoBlockedByBooking() { return autoBlockedByBooking; }
    public void setAutoBlockedByBooking(Boolean autoBlockedByBooking) { this.autoBlockedByBooking = autoBlockedByBooking; }
}

