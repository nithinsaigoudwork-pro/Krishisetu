package com.krishisetu.entity;

import com.krishisetu.entity.enums.TokenStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "queue_tokens", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"center_id", "token_date", "daily_sequence_num"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QueueToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "booking_id", nullable = false, unique = true)
    private Booking booking;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "center_id", nullable = false)
    private ProcurementCenter center;

    @Column(nullable = false, length = 20)
    private String tokenNumber; // e.g. "T-104"

    @Column(nullable = false)
    private Integer dailySequenceNum;

    @Column(nullable = false)
    private LocalDate tokenDate;

    @Column(nullable = false)
    @Builder.Default
    private Integer priorityScore = 0;

    @Column(nullable = false, length = 30)
    @Builder.Default
    private String currentStage = "WAITING";

    @Column(length = 20)
    private String assignedWeighbridge;

    @Column(length = 20)
    private String assignedLabCounter;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private TokenStatus tokenStatus = TokenStatus.ACTIVE;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime issuedAt;

    @Column
    private LocalDateTime calledAt;

    @Column
    private LocalDateTime completedAt;
}
