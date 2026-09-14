package com.krishisetu.dto;

import com.krishisetu.entity.enums.BookingStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdvanceStageRequest {
    @NotNull(message = "Booking ID is required")
    private Long bookingId;

    @NotNull(message = "Target status is required")
    private BookingStatus targetStatus;

    private String assignedResource; // e.g., "Weighbridge-1", "Lab-Counter-A"
    private String reasonOrNotes;
    private Long officerId;
}
