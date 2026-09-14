package com.krishisetu.repository;

import com.krishisetu.entity.ProcurementRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProcurementRecordRepository extends JpaRepository<ProcurementRecord, Long> {
    Optional<ProcurementRecord> findByBookingId(Long bookingId);

    @Query("SELECT p FROM ProcurementRecord p WHERE p.jFormReceiptNumber = :receiptNumber")
    Optional<ProcurementRecord> findByJFormReceiptNumber(@Param("receiptNumber") String jFormReceiptNumber);
}
