package com.krishisetu.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CenterRecommendationResponse {

    private List<RecommendedCenterItem> recommendations;
    private String optimizationSummaryEn;
    private String optimizationSummaryHi;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RecommendedCenterItem {
        private Long centerId;
        private String centerName;
        private String centerCode;
        private String agencyName;
        private String district;
        private Double distanceKm;
        private Double travelTimeMins;
        private Double predictedQueueWaitMins;
        private Double estimatedProcessingMins;
        private Double totalEstimatedTimeMins;
        private String congestionLevel; // LOW, MODERATE, HIGH, CRITICAL
        private Boolean isRecommendedBestChoice;
        private Double timeSavedMinsVsNearest;
        private String recommendationReasonEn;
        private String recommendationReasonHi;
        private Integer activeWeighbridges;
        private Integer openSlotsAvailable;
    }
}
