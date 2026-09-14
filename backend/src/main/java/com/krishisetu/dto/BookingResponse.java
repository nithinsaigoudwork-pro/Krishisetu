package com.krishisetu.dto;

import com.krishisetu.entity.enums.BookingStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {
    private Long id;
    private String bookingReference;
    private Long farmerId;
    private String farmerName;
    private String farmerMobile;
    private Long centerId;
    private String centerName;
    private String centerAddress;
    private Long cropId;
    private String cropNameEn;
    private String cropNameHi;
    private BigDecimal estimatedQuantityQuintals;
    private LocalDate scheduledDate;
    private LocalTime slotStartTime;
    private LocalTime slotEndTime;
    private String vehicleType;
    private String vehicleNumber;
    private BookingStatus status;
    private String offlineQrSignature;
    private LocalDateTime offlinePassExpiry;
    private String tokenNumber;
    private Integer queuePosition;
    private BigDecimal estimatedWaitTimeMins;
    private LocalDateTime createdAt;
}
