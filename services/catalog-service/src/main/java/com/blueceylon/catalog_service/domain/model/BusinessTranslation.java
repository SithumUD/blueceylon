package com.blueceylon.catalog_service.domain.model;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;


import com.blueceylon.catalog_service.domain.model.enums.Locale;
import jakarta.persistence.*;

@Entity
@Table(name = "business_translations", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"business_id", "locale"})
})
@SQLDelete(sql = "UPDATE business_translations SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
public class BusinessTranslation extends BaseModel {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "business_id", nullable = false)
    private Business business;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Locale locale;

    private String name;

    @Column(length = 2000)
    private String description;

    public Business getBusiness() { return business; }
    public void setBusiness(Business business) { this.business = business; }
    public Locale getLocale() { return locale; }
    public void setLocale(Locale locale) { this.locale = locale; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}

