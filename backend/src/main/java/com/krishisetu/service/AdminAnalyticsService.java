package com.krishisetu.service;

import com.krishisetu.dto.AdminAnalyticsResponse;
import com.krishisetu.entity.ProcurementCenter;
import com.krishisetu.entity.enums.TokenStatus;
import com.krishisetu.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminAnalyticsService {

    private final ProcurementCenterRepository centerRepository;
    private final FarmerRepository farmerRepository;
    private final BookingRepository bookingRepository;
    private final QueueTokenRepository queueTokenRepository;
    private final AiServiceClient aiServiceClient;

    public AdminAnalyticsResponse getDistrictAnalyticsOverview(String district) {
        List<ProcurementCenter> centers = district != null ?
                centerRepository.findByDistrictAndIsActiveTrue(district) :
                centerRepository.findByIsActiveTrue();

        LocalDate today = LocalDate.now();
        long totalFarmers = farmerRepository.count();

        long totalBookingsToday = 0;
        long totalTokensActive = 0;
        long totalTokensServed = 0;
        BigDecimal totalProcuredQuintals = BigDecimal.ZERO;
        BigDecimal totalDisbursed = BigDecimal.ZERO;

        List<AdminAnalyticsResponse.CenterMetricsSummary> centerSummaries = new ArrayList<>();
        List<AdminAnalyticsResponse.BottleneckAlert> alerts = new ArrayList<>();

        for (ProcurementCenter center : centers) {
            long bookingsToday = bookingRepository.countByCenterIdAndScheduledDate(center.getId(), today);
            totalBookingsToday += bookingsToday;

            long activeTokens = queueTokenRepository.countByCenterIdAndTokenDateAndTokenStatus(
                    center.getId(), today, TokenStatus.ACTIVE
            );
            totalTokensActive += activeTokens;

            long servedTokens = queueTokenRepository.countByCenterIdAndTokenDateAndTokenStatus(
                    center.getId(), today, TokenStatus.SERVED
            );
            totalTokensServed += servedTokens;

            Double waitTime = aiServiceClient.predictWaitTime(
                    center.getId(), (int) activeTokens, center.getActiveWeighbridges(), "PADDY_COMMON"
            );
            String congestion = aiServiceClient.predictCongestion(
                    center.getId(), (int) activeTokens, center.getTotalWeighbridges() * 15
            );

            centerSummaries.add(AdminAnalyticsResponse.CenterMetricsSummary.builder()
                    .centerId(center.getId())
                    .centerName(center.getCenterName())
                    .district(center.getDistrict())
                    .latitude(center.getLatitude())
                    .longitude(center.getLongitude())
                    .activeWeighbridges(center.getActiveWeighbridges())
                    .tractorsInQueue((int) activeTokens)
                    .avgWaitTimeMins(Math.round(waitTime * 10.0) / 10.0)
                    .totalProcuredQuintals(BigDecimal.valueOf(servedTokens * 65.0))
                    .congestionLevel(congestion)
                    .build());

            // Check for bottleneck anomalies
            if (activeTokens > 15 && center.getActiveWeighbridges() < center.getTotalWeighbridges()) {
                alerts.add(AdminAnalyticsResponse.BottleneckAlert.builder()
                        .centerId(center.getId())
                        .centerName(center.getCenterName())
                        .stageName("WEIGHBRIDGE")
                        .severity("CRITICAL")
                        .description("Weighbridge #2 is offline while queue has " + activeTokens + " waiting tractors.")
                        .delayDurationMins(waitTime)
                        .recommendedAction("Dispatch technician immediately or redirect incoming slots to neighboring sub-center.")
                        .build());
            } else if (activeTokens > 20) {
                alerts.add(AdminAnalyticsResponse.BottleneckAlert.builder()
                        .centerId(center.getId())
                        .centerName(center.getCenterName())
                        .stageName("GENERAL_CONGESTION")
                        .severity("WARNING")
                        .description("High queue volume (" + activeTokens + " tractors). Average wait: " + Math.round(waitTime) + " mins.")
                        .delayDurationMins(waitTime)
                        .recommendedAction("Trigger adaptive slot rescheduling for afternoon arrivals.")
                        .build());
            }
        }

        totalProcuredQuintals = BigDecimal.valueOf(totalTokensServed * 65.0);
        totalDisbursed = totalProcuredQuintals.multiply(BigDecimal.valueOf(2300)); // approx MSP rate

        double avgWait = centerSummaries.isEmpty() ? 0 : centerSummaries.stream()
                .mapToDouble(s -> s.getAvgWaitTimeMins() != null ? s.getAvgWaitTimeMins() : 0.0)
                .average().orElse(0.0);

        return AdminAnalyticsResponse.builder()
                .totalProcurementCenters((long) centers.size())
                .activeCentersToday((long) centers.size())
                .totalFarmersRegistered(totalFarmers)
                .totalBookingsToday(totalBookingsToday)
                .totalTractorsServedToday(totalTokensServed)
                .totalTractorsInQueueNow(totalTokensActive)
                .totalProcuredQuintalsToday(totalProcuredQuintals)
                .totalDisbursedAmountInrToday(totalDisbursed)
                .avgDistrictWaitTimeMins(Math.round(avgWait * 10.0) / 10.0)
                .avgDistrictProcessingTimeMins(32.5)
                .centerSummaries(centerSummaries)
                .activeBottlenecks(alerts)
                .build();
    }
}
