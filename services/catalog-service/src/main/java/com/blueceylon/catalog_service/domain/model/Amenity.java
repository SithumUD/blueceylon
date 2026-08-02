package com.blueceylon.catalog_service.domain.model;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;


import com.blueceylon.catalog_service.domain.model.enums.AmenityScope;
import jakarta.persistence.*;

@Entity
@Table(name = "amenities")
@SQLDelete(sql = "UPDATE amenities SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
public class Amenity extends BaseModel {

    @Column(nullable = false, unique = true)
    private String code; // e.g. "FREE_WIFI", "SWIMMING_POOL", "AIRPORT_PICKUP"

    @Column(nullable = false)
    private String label; // display label, e.g. "Free Wi-Fi"

    private String iconKey; // maps to a frontend icon component

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AmenityScope scope;

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }
    public String getIconKey() { return iconKey; }
    public void setIconKey(String iconKey) { this.iconKey = iconKey; }
    public AmenityScope getScope() { return scope; }
    public void setScope(AmenityScope scope) { this.scope = scope; }
}

