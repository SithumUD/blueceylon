package com.blueceylon.payment_service.presentation.controller;

import com.blueceylon.payment_service.application.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/payment")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/checkout")
    public ResponseEntity<Map<String, Object>> checkout(
            @AuthenticationPrincipal Jwt jwt,
            @RequestBody Map<String, Object> body) {
        String userId = jwt.getSubject();
        String bookingId = (String) body.get("bookingId");
        Double amount = Double.valueOf(body.get("amount").toString());
        String currency = (String) body.getOrDefault("currency", "LKR");

        return ResponseEntity.ok(paymentService.initiateCheckout(userId, bookingId, amount, currency));
    }

    @PostMapping("/payhere/notify")
    public ResponseEntity<String> payHereWebhook(@RequestParam Map<String, String> payload) {
        paymentService.processPayHereWebhook(payload);
        return ResponseEntity.ok("OK");
    }
}
