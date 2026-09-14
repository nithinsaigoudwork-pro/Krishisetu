package com.krishisetu.entity;

import com.krishisetu.entity.enums.BookingStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 40)
    private String bookingReference;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "farmer_id", nullable = false)
    private Farmer farmer;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "center_id", nullable = false)
    private ProcurementCenter center;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "crop_id", nullable = false)
    private Crop crop;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "slot_id", nullable = false)
    private Slot slot;

    @Column(nullable = false)
    private LocalDate scheduledDate;

    @Column(nullable = false, precision = 8, scale = 2)
    private BigDecimal estimatedQuantityQuintals;

    @Column(nullable = false, length = 30)
    private String vehicleType;

    @Column(nullable = false, length = 20)
    private String vehicleNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private BookingStatus status = BookingStatus.BOOKED;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String offlineQrSignature;

    @Column(nullable = false)
    private LocalDateTime offlinePassExpiry;

    @Column(columnDefinition = "TEXT")
    private String cancellationReason;

    @Column
    private Long rescheduledFromBookingId;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
