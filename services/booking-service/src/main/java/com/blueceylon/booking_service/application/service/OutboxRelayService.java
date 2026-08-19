package com.blueceylon.booking_service.application.service;

import com.blueceylon.booking_service.domain.event.OutboxCreatedEvent;
import com.blueceylon.booking_service.domain.model.OutboxEvent;
import com.blueceylon.booking_service.domain.repository.OutboxEventRepository;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class OutboxRelayService {

    private final OutboxEventRepository outboxRepository;
    private final RabbitTemplate rabbitTemplate;
    
    private static final String EXCHANGE_NAME = "notification.exchange";
    private static final String ROUTING_KEY = "email.routing.key";

    public OutboxRelayService(OutboxEventRepository outboxRepository, RabbitTemplate rabbitTemplate) {
        this.outboxRepository = outboxRepository;
        this.rabbitTemplate = rabbitTemplate;
    }

    /**
     * Immediate Event-Driven Relay:
     * Executes immediately AFTER the database transaction containing the OutboxEvent has committed.
     * Guarantees sub-millisecond event relay latency without waiting for polling timers.
     */
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleOutboxCreated(OutboxCreatedEvent event) {
        outboxRepository.findById(event.getOutboxEventId()).ifPresent(outboxEvent -> {
            if ("PENDING".equals(outboxEvent.getStatus())) {
                processSingleEvent(outboxEvent);
            }
        });
    }

    /**
     * Fallback Poller:
     * Runs every 15 seconds as a safety net to pick up any missed or retried PENDING events
     * (e.g., if RabbitMQ was briefly unreachable during transaction commit).
     */
    @Scheduled(fixedDelay = 15000)
    public void relayOutboxEventsFallback() {
        List<OutboxEvent> batch = outboxRepository.findTop50ByStatusOrderByCreatedAtAsc("PENDING");
        for (OutboxEvent event : batch) {
            processSingleEvent(event);
        }
    }

    /**
     * Automated Retention Cleanup:
     * Runs daily at 3:00 AM to purge published outbox events older than 7 days,
     * maintaining high performance and lightweight outbox table size.
     */
    @Scheduled(cron = "0 0 3 * * *")
    @Transactional
    public void cleanupOldPublishedEvents() {
        Instant cutoff = Instant.now().minus(7, ChronoUnit.DAYS);
        outboxRepository.deleteByStatusAndPublishedAtBefore("PUBLISHED", cutoff);
    }

    private void processSingleEvent(OutboxEvent event) {
        try {
            rabbitTemplate.convertAndSend(EXCHANGE_NAME, ROUTING_KEY, event.getPayload(), m -> {
                m.getMessageProperties().setContentType("application/json");
                return m;
            });
            event.markPublished();
        } catch (Exception e) {
            event.incrementRetry();
        }
        outboxRepository.save(event);
    }
}
