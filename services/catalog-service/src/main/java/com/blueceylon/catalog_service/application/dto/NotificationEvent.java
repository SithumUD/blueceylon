package com.blueceylon.catalog_service.application.dto;

import java.io.Serializable;
import java.util.Map;

public class NotificationEvent implements Serializable {
    private String toEmail;
    private String subject;
    private String templateName;
    private Map<String, Object> templateVariables;

    public NotificationEvent() {}

    public NotificationEvent(String toEmail, String subject, String templateName, Map<String, Object> templateVariables) {
        this.toEmail = toEmail;
        this.subject = subject;
        this.templateName = templateName;
        this.templateVariables = templateVariables;
    }

    public String getToEmail() { return toEmail; }
    public void setToEmail(String toEmail) { this.toEmail = toEmail; }
    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }
    public String getTemplateName() { return templateName; }
    public void setTemplateName(String templateName) { this.templateName = templateName; }
    public Map<String, Object> getTemplateVariables() { return templateVariables; }
    public void setTemplateVariables(Map<String, Object> templateVariables) { this.templateVariables = templateVariables; }
}
