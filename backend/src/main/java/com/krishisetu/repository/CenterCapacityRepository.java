package com.krishisetu.repository;

import com.krishisetu.entity.CenterCapacity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface CenterCapacityRepository extends JpaRepository<CenterCapacity, Long> {
    Optional<CenterCapacity> findByCenterIdAndRecordedDateAndHourOfDay(Long centerId, LocalDate recordedDate, Integer hourOfDay);
    List<CenterCapacity> findByCenterIdAndRecordedDateOrderByHourOfDayAsc(Long centerId, LocalDate recordedDate);
}
