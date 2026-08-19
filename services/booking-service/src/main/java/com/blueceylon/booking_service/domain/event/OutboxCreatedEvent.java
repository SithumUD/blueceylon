package com.blueceylon.booking_service.domain.event;

public class OutboxCreatedEvent {
    private final Long outboxEventId;

    public OutboxCreatedEvent(Long outboxEventId) {
        this.outboxEventId = outboxEventId;
    }

    public Long getOutboxEventId() {
        return outboxEventId;
    }
}
