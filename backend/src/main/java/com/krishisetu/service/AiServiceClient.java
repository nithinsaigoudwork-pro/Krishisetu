package com.krishisetu.service;

import com.krishisetu.dto.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;
import java.util.Collections;
import java.util.Map;
import java.util.Objects;

@Service
@Slf4j
public class AiServiceClient {

    private final WebClient webClient;

    public AiServiceClient(@Value("${ai.service.base-url:http://localhost:8000}") String baseUrl) {
        this.webClient = WebClient.builder()
                .baseUrl(Objects.requireNonNull(baseUrl))
                .build();
    }

    public Double predictWaitTime(Long centerId, Integer queueLength, Integer activeWeighbridges, String cropCode) {
        try {
            return webClient.post()
                    .uri("/ai/v1/predict-wait-time")
                    .contentType(Objects.requireNonNull(MediaType.APPLICATION_JSON))
                    .bodyValue(Objects.requireNonNull(Map.<String, Object>of(
                            "center_id", centerId,
                            "queue_length", queueLength,
                            "active_weighbridges", activeWeighbridges,
                            "crop_code", cropCode != null ? cropCode : "PADDY_COMMON"
                    )))
                    .retrieve()
                    .bodyToMono(Map.class)
                    .map(res -> ((Number) res.get("predicted_wait_time_mins")).doubleValue())
                    .timeout(Duration.ofMillis(3000))
                    .block();
        } catch (Exception e) {
            log.warn("FastAPI predictWaitTime unavailable, using internal rule-based model: {}", e.getMessage());
            // Intelligent heuristic fallback: queueLength * (avg 8 mins / activeWeighbridges)
            return Math.max(5.0, (queueLength * 12.0) / Math.max(1, activeWeighbridges));
        }
    }

    public String predictCongestion(Long centerId, Integer currentQueue, Integer maxCapacity) {
        try {
            return webClient.post()
                    .uri("/ai/v1/predict-congestion")
                    .contentType(Objects.requireNonNull(MediaType.APPLICATION_JSON))
                    .bodyValue(Objects.requireNonNull(Map.<String, Object>of(
                            "center_id", centerId,
                            "queue_length", currentQueue,
                            "max_capacity", maxCapacity
                    )))
                    .retrieve()
                    .bodyToMono(Map.class)
                    .map(res -> (String) res.get("congestion_level"))
                    .timeout(Duration.ofMillis(3000))
                    .block();
        } catch (Exception e) {
            log.warn("FastAPI predictCongestion unavailable, using fallback: {}", e.getMessage());
            double ratio = (double) currentQueue / Math.max(1, maxCapacity);
            if (ratio > 0.85) return "CRITICAL";
            if (ratio > 0.60) return "HIGH";
            if (ratio > 0.30) return "MODERATE";
            return "LOW";
        }
    }

    public ChatResponse processMultilingualChat(ChatRequest request) {
        try {
            return webClient.post()
                    .uri("/ai/v1/chat")
                    .contentType(Objects.requireNonNull(MediaType.APPLICATION_JSON))
                    .bodyValue(Objects.requireNonNull(request))
                    .retrieve()
                    .bodyToMono(ChatResponse.class)
                    .timeout(Duration.ofMillis(8000))
                    .block();
        } catch (Exception e) {
            log.warn("FastAPI LLM Chat unavailable, using fallback intent router: {}", e.getMessage());
            return ChatResponse.builder()
                    .replyText("नमस्ते किसान भाई! आपका अनुरोध प्राप्त हो गया है। आप टोकन स्थिति, स्लॉट बुकिंग और भुगतान की जानकारी सीधे ऐप से देख सकते हैं।")
                    .language(request.getLanguage())
                    .toolUsed("FALLBACK_INTENT_PARSER")
                    .suggestedFollowUpQuestions(Collections.singletonList("मेरा टोकन नंबर क्या है?"))
                    .build();
        }
    }
}
