package com.blueceylon.payment_service.application.service;

import com.blueceylon.payment_service.domain.model.PaymentTransaction;
import com.blueceylon.payment_service.domain.repository.PaymentTransactionRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HashMap;
import java.util.Map;

@Service
public class PaymentService {

    private final PaymentTransactionRepository repository;

    @Value("${payhere.merchant.id:1220000}")
    private String merchantId;

    @Value("${payhere.merchant.secret:secret_key_mock}")
    private String merchantSecret;

    public PaymentService(PaymentTransactionRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public Map<String, Object> initiateCheckout(String userId, String bookingId, Double amount, String currency) {
        PaymentTransaction tx = new PaymentTransaction();
        tx.setBookingId(bookingId);
        tx.setUserId(userId);
        tx.setAmount(amount);
        tx.setCurrency(currency != null ? currency : "LKR");
        tx.setStatus("PENDING");
        PaymentTransaction saved = repository.save(tx);

        String hash = generatePayHereHash(merchantId, saved.getId(), amount, currency != null ? currency : "LKR", merchantSecret);

        Map<String, Object> params = new HashMap<>();
        params.put("merchantId", merchantId);
        params.put("orderId", saved.getId());
        params.put("bookingId", bookingId);
        params.put("amount", amount);
        params.put("currency", currency != null ? currency : "LKR");
        params.put("hash", hash);
        params.put("checkoutUrl", "https://sandbox.payhere.lk/pay/checkout");

        return params;
    }

    @Transactional
    public void processPayHereWebhook(Map<String, String> payload) {
        String orderId = payload.get("order_id");
        String statusCode = payload.get("status_code");
        String paymentId = payload.get("payment_id");

        PaymentTransaction tx = repository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Transaction not found for order: " + orderId));

        if ("2".equals(statusCode)) { // Status 2 in PayHere = SUCCESS
            tx.setStatus("SUCCESS");
            tx.setGatewayReferenceId(paymentId);
        } else {
            tx.setStatus("FAILED");
        }

        repository.save(tx);
    }

    private String generatePayHereHash(String merchantId, String orderId, Double amount, String currency, String secret) {
        try {
            String formattedAmount = String.format("%.2f", amount);
            String md5Secret = getMd5(secret).toUpperCase();
            String raw = merchantId + orderId + formattedAmount + currency + md5Secret;
            return getMd5(raw).toUpperCase();
        } catch (Exception e) {
            return "HASH_ERROR";
        }
    }

    private String getMd5(String input) {
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] messageDigest = md.digest(input.getBytes());
            BigInteger no = new BigInteger(1, messageDigest);
            StringBuilder hashtext = new StringBuilder(no.toString(16));
            while (hashtext.length() < 32) {
                hashtext.insert(0, "0");
            }
            return hashtext.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }
}
