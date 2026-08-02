package com.blueceylon.catalog_service.domain.model;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;


import com.blueceylon.catalog_service.domain.model.enums.Locale;
import jakarta.persistence.*;

@Entity
@Table(name = "tour_package_translations", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"tour_id", "locale"})
})
@SQLDelete(sql = "UPDATE tour_package_translations SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
public class TourPackageTranslation extends BaseModel {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tour_id", nullable = false)
    private TourPackage tourPackage;


    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Locale locale;

    private String title;

    @Column(length = 3000)
    private String description;

    public TourPackage getTourPackage() { return tourPackage; }

    public void setTourPackage(TourPackage tourPackage) { this.tourPackage = tourPackage; }

    public Locale getLocale() { return locale; }
    public void setLocale(Locale locale) { this.locale = locale; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}

