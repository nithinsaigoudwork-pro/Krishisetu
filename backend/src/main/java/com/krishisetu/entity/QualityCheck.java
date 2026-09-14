package com.krishisetu.entity;

import com.krishisetu.entity.enums.QualityGrade;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "quality_checks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QualityCheck {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "procurement_record_id", nullable = false, unique = true)
    private ProcurementRecord procurementRecord;

    @Column(nullable = false, unique = true, length = 50)
    private String sampleBarcode;

    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal moisturePercentage;

    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal foreignMatterPercentage;

    @Column(precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal brokenGrainsPercentage = BigDecimal.ZERO;

    @Column(precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal immatureShriveledPercentage = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private QualityGrade qualityGrade;

    @Column(nullable = false)
    private Boolean isApproved;

    @Column(columnDefinition = "TEXT")
    private String rejectionReason;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assayed_by_officer_id", nullable = false)
    private User assayedByOfficer;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime assayedAt;
}
