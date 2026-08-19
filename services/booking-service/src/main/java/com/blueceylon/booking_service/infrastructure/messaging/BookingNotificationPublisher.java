package com.blueceylon.booking_service.infrastructure.messaging;

import com.blueceylon.booking_service.domain.event.OutboxCreatedEvent;
import com.blueceylon.booking_service.domain.model.Booking;
import com.blueceylon.booking_service.domain.model.OutboxEvent;
import com.blueceylon.booking_service.domain.repository.OutboxEventRepository;
import com.blueceylon.booking_service.infrastructure.messaging.dto.NotificationEvent;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class BookingNotificationPublisher {

    private final OutboxEventRepository outboxRepository;
    private final ObjectMapper objectMapper;
    private final ApplicationEventPublisher eventPublisher;

    public BookingNotificationPublisher(OutboxEventRepository outboxRepository,
                                        ObjectMapper objectMapper,
                                        ApplicationEventPublisher eventPublisher) {
        this.outboxRepository = outboxRepository;
        this.objectMapper = objectMapper;
        this.eventPublisher = eventPublisher;
    }

    public void publishBookingConfirmedEvent(Booking booking, String customerEmail, String businessEmail) {
        // Notify Customer
        Map<String, Object> customerVars = new HashMap<>();
        customerVars.put("bookingId", booking.getId());
        customerVars.put("itemType", booking.getItemType().name());
        customerVars.put("amount", booking.getTotalAmount());
        
        NotificationEvent customerEvent = new NotificationEvent(
                customerEmail,
                "Booking Confirmed - Blue Ceylon",
                "booking_confirmed_customer",
                customerVars
        );
        saveOutboxEvent(booking.getId(), "BOOKING_CONFIRMED_CUSTOMER", customerEvent);

        // Notify Business
        Map<String, Object> businessVars = new HashMap<>();
        businessVars.put("bookingId", booking.getId());
        businessVars.put("itemType", booking.getItemType().name());
        businessVars.put("quantity", booking.getQuantity());
        
        NotificationEvent businessEvent = new NotificationEvent(
                businessEmail,
                "New Booking Received - Blue Ceylon",
                "booking_received_business",
                businessVars
        );
        saveOutboxEvent(booking.getId(), "BOOKING_RECEIVED_BUSINESS", businessEvent);
    }
    
    private void saveOutboxEvent(String bookingId, String eventType, NotificationEvent payload) {
        try {
            OutboxEvent outboxEvent = new OutboxEvent();
            outboxEvent.setAggregateType("BOOKING");
            outboxEvent.setAggregateId(bookingId != null ? bookingId : "UNKNOWN");
            outboxEvent.setEventType(eventType);
            outboxEvent.setPayload(objectMapper.writeValueAsString(payload));
            OutboxEvent saved = outboxRepository.save(outboxEvent);
            
            eventPublisher.publishEvent(new OutboxCreatedEvent(saved.getId()));
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to serialize notification payload", e);
        }
    }
}
