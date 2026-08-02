package com.blueceylon.catalog_service.domain.model;
import jakarta.persistence.*;

@Entity
@Table(name = "faq_entries", indexes = {@Index(columnList = "business_id")})
public class FaqEntry extends BaseModel {
    @Column(length = 1000)
    private String question;
    
    @Column(length = 2000)
    private String answer;
    
    @Column(name = "business_id")
    private String businessId;

    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }
    public String getAnswer() { return answer; }
    public void setAnswer(String answer) { this.answer = answer; }
    public String getBusinessId() { return businessId; }
    public void setBusinessId(String businessId) { this.businessId = businessId; }
}
