package com.blueceylon.catalog_service.domain.model;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import com.blueceylon.catalog_service.domain.model.enums.Currency;
import com.blueceylon.catalog_service.domain.model.enums.RoomType;
import com.blueceylon.catalog_service.domain.model.enums.SriLankanCity;
import jakarta.persistence.*;


import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "rooms", indexes = {
        // Composite index backing the primary catalog search hot path (§4.3/§18):
        // WHERE city = ? AND available_from <= ? AND available_to >= ? ORDER BY price_per_night
        @Index(name = "idx_room_search", columnList = "city,available_from,available_to,price_per_night")
})
@SQLDelete(sql = "UPDATE rooms SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
public class Room extends BaseModel {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hotel_id", nullable = false)
    private Hotel hotel;

    @Column(name = "room_number")
    private String roomNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "room_type", nullable = false)
    private RoomType roomType;

    /**
     * Denormalized from the parent Hotel purely so the search composite
     * index above doesn't require a join against `businesses` on the
     * hottest read path in the system. Kept in sync via a @PrePersist/
     * service-layer copy whenever the Hotel's city changes (should be rare
     * — a hotel doesn't typically relocate).
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SriLankanCity city;

    @Column(name = "price_per_night", nullable = false)
    private Double pricePerNight;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Currency currency = Currency.LKR;

    private Integer capacity;
    private Integer bedCount;
    private Double sizeSquareMeters;

    @Column(name = "available_from")
    private LocalDate availableFrom;

    @Column(name = "available_to")
    private LocalDate availableTo;

    /** Total physical units of this room configuration the hotel has (for overbooking math). */
    @Column(name = "total_units")
    private Integer totalUnits = 1;

    /**
     * Optimistic-locking version column. The dossier's concurrency story
     * (§4.4/§11) is enacted in the Booking Service against its own
     * `bookings` row, but Catalog Service also needs to defend `totalUnits`
     * decrements/increments against lost updates when two admin actions
     * (e.g., owner edits capacity while a booking event adjusts it) race.
     */
    @Version
    private Long version;

    @ElementCollection
    @CollectionTable(name = "room_image_urls", joinColumns = @JoinColumn(name = "room_id"))
    @Column(name = "image_url")
    private List<String> imageUrls = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "room_amenities",
            joinColumns = @JoinColumn(name = "room_id"),
            inverseJoinColumns = @JoinColumn(name = "amenity_id")
    )
    private List<Amenity> amenities = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    private com.blueceylon.catalog_service.domain.model.enums.ViewType viewType;

    private String bedConfiguration;
    private Boolean smokingAllowed;
    private Boolean isHourlyBookable = false;

    public Hotel getHotel() { return hotel; }
    public void setHotel(Hotel hotel) { this.hotel = hotel; }
    public String getRoomNumber() { return roomNumber; }
    public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }
    public RoomType getRoomType() { return roomType; }
    public void setRoomType(RoomType roomType) { this.roomType = roomType; }
    public SriLankanCity getCity() { return city; }
    public void setCity(SriLankanCity city) { this.city = city; }
    public Double getPricePerNight() { return pricePerNight; }
    public void setPricePerNight(Double pricePerNight) { this.pricePerNight = pricePerNight; }
    public Currency getCurrency() { return currency; }
    public void setCurrency(Currency currency) { this.currency = currency; }
    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }
    public Integer getBedCount() { return bedCount; }
    public void setBedCount(Integer bedCount) { this.bedCount = bedCount; }
    public Double getSizeSquareMeters() { return sizeSquareMeters; }
    public void setSizeSquareMeters(Double sizeSquareMeters) { this.sizeSquareMeters = sizeSquareMeters; }
    public LocalDate getAvailableFrom() { return availableFrom; }
    public void setAvailableFrom(LocalDate availableFrom) { this.availableFrom = availableFrom; }
    public LocalDate getAvailableTo() { return availableTo; }
    public void setAvailableTo(LocalDate availableTo) { this.availableTo = availableTo; }
    public Integer getTotalUnits() { return totalUnits; }
    public void setTotalUnits(Integer totalUnits) { this.totalUnits = totalUnits; }
    public Long getVersion() { return version; }
    public void setVersion(Long version) { this.version = version; }
    public List<String> getImageUrls() { return imageUrls; }
    public void setImageUrls(List<String> imageUrls) { this.imageUrls = imageUrls; }
    public List<Amenity> getAmenities() { return amenities; }
    public void setAmenities(List<Amenity> amenities) { this.amenities = amenities; }
    public com.blueceylon.catalog_service.domain.model.enums.ViewType getViewType() { return viewType; }
    public void setViewType(com.blueceylon.catalog_service.domain.model.enums.ViewType viewType) { this.viewType = viewType; }
    public String getBedConfiguration() { return bedConfiguration; }
    public void setBedConfiguration(String bedConfiguration) { this.bedConfiguration = bedConfiguration; }
    public Boolean getSmokingAllowed() { return smokingAllowed; }
    public void setSmokingAllowed(Boolean smokingAllowed) { this.smokingAllowed = smokingAllowed; }
    public Boolean getIsHourlyBookable() { return isHourlyBookable; }
    public void setIsHourlyBookable(Boolean isHourlyBookable) { this.isHourlyBookable = isHourlyBookable; }
}
