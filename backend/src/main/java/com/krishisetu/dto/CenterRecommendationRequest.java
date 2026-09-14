package com.krishisetu.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CenterRecommendationRequest {
    @NotNull(message = "Farmer Latitude is required")
    private Double farmerLatitude;

    @NotNull(message = "Farmer Longitude is required")
    private Double farmerLongitude;

    @NotNull(message = "Crop ID is required")
    private Long cropId;

    @NotNull(message = "Estimated quantity is required")
    @Positive(message = "Quantity must be positive")
    private BigDecimal quantityQuintals;

    private LocalDate preferredDate;
    private Double maxRadiusKm;
}
