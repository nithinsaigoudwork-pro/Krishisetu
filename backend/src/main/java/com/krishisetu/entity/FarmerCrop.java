package com.krishisetu.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "farmer_crops", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"farmer_id", "crop_id", "season_year"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FarmerCrop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "farmer_id", nullable = false)
    private Farmer farmer;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "crop_id", nullable = false)
    private Crop crop;

    @Column(nullable = false, precision = 6, scale = 2)
    private BigDecimal cultivatedAcres;

    @Column(nullable = false, precision = 8, scale = 2)
    private BigDecimal estimatedYieldQuintals;

    @Builder.Default
    private Boolean verifiedByPatwari = true;

    @Column(nullable = false, length = 10)
    private String seasonYear; // e.g. "2025-26"
}
