package com.krishisetu.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

public class WeighRecordRequest {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GrossWeigh {
        @NotNull(message = "Booking ID is required")
        private Long bookingId;

        @NotNull(message = "Gross weight in kg is required")
        @Positive(message = "Gross weight must be positive")
        private BigDecimal grossWeightKg;

        private Integer bagsCount;
        private Long weighbridgeOperatorId;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TareWeigh {
        @NotNull(message = "Booking ID is required")
        private Long bookingId;

        @NotNull(message = "Tare weight in kg is required")
        @PositiveOrZero
        private BigDecimal tareWeightKg;

        private Long weighbridgeOperatorId;
    }
}
