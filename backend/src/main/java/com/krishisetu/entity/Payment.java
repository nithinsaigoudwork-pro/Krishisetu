package com.krishisetu.entity;

import com.krishisetu.entity.enums.PaymentStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "booking_id", nullable = false, unique = true)
    private Booking booking;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "farmer_id", nullable = false)
    private Farmer farmer;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal grossAmount;

    @Column(nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal statutoryDeductions = BigDecimal.ZERO;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal netPayableAmount;

    @Column(nullable = false, length = 30)
    @Builder.Default
    private String paymentMode = "DBT_PFMS";

    @Column(nullable = false, length = 30)
    private String bankAccountNumber;

    @Column(nullable = false, length = 15)
    private String bankIfsc;

    @Column(length = 60)
    private String pfmsTransactionId;

    @Column(length = 60)
    private String bankUtrNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private PaymentStatus paymentStatus = PaymentStatus.INITIATED;

    @Column(columnDefinition = "TEXT")
    private String failureReason;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime initiatedAt;

    @Column
    private LocalDateTime completedAt;
}
