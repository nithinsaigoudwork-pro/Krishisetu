package com.krishisetu.entity;

import com.krishisetu.entity.enums.CongestionLevel;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "center_capacity", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"center_id", "recorded_date", "hour_of_day"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CenterCapacity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "center_id", nullable = false)
    private ProcurementCenter center;

    @Column(nullable = false)
    private LocalDate recordedDate;

    @Column(nullable = false)
    private Integer hourOfDay; // 0 to 23

    @Column(nullable = false)
    @Builder.Default
    private Integer activeWeighbridges = 2;

    @Column(nullable = false)
    @Builder.Default
    private Integer activeQualityLabs = 1;

    @Column(nullable = false)
    @Builder.Default
    private Integer waitingTractorsCount = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer processingTractorsCount = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer servedTractorsLastHour = 0;

    @Column(nullable = false, precision = 6, scale = 2)
    @Builder.Default
    private BigDecimal avgWaitingTimeMins = BigDecimal.ZERO;

    @Column(nullable = false, precision = 6, scale = 2)
    @Builder.Default
    private BigDecimal avgProcessingTimeMins = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private CongestionLevel congestionLevel = CongestionLevel.LOW;

    @Column(length = 30)
    @Builder.Default
    private String weatherCondition = "CLEAR";

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
