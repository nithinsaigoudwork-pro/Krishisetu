package com.krishisetu.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

public class GateCheckinRequest {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Checkin {
        @NotBlank(message = "QR Payload or Booking Reference is required")
        private String qrPayloadOrReference;

        private Long centerId;
        private Long scannedByOfficerId;
        private String remarks;
    }
}
