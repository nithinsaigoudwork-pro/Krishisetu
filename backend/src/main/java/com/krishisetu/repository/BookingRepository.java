package com.krishisetu.repository;

import com.krishisetu.entity.Booking;
import com.krishisetu.entity.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    Optional<Booking> findByBookingReference(String bookingReference);
    List<Booking> findByFarmerIdOrderByScheduledDateDesc(Long farmerId);
    List<Booking> findByCenterIdAndScheduledDate(Long centerId, LocalDate scheduledDate);
    List<Booking> findByCenterIdAndScheduledDateAndStatus(Long centerId, LocalDate scheduledDate, BookingStatus status);

    @Query("SELECT b FROM Booking b WHERE b.farmer.id = :farmerId AND b.status NOT IN ('COMPLETED', 'CANCELLED', 'REJECTED') ORDER BY b.scheduledDate DESC")
    List<Booking> findActiveBookingsByFarmer(@Param("farmerId") Long farmerId);

    long countByCenterIdAndScheduledDate(Long centerId, LocalDate scheduledDate);
}
