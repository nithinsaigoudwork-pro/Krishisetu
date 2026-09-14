package com.krishisetu.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

public class BookingRequest {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Create {
        @NotNull(message = "Farmer ID is required")
        private Long farmerId;

        @NotNull(message = "Center ID is required")
        private Long centerId;

        @NotNull(message = "Crop ID is required")
        private Long cropId;

        private Long slotId; // Optional; if null, best dynamic slot will be assigned

        @NotNull(message = "Scheduled date is required")
        private LocalDate scheduledDate;

        @NotNull(message = "Estimated quantity is required")
        @Positive(message = "Quantity must be greater than 0")
        private BigDecimal estimatedQuantityQuintals;

        private String vehicleType;
        private String vehicleNumber;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Reschedule {
        @NotNull(message = "New scheduled date is required")
        private LocalDate newScheduledDate;

        private Long newSlotId;
        private Long newCenterId;
        private String reason;
    }
}
