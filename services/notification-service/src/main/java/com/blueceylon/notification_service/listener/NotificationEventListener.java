package com.blueceylon.notification_service.listener;

import com.blueceylon.notification_service.config.RabbitMQConfig;
import com.blueceylon.notification_service.dto.NotificationEvent;
import com.blueceylon.notification_service.service.EmailService;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class NotificationEventListener {

    @Autowired
    private EmailService emailService;

    @RabbitListener(queues = RabbitMQConfig.QUEUE_NAME)
    public void handleNotificationEvent(NotificationEvent event) {
        System.out.println("Received notification event for: " + event.getToEmail());
        emailService.sendTemplatedEmail(event);
    }
}
