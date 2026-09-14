package com.krishisetu.entity;

import com.krishisetu.entity.enums.Season;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "crops")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Crop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 20)
    private String cropCode;

    @Column(nullable = false, length = 50)
    private String cropNameEn;

    @Column(nullable = false, length = 50)
    private String cropNameHi;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Season season;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal mspRatePerQuintal;

    @Column(nullable = false, precision = 4, scale = 2)
    @Builder.Default
    private BigDecimal maxMoisturePercentage = new BigDecimal("17.00");

    @Column(nullable = false, precision = 4, scale = 2)
    @Builder.Default
    private BigDecimal maxForeignMatterPercentage = new BigDecimal("2.00");

    @Column(nullable = false)
    @Builder.Default
    private Integer standardAssayDurationMins = 10;

    @Column(nullable = false)
    @Builder.Default
    private Integer standardWeighDurationMins = 8;

    @Column(nullable = false, precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal standardUnloadRateQuintalsPerMin = new BigDecimal("4.00");
}
