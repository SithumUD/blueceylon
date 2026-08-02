package com.blueceylon.catalog_service.domain.model.embeddable;
import com.blueceylon.catalog_service.domain.model.enums.MealPlan;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import java.util.List;
@Embeddable
public class DiningOption {
    private String name;
    private String cuisineType;
    private String mealsServed; // Comma separated MealPlan values to avoid JPA nested ElementCollection error
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getCuisineType() { return cuisineType; }
    public void setCuisineType(String cuisineType) { this.cuisineType = cuisineType; }
    public String getMealsServed() { return mealsServed; }
    public void setMealsServed(String mealsServed) { this.mealsServed = mealsServed; }
}
