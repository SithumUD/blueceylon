package com.blueceylon.catalog_service.domain.model.embeddable;
import jakarta.persistence.Embeddable;
@Embeddable
public class ChildPolicy {
    private Integer freeStayAgeLimit;
    private Double extraBedFee;
    public Integer getFreeStayAgeLimit() { return freeStayAgeLimit; }
    public void setFreeStayAgeLimit(Integer freeStayAgeLimit) { this.freeStayAgeLimit = freeStayAgeLimit; }
    public Double getExtraBedFee() { return extraBedFee; }
    public void setExtraBedFee(Double extraBedFee) { this.extraBedFee = extraBedFee; }
}
