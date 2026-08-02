$baseDir = "c:\Users\sithu\Videos\blue-ceylon\services\catalog-service\src\main\java\com\blueceylon\catalog_service\domain"

# Create enums directory
$enumsDir = Join-Path $baseDir "model\enums"
if (-not (Test-Path $enumsDir)) { New-Item -ItemType Directory -Force -Path $enumsDir }

# 1. BaseModel
$baseModelContent = @"
package com.blueceylon.catalog_service.domain.model;

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

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
"@
Set-Content -Path (Join-Path $baseDir "model\BaseModel.java") -Value $baseModelContent

# 2. User
$userContent = @"
package com.blueceylon.catalog_service.domain.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class User extends BaseModel {
    private String keycloakUserId;
    private String email;
    private String firstName;
    private String lastName;

    public String getKeycloakUserId() { return keycloakUserId; }
    public void setKeycloakUserId(String keycloakUserId) { this.keycloakUserId = keycloakUserId; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
}
"@
Set-Content -Path (Join-Path $baseDir "model\User.java") -Value $userContent

# 3. OwnerType Enum
$ownerTypeContent = @"
package com.blueceylon.catalog_service.domain.model.enums;

public enum OwnerType {
    HOTEL,
    TOUR_AGENCY,
    TOUR_GUIDE
}
"@
Set-Content -Path (Join-Path $enumsDir "OwnerType.java") -Value $ownerTypeContent

# 4. BusinessType Enum
$businessTypeContent = @"
package com.blueceylon.catalog_service.domain.model.enums;

public enum BusinessType {
    HOTEL,
    TOUR_AGENCY
}
"@
Set-Content -Path (Join-Path $enumsDir "BusinessType.java") -Value $businessTypeContent

# 5. Business
$businessContent = @"
package com.blueceylon.catalog_service.domain.model;

import com.blueceylon.catalog_service.domain.model.enums.BusinessType;
import jakarta.persistence.*;

@Entity
@Table(name = "businesses")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "business_type", discriminatorType = DiscriminatorType.STRING)
public abstract class Business extends BaseModel {

    private String name;
    private String description;
    private String contactInfo;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "business_type", insertable = false, updatable = false)
    private BusinessType type;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getContactInfo() { return contactInfo; }
    public void setContactInfo(String contactInfo) { this.contactInfo = contactInfo; }
    public BusinessType getType() { return type; }
    public void setType(BusinessType type) { this.type = type; }
}
"@
Set-Content -Path (Join-Path $baseDir "model\Business.java") -Value $businessContent

# 6. Hotel
$hotelContent = @"
package com.blueceylon.catalog_service.domain.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import java.util.ArrayList;
import java.util.List;

@Entity
@DiscriminatorValue("HOTEL")
public class Hotel extends Business {
    
    private String starRating;

    @OneToMany(mappedBy = "hotel", cascade = jakarta.persistence.CascadeType.ALL)
    private List<Room> rooms = new ArrayList<>();

    public String getStarRating() { return starRating; }
    public void setStarRating(String starRating) { this.starRating = starRating; }
    public List<Room> getRooms() { return rooms; }
    public void setRooms(List<Room> rooms) { this.rooms = rooms; }
}
"@
Set-Content -Path (Join-Path $baseDir "model\Hotel.java") -Value $hotelContent

# 7. TourAgency
$tourAgencyContent = @"
package com.blueceylon.catalog_service.domain.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("TOUR_AGENCY")
public class TourAgency extends Business {
    
    private String licenseNumber;

    public String getLicenseNumber() { return licenseNumber; }
    public void setLicenseNumber(String licenseNumber) { this.licenseNumber = licenseNumber; }
}
"@
Set-Content -Path (Join-Path $baseDir "model\TourAgency.java") -Value $tourAgencyContent

# 8. TourGuideProfile
$tourGuideContent = @"
package com.blueceylon.catalog_service.domain.model;

import jakarta.persistence.*;

@Entity
@Table(name = "tour_guide_profiles")
public class TourGuideProfile extends BaseModel {

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String bio;
    private String languagesSpoken;

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    public String getLanguagesSpoken() { return languagesSpoken; }
    public void setLanguagesSpoken(String languagesSpoken) { this.languagesSpoken = languagesSpoken; }
}
"@
Set-Content -Path (Join-Path $baseDir "model\TourGuideProfile.java") -Value $tourGuideContent

# 9. Room
$roomContent = @"
package com.blueceylon.catalog_service.domain.model;

import jakarta.persistence.*;

@Entity
@Table(name = "rooms")
public class Room extends BaseModel {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hotel_id")
    private Hotel hotel;

    private String roomType;
    private Double pricePerNight;
    private Integer capacity;

    public Hotel getHotel() { return hotel; }
    public void setHotel(Hotel hotel) { this.hotel = hotel; }
    public String getRoomType() { return roomType; }
    public void setRoomType(String roomType) { this.roomType = roomType; }
    public Double getPricePerNight() { return pricePerNight; }
    public void setPricePerNight(Double pricePerNight) { this.pricePerNight = pricePerNight; }
    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }
}
"@
Set-Content -Path (Join-Path $baseDir "model\Room.java") -Value $roomContent

# 10. TourPackage
$tourPackageContent = @"
package com.blueceylon.catalog_service.domain.model;

import com.blueceylon.catalog_service.domain.model.enums.OwnerType;
import jakarta.persistence.*;

@Entity
@Table(name = "tour_packages")
public class TourPackage extends BaseModel {

    private String title;
    private String description;
    private Double price;
    private Integer durationDays;

    @Column(name = "owner_id")
    private String ownerId;

    @Enumerated(EnumType.STRING)
    @Column(name = "owner_type")
    private OwnerType ownerType;

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
    public Integer getDurationDays() { return durationDays; }
    public void setDurationDays(Integer durationDays) { this.durationDays = durationDays; }
    public String getOwnerId() { return ownerId; }
    public void setOwnerId(String ownerId) { this.ownerId = ownerId; }
    public OwnerType getOwnerType() { return ownerType; }
    public void setOwnerType(OwnerType ownerType) { this.ownerType = ownerType; }
}
"@
Set-Content -Path (Join-Path $baseDir "model\TourPackage.java") -Value $tourPackageContent

Write-Host "Domain models generated successfully."
