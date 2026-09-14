package com.krishisetu.controller;

import com.krishisetu.dto.ApiResponse;
import com.krishisetu.dto.ChatRequest;
import com.krishisetu.dto.ChatResponse;
import com.krishisetu.dto.QueueStatusResponse;
import com.krishisetu.entity.Booking;
import com.krishisetu.entity.Payment;
import com.krishisetu.repository.BookingRepository;
import com.krishisetu.repository.PaymentRepository;
import com.krishisetu.service.AiServiceClient;
import com.krishisetu.service.QueueService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/ai")
@RequiredArgsConstructor
public class AiIntegrationController {

    private final AiServiceClient aiServiceClient;
    private final QueueService queueService;
    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;

    @PostMapping("/chat")
    public ResponseEntity<ApiResponse<ChatResponse>> handleFarmerChat(@Valid @RequestBody ChatRequest request) {
        ChatResponse response = aiServiceClient.processMultilingualChat(request);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    /**
     * Tool-Calling Gateway Endpoint for AI Assistant (Zero-Hallucination Safe Execution)
     */
    @GetMapping("/tools/farmer-status/{farmerId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getFarmerCompleteStatus(@PathVariable Long farmerId) {
        Map<String, Object> data = new HashMap<>();

        // 1. Queue Status
        try {
            QueueStatusResponse queue = queueService.getFarmerQueueStatus(farmerId);
            data.put("queueStatus", queue);
        } catch (Exception e) {
            data.put("queueStatus", null);
        }

        // 2. Active Bookings
        List<Booking> activeBookings = bookingRepository.findActiveBookingsByFarmer(farmerId);
        data.put("activeBookingsCount", activeBookings.size());
        if (!activeBookings.isEmpty()) {
            Booking latest = activeBookings.get(0);
            data.put("currentStage", latest.getStatus().name());
            data.put("bookingRef", latest.getBookingReference());
            data.put("centerName", latest.getCenter().getCenterName());
            data.put("cropName", latest.getCrop().getCropNameEn());
            data.put("quantityQuintals", latest.getEstimatedQuantityQuintals());
        }

        // 3. Payments
        List<Payment> payments = paymentRepository.findByFarmerIdOrderByInitiatedAtDesc(farmerId);
        if (!payments.isEmpty()) {
            Payment p = payments.get(0);
            data.put("latestPaymentStatus", p.getPaymentStatus().name());
            data.put("latestPaymentAmount", p.getNetPayableAmount());
            data.put("bankUtr", p.getBankUtrNumber());
        }

        return ResponseEntity.ok(ApiResponse.ok(data));
    }
}
