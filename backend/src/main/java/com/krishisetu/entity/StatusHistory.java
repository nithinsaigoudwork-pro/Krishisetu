package com.krishisetu.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "status_history")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StatusHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 30)
    private String entityType; // BOOKING, TOKEN, PAYMENT, QUALITY

    @Column(nullable = false)
    private Long entityId;

    @Column(length = 40)
    private String fromStatus;

    @Column(nullable = false, length = 40)
    private String toStatus;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "changed_by_user_id")
    private User changedByUser;

    @Column(columnDefinition = "TEXT")
    private String changeReason;

    @Column(columnDefinition = "TEXT")
    private String metadataJson;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime recordedAt;
}
