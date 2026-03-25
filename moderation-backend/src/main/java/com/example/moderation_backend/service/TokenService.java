package com.example.moderation_backend.service;

import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class TokenService {

    // Why: Keep token lifetime short enough for safety but long enough for normal app usage.
    @Value("${app.auth.token-expiration-ms:86400000}")
    private long tokenExpirationMs;

    // Why: Secret signs token so clients cannot forge user identity.
    @Value("${app.auth.token-secret:change-me-to-a-long-random-secret}")
    private String tokenSecret;

    public String generateToken(Long userId) {
        long expiresAt = System.currentTimeMillis() + tokenExpirationMs;
        String payload = userId + ":" + expiresAt;
        String payloadBase64 = Base64.getUrlEncoder().withoutPadding()
                .encodeToString(payload.getBytes(StandardCharsets.UTF_8));
        String signatureBase64 = signPayload(payloadBase64);
        return payloadBase64 + "." + signatureBase64;
    }

    public Long validateAndGetUserId(String token) {
        if (token == null || !token.contains(".")) {
            return null;
        }

        String[] parts = token.split("\\.");
        if (parts.length != 2) {
            return null;
        }

        String payloadBase64 = parts[0];
        String signatureBase64 = parts[1];

        String expectedSignature = signPayload(payloadBase64);
        if (!MessageDigest.isEqual(expectedSignature.getBytes(StandardCharsets.UTF_8),
                signatureBase64.getBytes(StandardCharsets.UTF_8))) {
            return null;
        }

        String payload = new String(Base64.getUrlDecoder().decode(payloadBase64), StandardCharsets.UTF_8);
        String[] payloadParts = payload.split(":");
        if (payloadParts.length != 2) {
            return null;
        }

        long userId;
        long expiresAt;
        try {
            userId = Long.parseLong(payloadParts[0]);
            expiresAt = Long.parseLong(payloadParts[1]);
        } catch (NumberFormatException e) {
            return null;
        }

        if (System.currentTimeMillis() > expiresAt) {
            return null;
        }

        return userId;
    }

    private String signPayload(String payloadBase64) {
        try {
            Mac hmac = Mac.getInstance("HmacSHA256");
            hmac.init(new SecretKeySpec(tokenSecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            byte[] signatureBytes = hmac.doFinal(payloadBase64.getBytes(StandardCharsets.UTF_8));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(signatureBytes);
        } catch (NoSuchAlgorithmException | InvalidKeyException e) {
            throw new RuntimeException("Failed to sign auth token", e);
        }
    }
}
