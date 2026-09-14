package com.krishisetu.repository;

import com.krishisetu.entity.AiPrediction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AiPredictionRepository extends JpaRepository<AiPrediction, Long> {
    Optional<AiPrediction> findByCenterIdAndForecastDateAndForecastHour(Long centerId, LocalDate forecastDate, Integer forecastHour);
    List<AiPrediction> findByCenterIdAndForecastDateOrderByForecastHourAsc(Long centerId, LocalDate forecastDate);
}
