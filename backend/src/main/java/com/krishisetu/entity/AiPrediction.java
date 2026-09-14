package com.krishisetu.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "ai_predictions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiPrediction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "center_id", nullable = false)
    private ProcurementCenter center;

    @Column(nullable = false)
    private LocalDate forecastDate;

    @Column(nullable = false)
    private Integer forecastHour; // 0 to 23

    @Column(nullable = false, precision = 6, scale = 2)
    private BigDecimal predictedWaitTimeMins;

    @Column(nullable = false, length = 20)
    private String predictedCongestionLevel;

    @Column(nullable = false, length = 30)
    private String modelVersion;

    @Column(columnDefinition = "TEXT")
    private String inputFeaturesJson;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
