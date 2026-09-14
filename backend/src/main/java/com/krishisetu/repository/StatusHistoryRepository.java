package com.krishisetu.repository;

import com.krishisetu.entity.StatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StatusHistoryRepository extends JpaRepository<StatusHistory, Long> {
    List<StatusHistory> findByEntityTypeAndEntityIdOrderByRecordedAtDesc(String entityType, Long entityId);
}
