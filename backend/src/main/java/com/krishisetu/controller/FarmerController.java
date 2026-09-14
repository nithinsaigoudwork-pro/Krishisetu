package com.krishisetu.controller;

import com.krishisetu.dto.ApiResponse;
import com.krishisetu.dto.BookingResponse;
import com.krishisetu.dto.QueueStatusResponse;
import com.krishisetu.entity.Farmer;
import com.krishisetu.entity.FarmerCrop;
import com.krishisetu.service.BookingService;
import com.krishisetu.service.FarmerService;
import com.krishisetu.service.QueueService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/farmers")
@RequiredArgsConstructor
public class FarmerController {

    private final FarmerService farmerService;
    private final BookingService bookingService;
    private final QueueService queueService;

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Farmer>> getFarmerProfile(@PathVariable @NonNull Long id) {
        return ResponseEntity.ok(ApiResponse.ok(farmerService.getFarmerById(id)));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<Farmer>> getFarmerByUserId(@PathVariable @NonNull Long userId) {
        return ResponseEntity.ok(ApiResponse.ok(farmerService.getFarmerByUserId(userId)));
    }

    @PostMapping("/{id}/produce")
    public ResponseEntity<ApiResponse<FarmerCrop>> registerProduce(
            @PathVariable @NonNull Long id,
            @RequestParam @NonNull Long cropId,
            @RequestParam BigDecimal acres,
            @RequestParam BigDecimal estimatedYield,
            @RequestParam(defaultValue = "2025-26") String seasonYear) {
        FarmerCrop crop = farmerService.registerFarmerProduce(id, cropId, acres, estimatedYield, seasonYear);
        return ResponseEntity.ok(ApiResponse.ok(crop));
    }

    @GetMapping("/{id}/produce")
    public ResponseEntity<ApiResponse<List<FarmerCrop>>> getFarmerProduce(@PathVariable @NonNull Long id) {
        return ResponseEntity.ok(ApiResponse.ok(farmerService.getFarmerProduce(id)));
    }

    @GetMapping("/{id}/bookings")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getFarmerBookings(@PathVariable @NonNull Long id) {
        return ResponseEntity.ok(ApiResponse.ok(bookingService.getFarmerBookings(id)));
    }

    @GetMapping("/{id}/queue-status")
    public ResponseEntity<ApiResponse<QueueStatusResponse>> getFarmerQueueStatus(@PathVariable @NonNull Long id) {
        return ResponseEntity.ok(ApiResponse.ok(queueService.getFarmerQueueStatus(id)));
    }
}
