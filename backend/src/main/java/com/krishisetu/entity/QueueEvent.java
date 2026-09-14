package com.krishisetu.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "queue_events")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QueueEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "center_id", nullable = false)
    private ProcurementCenter center;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "queue_token_id", nullable = false)
    private QueueToken queueToken;

    @Column(nullable = false, length = 30)
    private String stage;

    @Column(nullable = false)
    private LocalDateTime enteredStageAt;

    @Column
    private LocalDateTime exitedStageAt;

    @Column
    private Integer durationSeconds;

    @Builder.Default
    private Boolean isBottleneckFlag = false;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
