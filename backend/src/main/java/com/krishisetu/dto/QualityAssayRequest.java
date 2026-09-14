package com.krishisetu.dto;

import com.krishisetu.entity.enums.QualityGrade;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QualityAssayRequest {
    @NotNull(message = "Booking ID is required")
    private Long bookingId;

    private String sampleBarcode;

    @NotNull(message = "Moisture percentage is required")
    @PositiveOrZero
    private BigDecimal moisturePercentage;

    @NotNull(message = "Foreign matter percentage is required")
    @PositiveOrZero
    private BigDecimal foreignMatterPercentage;

    private BigDecimal brokenGrainsPercentage;
    private BigDecimal immatureShriveledPercentage;

    private QualityGrade qualityGrade;
    private Boolean isApproved;
    private String rejectionReason;
    private Long assayedByOfficerId;
}
