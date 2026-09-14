package com.krishisetu.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminAnalyticsResponse {

    private Long totalProcurementCenters;
    private Long activeCentersToday;
    private Long totalFarmersRegistered;
    private Long totalBookingsToday;
    private Long totalTractorsServedToday;
    private Long totalTractorsInQueueNow;
    private BigDecimal totalProcuredQuintalsToday;
    private BigDecimal totalDisbursedAmountInrToday;
    private Double avgDistrictWaitTimeMins;
    private Double avgDistrictProcessingTimeMins;

    private List<CenterMetricsSummary> centerSummaries;
    private List<BottleneckAlert> activeBottlenecks;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CenterMetricsSummary {
        private Long centerId;
        private String centerName;
        private String district;
        private Double latitude;
        private Double longitude;
        private Integer activeWeighbridges;
        private Integer tractorsInQueue;
        private Double avgWaitTimeMins;
        private BigDecimal totalProcuredQuintals;
        private String congestionLevel; // LOW, MODERATE, HIGH, CRITICAL
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BottleneckAlert {
        private Long centerId;
        private String centerName;
        private String stageName; // WEIGHBRIDGE, QUALITY_LAB, UNLOADING
        private String severity; // WARNING, CRITICAL
        private String description;
        private Double delayDurationMins;
        private String recommendedAction;
    }
}
