package com.krishisetu.repository;

import com.krishisetu.entity.Grievance;
import com.krishisetu.entity.enums.GrievanceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GrievanceRepository extends JpaRepository<Grievance, Long> {
    List<Grievance> findByFarmerIdOrderByCreatedAtDesc(Long farmerId);
    List<Grievance> findByCenterIdOrderByCreatedAtDesc(Long centerId);
    List<Grievance> findByStatus(GrievanceStatus status);
}
