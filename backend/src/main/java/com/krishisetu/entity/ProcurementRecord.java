package com.krishisetu.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "procurement_records")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProcurementRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "booking_id", nullable = false, unique = true)
    private Booking booking;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal grossWeightKg;

    @Column(precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal tareWeightKg = BigDecimal.ZERO;

    @Column(precision = 10, scale = 2)
    private BigDecimal netWeightKg;

    @Column(precision = 10, scale = 2)
    private BigDecimal netWeightQuintals;

    @Column
    private Integer bagsCount;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal appliedMspRate;

    @Column(precision = 12, scale = 2)
    private BigDecimal totalProcurementAmount;

    @Column(unique = true, length = 50)
    private String jFormReceiptNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "weighbridge_operator_id")
    private User weighbridgeOperator;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
