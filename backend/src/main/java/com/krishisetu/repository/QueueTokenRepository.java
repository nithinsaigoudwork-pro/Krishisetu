package com.krishisetu.repository;

import com.krishisetu.entity.QueueToken;
import com.krishisetu.entity.enums.TokenStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface QueueTokenRepository extends JpaRepository<QueueToken, Long> {
    Optional<QueueToken> findByBookingId(Long bookingId);
    Optional<QueueToken> findByTokenNumberAndTokenDate(String tokenNumber, LocalDate tokenDate);

    List<QueueToken> findByCenterIdAndTokenDateAndTokenStatusOrderByDailySequenceNumAsc(
        Long centerId, LocalDate tokenDate, TokenStatus tokenStatus
    );

    @Query("SELECT COUNT(q) FROM QueueToken q WHERE q.center.id = :centerId AND q.tokenDate = :tokenDate AND q.tokenStatus = 'ACTIVE' AND q.dailySequenceNum < :seqNum")
    long countVehiclesAheadOf(@Param("centerId") Long centerId, @Param("tokenDate") LocalDate tokenDate, @Param("seqNum") Integer seqNum);

    @Query("SELECT COALESCE(MAX(q.dailySequenceNum), 0) FROM QueueToken q WHERE q.center.id = :centerId AND q.tokenDate = :tokenDate")
    int findMaxDailySequenceNum(@Param("centerId") Long centerId, @Param("tokenDate") LocalDate tokenDate);

    long countByCenterIdAndTokenDateAndTokenStatus(Long centerId, LocalDate tokenDate, TokenStatus tokenStatus);
}
