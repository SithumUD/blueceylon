package com.blueceylon.auth_service.infrastructure.messaging;

import com.blueceylon.auth_service.application.service.RoleManagementService;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class CatalogEventListener {

    private final RoleManagementService roleManagementService;

    public CatalogEventListener(RoleManagementService roleManagementService) {
        this.roleManagementService = roleManagementService;
    }

    @RabbitListener(queues = "auth.business.approval.queue")
    public void handleBusinessApprovedEvent(BusinessApprovedEvent event) {
        // ownerId corresponds to keycloak_sub
        roleManagementService.escalateToBusinessOwner(event.getOwnerId(), event.getBusinessType());
    }
}
