package com.krishisetu.repository;

import com.krishisetu.entity.Payment;
import com.krishisetu.entity.enums.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByBookingId(Long bookingId);
    List<Payment> findByFarmerIdOrderByInitiatedAtDesc(Long farmerId);
    List<Payment> findByPaymentStatus(PaymentStatus status);
}
