package com.krishisetu.service;

import com.krishisetu.dto.CenterRecommendationRequest;
import com.krishisetu.dto.CenterRecommendationResponse;
import com.krishisetu.entity.Crop;
import com.krishisetu.entity.ProcurementCenter;
import com.krishisetu.entity.enums.TokenStatus;
import com.krishisetu.exception.ResourceNotFoundException;
import com.krishisetu.repository.CropRepository;
import com.krishisetu.repository.ProcurementCenterRepository;
import com.krishisetu.repository.QueueTokenRepository;
import com.krishisetu.repository.SlotRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProcurementCenterService {

    private final ProcurementCenterRepository centerRepository;
    private final CropRepository cropRepository;
    private final QueueTokenRepository queueTokenRepository;
    private final SlotRepository slotRepository;
    private final AiServiceClient aiServiceClient;

    public List<ProcurementCenter> getAllActiveCenters() {
        return centerRepository.findByIsActiveTrue();
    }

    public ProcurementCenter getCenterById(Long id) {
        return centerRepository.findById(Objects.requireNonNull(id))
                .orElseThrow(() -> new ResourceNotFoundException("Procurement center not found with id: " + id));
    }

    public List<ProcurementCenter> getNearbyCenters(Double lat, Double lon) {
        return centerRepository.findNearbyCentersOrderByDistance(lat, lon);
    }

    /**
     * AI-Driven Multi-Objective Total Farmer Time Minimization:
     * Total Time = Travel Time + Predicted Queue Wait + Processing Time
     */
    public CenterRecommendationResponse recommendOptimalCenters(CenterRecommendationRequest req) {
        List<ProcurementCenter> centers = centerRepository.findByIsActiveTrue();
        Crop crop = cropRepository.findById(Objects.requireNonNull(req.getCropId()))
                .orElseThrow(() -> new ResourceNotFoundException("Crop not found with id: " + req.getCropId()));

        LocalDate date = req.getPreferredDate() != null ? req.getPreferredDate() : LocalDate.now();
        List<CenterRecommendationResponse.RecommendedCenterItem> items = new ArrayList<>();

        for (ProcurementCenter center : centers) {
            double distanceKm = calculateHaversineDistance(
                    req.getFarmerLatitude(), req.getFarmerLongitude(),
                    center.getLatitude(), center.getLongitude()
            );

            // Filter out centers outside maxRadius (default 60 km)
            double maxRadius = req.getMaxRadiusKm() != null ? req.getMaxRadiusKm() : 60.0;
            if (distanceKm > maxRadius) continue;

            // Travel time calculation: speed approx 25 km/h for tractor + road factor 1.25
            double travelTimeMins = (distanceKm / 25.0) * 60.0 * 1.25;

            // Live queue at center
            long currentQueue = queueTokenRepository.countByCenterIdAndTokenDateAndTokenStatus(
                    center.getId(), date, TokenStatus.ACTIVE
            );

            // AI Predicted Wait Time
            Double predictedQueueWaitMins = aiServiceClient.predictWaitTime(
                    center.getId(), (int) currentQueue, center.getActiveWeighbridges(), crop.getCropCode()
            );

            // Processing Time = Gate (5 min) + Weighing (8 min) + Quality Assay (10 min) + Unload (Qty / 4) + Doc (5 min)
            double unloadMins = req.getQuantityQuintals().doubleValue() / crop.getStandardUnloadRateQuintalsPerMin().doubleValue();
            double processingMins = 5.0 + crop.getStandardWeighDurationMins() + crop.getStandardAssayDurationMins() + unloadMins + 5.0;

            double totalTimeMins = travelTimeMins + predictedQueueWaitMins + processingMins;

            String congestion = aiServiceClient.predictCongestion(center.getId(), (int) currentQueue, center.getTotalWeighbridges() * 15);

            int openSlots = slotRepository.findAvailableSlotsFromDate(center.getId(), date).size();

            items.add(CenterRecommendationResponse.RecommendedCenterItem.builder()
                    .centerId(center.getId())
                    .centerName(center.getCenterName())
                    .centerCode(center.getCenterCode())
                    .agencyName(center.getAgencyName())
                    .district(center.getDistrict())
                    .distanceKm(Math.round(distanceKm * 10.0) / 10.0)
                    .travelTimeMins(Math.round(travelTimeMins * 10.0) / 10.0)
                    .predictedQueueWaitMins(Math.round(predictedQueueWaitMins * 10.0) / 10.0)
                    .estimatedProcessingMins(Math.round(processingMins * 10.0) / 10.0)
                    .totalEstimatedTimeMins(Math.round(totalTimeMins * 10.0) / 10.0)
                    .congestionLevel(congestion)
                    .isRecommendedBestChoice(false)
                    .activeWeighbridges(center.getActiveWeighbridges())
                    .openSlotsAvailable(openSlots)
                    .build());
        }

        if (items.isEmpty()) {
            return CenterRecommendationResponse.builder()
                    .recommendations(items)
                    .optimizationSummaryEn("No operational centers found in search radius.")
                    .optimizationSummaryHi("खोज दायरे में कोई सक्रिय खरीद केंद्र नहीं मिला।")
                    .build();
        }

        // Find nearest center by pure distance for comparison
        CenterRecommendationResponse.RecommendedCenterItem nearestCenter = items.stream()
                .min(Comparator.comparingDouble(item -> item.getDistanceKm() != null ? item.getDistanceKm() : 0.0))
                .orElse(items.get(0));

        // Sort items by Total Estimated Time (Global Time Minimizer)
        items.sort(Comparator.comparingDouble(item -> item.getTotalEstimatedTimeMins() != null ? item.getTotalEstimatedTimeMins() : 0.0));

        // Best recommended center is item 0
        CenterRecommendationResponse.RecommendedCenterItem best = items.get(0);
        best.setIsRecommendedBestChoice(true);

        double timeSaved = nearestCenter.getTotalEstimatedTimeMins() - best.getTotalEstimatedTimeMins();
        best.setTimeSavedMinsVsNearest(Math.max(0.0, Math.round(timeSaved * 10.0) / 10.0));

        if (best.getCenterId().equals(nearestCenter.getCenterId())) {
            best.setRecommendationReasonEn(String.format("Nearest center (%s km) with optimal queue waiting time.", best.getDistanceKm()));
            best.setRecommendationReasonHi(String.format("सबसे नजदीकी केंद्र (%s किमी) जिसमें प्रतीक्षा समय न्यूनतम है।", best.getDistanceKm()));
        } else {
            best.setRecommendationReasonEn(String.format("Recommended over nearest center '%s' (%s km) because it saves %.0f mins of total waiting and queue time.",
                    nearestCenter.getCenterName(), nearestCenter.getDistanceKm(), timeSaved));
            best.setRecommendationReasonHi(String.format("नजदीकी केंद्र '%s' की तुलना में यह केंद्र चुना गया क्योंकि यह आपके कुल समय में %.0f मिनट की बचत करता है।",
                    nearestCenter.getCenterName(), timeSaved));
        }

        // Fill explanations for other centers
        for (int i = 1; i < items.size(); i++) {
            CenterRecommendationResponse.RecommendedCenterItem itm = items.get(i);
            double extraTime = itm.getTotalEstimatedTimeMins() - best.getTotalEstimatedTimeMins();
            itm.setRecommendationReasonEn(String.format("+%.0f mins additional total time compared to optimal center.", extraTime));
            itm.setRecommendationReasonHi(String.format("सर्वोत्तम केंद्र की तुलना में +%.0f मिनट अतिरिक्त समय।", extraTime));
        }

        String summaryEn = String.format("Best Choice: %s with total estimated time of %.0f mins (Travel: %.0f min, Queue: %.0f min, Proc: %.0f min).",
                best.getCenterName(), best.getTotalEstimatedTimeMins(), best.getTravelTimeMins(), best.getPredictedQueueWaitMins(), best.getEstimatedProcessingMins());

        String summaryHi = String.format("सर्वोत्तम विकल्प: %s (कुल अनुमानित समय: %.0f मिनट, यात्रा: %.0f मिनट, कतार: %.0f मिनट, तुलाई: %.0f मिनट)।",
                best.getCenterName(), best.getTotalEstimatedTimeMins(), best.getTravelTimeMins(), best.getPredictedQueueWaitMins(), best.getEstimatedProcessingMins());

        return CenterRecommendationResponse.builder()
                .recommendations(items)
                .optimizationSummaryEn(summaryEn)
                .optimizationSummaryHi(summaryHi)
                .build();
    }

    private double calculateHaversineDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Earth radius in km
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
}
