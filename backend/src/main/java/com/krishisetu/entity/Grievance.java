package com.krishisetu.entity;

import com.krishisetu.entity.enums.GrievanceCategory;
import com.krishisetu.entity.enums.GrievanceStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "grievances")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Grievance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "farmer_id", nullable = false)
    private Farmer farmer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id")
    private Booking booking;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "center_id")
    private ProcurementCenter center;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    private GrievanceCategory category;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private GrievanceStatus status = GrievanceStatus.OPEN;

    @Column(columnDefinition = "TEXT")
    private String resolutionNotes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_officer_id")
    private User assignedOfficer;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @Column
    private LocalDateTime resolvedAt;
}
