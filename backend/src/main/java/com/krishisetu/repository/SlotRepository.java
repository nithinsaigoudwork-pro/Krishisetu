package com.krishisetu.repository;

import com.krishisetu.entity.Slot;
import com.krishisetu.entity.enums.SlotStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface SlotRepository extends JpaRepository<Slot, Long> {
    List<Slot> findByCenterIdAndSlotDateOrderByStartTimeAsc(Long centerId, LocalDate slotDate);
    List<Slot> findByCenterIdAndSlotDateAndStatusOrderByStartTimeAsc(Long centerId, LocalDate slotDate, SlotStatus status);
    Optional<Slot> findByCenterIdAndSlotDateAndStartTime(Long centerId, LocalDate slotDate, LocalTime startTime);

    @Query("SELECT s FROM Slot s WHERE s.center.id = :centerId AND s.slotDate >= :fromDate AND s.status = 'OPEN' ORDER BY s.slotDate ASC, s.startTime ASC")
    List<Slot> findAvailableSlotsFromDate(@Param("centerId") Long centerId, @Param("fromDate") LocalDate fromDate);
}
