package com.krishisetu.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
public class QrCodeService {

    @Value("${jwt.secret:404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970}")
    private String hmacSecretKey;

    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Generates a tamper-proof cryptographically signed offline pass
     */
    public String generateOfflineQrPayload(Long bookingId, String bookingRef, Long farmerId, Long centerId, LocalDateTime expiry) {
        try {
            Map<String, Object> payloadMap = new HashMap<>();
            payloadMap.put("bId", bookingId);
            payloadMap.put("ref", bookingRef);
            payloadMap.put("fId", farmerId);
            payloadMap.put("cId", centerId);
            payloadMap.put("exp", expiry.toString());

            String rawJson = objectMapper.writeValueAsString(payloadMap);
            String signature = generateHmacSignature(rawJson);

            payloadMap.put("sig", signature);
            String finalJson = objectMapper.writeValueAsString(payloadMap);
            return Base64.getUrlEncoder().encodeToString(finalJson.getBytes(StandardCharsets.UTF_8));
        } catch (Exception e) {
            log.error("Error generating offline QR payload: {}", e.getMessage());
            return "KS-QR-" + bookingRef;
        }
    }

    /**
     * Verifies offline QR payload authenticity and expiration
     */
    public boolean verifyOfflineQrPayload(String base64Payload) {
        try {
            byte[] decoded = Base64.getUrlDecoder().decode(base64Payload);
            String jsonStr = new String(decoded, StandardCharsets.UTF_8);
            Map<String, Object> map = objectMapper.readValue(jsonStr, new TypeReference<Map<String, Object>>() {});

            String providedSignature = (String) map.get("sig");
            String expiryStr = (String) map.get("exp");

            if (providedSignature == null || expiryStr == null) {
                return false;
            }

            LocalDateTime expiry = LocalDateTime.parse(expiryStr);
            if (LocalDateTime.now().isAfter(expiry)) {
                log.warn("Offline QR pass expired at {}", expiry);
                return false;
            }

            // Reconstruct payload without signature to verify HMAC
            Map<String, Object> rawMap = new HashMap<>(map);
            rawMap.remove("sig");
            String rawJson = objectMapper.writeValueAsString(rawMap);
            String expectedSignature = generateHmacSignature(rawJson);

            return MessageDigest.isEqual(
                    expectedSignature.getBytes(StandardCharsets.UTF_8),
                    providedSignature.getBytes(StandardCharsets.UTF_8)
            );
        } catch (Exception e) {
            log.warn("Failed to parse or verify offline QR: {}", e.getMessage());
            return false;
        }
    }

    public String extractBookingReference(String qrPayloadOrReference) {
        if (!qrPayloadOrReference.contains("{") && !qrPayloadOrReference.contains("ey")) {
            return qrPayloadOrReference;
        }
        try {
            byte[] decoded = Base64.getUrlDecoder().decode(qrPayloadOrReference);
            String jsonStr = new String(decoded, StandardCharsets.UTF_8);
            Map<String, Object> map = objectMapper.readValue(jsonStr, new TypeReference<Map<String, Object>>() {});
            return (String) map.get("ref");
        } catch (Exception e) {
            return qrPayloadOrReference;
        }
    }

    private String generateHmacSignature(String data) throws Exception {
        Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
        SecretKeySpec secret_key = new SecretKeySpec(hmacSecretKey.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        sha256_HMAC.init(secret_key);
        byte[] hmacBytes = sha256_HMAC.doFinal(data.getBytes(StandardCharsets.UTF_8));
        return Base64.getUrlEncoder().encodeToString(hmacBytes);
    }
}
