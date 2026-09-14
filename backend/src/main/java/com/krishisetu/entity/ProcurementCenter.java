package com.krishisetu.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "procurement_centers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProcurementCenter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 30)
    private String centerCode;

    @Column(nullable = false, length = 150)
    private String centerName;

    @Column(nullable = false, length = 50)
    private String agencyName; // NAFED, FCI, HAFED, CCI, etc.

    @Column(nullable = false, length = 50)
    private String state;

    @Column(nullable = false, length = 50)
    private String district;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String address;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column(nullable = false)
    @Builder.Default
    private Integer totalWeighbridges = 2;

    @Column(nullable = false)
    @Builder.Default
    private Integer activeWeighbridges = 2;

    @Column(nullable = false)
    @Builder.Default
    private Integer totalQualityLabs = 1;

    @Column(nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal dailyCapacityQuintals = new BigDecimal("3000.00");

    @Column(nullable = false)
    @Builder.Default
    private LocalTime operatingStartTime = LocalTime.of(8, 0);

    @Column(nullable = false)
    @Builder.Default
    private LocalTime operatingEndTime = LocalTime.of(18, 0);

    @Builder.Default
    private Boolean isActive = true;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
