package com.krishisetu.controller;

import com.krishisetu.dto.*;
import com.krishisetu.entity.ProcurementCenter;
import com.krishisetu.entity.QueueToken;
import com.krishisetu.service.ProcurementCenterService;
import com.krishisetu.service.QueueService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/api/v1/centers")
@RequiredArgsConstructor
public class CenterController {

    private final ProcurementCenterService centerService;
    private final QueueService queueService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProcurementCenter>>> getAllCenters() {
        return ResponseEntity.ok(ApiResponse.ok(centerService.getAllActiveCenters()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProcurementCenter>> getCenterById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(centerService.getCenterById(Objects.requireNonNull(id))));
    }

    @GetMapping("/nearby")
    public ResponseEntity<ApiResponse<List<ProcurementCenter>>> getNearbyCenters(
            @RequestParam Double lat,
            @RequestParam Double lon) {
        return ResponseEntity.ok(ApiResponse.ok(centerService.getNearbyCenters(lat, lon)));
    }

    /**
     * AI-Driven Multi-Objective Total Farmer Time Minimizer Endpoint
     */
    @PostMapping("/recommend")
    public ResponseEntity<ApiResponse<CenterRecommendationResponse>> recommendCenters(
            @Valid @RequestBody CenterRecommendationRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(centerService.recommendOptimalCenters(request)));
    }

    @GetMapping("/recommend")
    public ResponseEntity<ApiResponse<CenterRecommendationResponse>> recommendCentersGet(
            @RequestParam Double lat,
            @RequestParam Double lon,
            @RequestParam Long cropId,
            @RequestParam Double qty,
            @RequestParam(required = false) Double radius) {
        CenterRecommendationRequest req = CenterRecommendationRequest.builder()
                .farmerLatitude(lat)
                .farmerLongitude(lon)
                .cropId(cropId)
                .quantityQuintals(java.math.BigDecimal.valueOf(qty))
                .maxRadiusKm(radius != null ? radius : 60.0)
                .build();
        return ResponseEntity.ok(ApiResponse.ok(centerService.recommendOptimalCenters(req)));
    }

    @PostMapping("/{id}/gate-checkin")
    public ResponseEntity<ApiResponse<QueueStatusResponse>> gateCheckin(
            @PathVariable Long id,
            @Valid @RequestBody GateCheckinRequest.Checkin request) {
        request.setCenterId(id);
        return ResponseEntity.ok(ApiResponse.ok(queueService.performGateCheckin(request)));
    }

    @PostMapping("/{id}/queue/call-next")
    public ResponseEntity<ApiResponse<QueueStatusResponse>> callNextToken(
            @PathVariable Long id,
            @RequestParam(required = false, defaultValue = "Weighbridge-1") String assignedWeighbridge) {
        return ResponseEntity.ok(ApiResponse.ok(queueService.callNextToken(id, assignedWeighbridge)));
    }

    @GetMapping("/{id}/queue")
    public ResponseEntity<ApiResponse<List<QueueToken>>> getCenterLiveQueue(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(queueService.getActiveCenterQueue(id)));
    }
}
