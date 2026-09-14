package com.krishisetu.repository;

import com.krishisetu.entity.QueueEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QueueEventRepository extends JpaRepository<QueueEvent, Long> {
    List<QueueEvent> findByQueueTokenIdOrderByEnteredStageAtAsc(Long queueTokenId);
    List<QueueEvent> findByCenterIdAndIsBottleneckFlagTrue(Long centerId);
}
