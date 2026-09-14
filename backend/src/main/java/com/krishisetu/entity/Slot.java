package com.krishisetu.entity;

import com.krishisetu.entity.enums.SlotStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "slots", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"center_id", "slot_date", "start_time"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Slot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "center_id", nullable = false)
    private ProcurementCenter center;

    @Column(nullable = false)
    private LocalDate slotDate;

    @Column(nullable = false)
    private LocalTime startTime;

    @Column(nullable = false)
    private LocalTime endTime;

    @Column(nullable = false)
    @Builder.Default
    private Integer maxVehicles = 20;

    @Column(nullable = false)
    @Builder.Default
    private Integer bookedVehicles = 0;

    @Column(nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal maxTonnageQuintals = new BigDecimal("1000.00");

    @Column(nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal bookedTonnageQuintals = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private SlotStatus status = SlotStatus.OPEN;
}
