package com.krishisetu.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "farmers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Farmer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false, unique = true, length = 64)
    private String aadhaarHash;

    @Column(nullable = false, length = 50)
    private String state;

    @Column(nullable = false, length = 50)
    private String district;

    @Column(length = 50)
    private String subDistrict;

    @Column(nullable = false, length = 100)
    private String village;

    @Column(nullable = false, length = 10)
    private String pincode;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column(nullable = false, precision = 6, scale = 2)
    private BigDecimal landholdingAcres;

    @Column(nullable = false, length = 30)
    private String bankAccountNumber;

    @Column(nullable = false, length = 15)
    private String bankIfsc;

    @Column(nullable = false, length = 100)
    private String bankName;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
