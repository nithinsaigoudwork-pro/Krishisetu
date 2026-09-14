package com.krishisetu.dto;

import com.krishisetu.entity.enums.BookingStatus;
import com.krishisetu.entity.enums.TokenStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QueueStatusResponse {
    private Long bookingId;
    private String bookingReference;
    private Long tokenId;
    private String tokenNumber;
    private Long centerId;
    private String centerName;
    private String cropName;
    private BigDecimal quantityQuintals;
    private Integer queuePosition;
    private Integer totalInQueue;
    private BigDecimal estimatedWaitTimeMins;
    private BookingStatus currentStage;
    private TokenStatus tokenStatus;
    private String assignedWeighbridge;
    private String assignedLabCounter;
    private LocalDateTime issuedAt;
    private LocalDateTime estimatedServiceTime;
    private String statusMessageEn;
    private String statusMessageHi;
}
