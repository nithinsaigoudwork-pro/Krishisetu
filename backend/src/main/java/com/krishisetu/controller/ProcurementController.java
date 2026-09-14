package com.krishisetu.controller;

import com.krishisetu.dto.*;
import com.krishisetu.entity.Booking;
import com.krishisetu.entity.ProcurementRecord;
import com.krishisetu.entity.QualityCheck;
import com.krishisetu.service.QualityAndWeighService;
import com.krishisetu.service.StateMachineService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/procurement")
@RequiredArgsConstructor
public class ProcurementController {

    private final QualityAndWeighService qualityAndWeighService;
    private final StateMachineService stateMachineService;

    @PostMapping("/weigh-gross")
    public ResponseEntity<ApiResponse<ProcurementRecord>> weighGross(
            @Valid @RequestBody WeighRecordRequest.GrossWeigh request) {
        return ResponseEntity.ok(ApiResponse.ok(qualityAndWeighService.recordGrossWeight(request)));
    }

    @PostMapping("/quality-assay")
    public ResponseEntity<ApiResponse<QualityCheck>> qualityAssay(
            @Valid @RequestBody QualityAssayRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(qualityAndWeighService.recordQualityAssay(request)));
    }

    @PostMapping("/weigh-tare")
    public ResponseEntity<ApiResponse<ProcurementRecord>> weighTare(
            @Valid @RequestBody WeighRecordRequest.TareWeigh request) {
        return ResponseEntity.ok(ApiResponse.ok(qualityAndWeighService.recordTareWeightAndFinalize(request)));
    }

    @PostMapping("/advance-stage")
    public ResponseEntity<ApiResponse<Booking>> advanceStage(
            @Valid @RequestBody AdvanceStageRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(stateMachineService.transitionStage(request)));
    }
}
