package com.krishisetu.repository;

import com.krishisetu.entity.QualityCheck;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface QualityCheckRepository extends JpaRepository<QualityCheck, Long> {
    Optional<QualityCheck> findByProcurementRecordId(Long procurementRecordId);
    Optional<QualityCheck> findBySampleBarcode(String sampleBarcode);
}
