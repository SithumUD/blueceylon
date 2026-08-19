package com.blueceylon.notification_service.service;

import com.blueceylon.notification_service.dto.NotificationEvent;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
public class EmailService {

    @Value("${blueceylon.mail.from}")
    private String fromEmail;

    @Autowired
    private JavaMailSender javaMailSender;

    @Autowired
    private TemplateEngine templateEngine;

    public void sendTemplatedEmail(NotificationEvent event) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setTo(event.getToEmail());
            helper.setSubject(event.getSubject());
            helper.setFrom(fromEmail);

            Context context = new Context();
            if (event.getTemplateVariables() != null) {
                context.setVariables(event.getTemplateVariables());
            }

            String htmlContent = templateEngine.process(event.getTemplateName(), context);
            helper.setText(htmlContent, true);

            javaMailSender.send(message);
            System.out.println("Email successfully sent to " + event.getToEmail() + " using template: " + event.getTemplateName());
        } catch (Exception e) {
            System.err.println("Failed to send email to " + event.getToEmail() + ": " + e.getMessage());
            e.printStackTrace();
        }
    }
}

