package com.krishisetu.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatRequest {

    private Long farmerId;

    @NotBlank(message = "Farmer message/query is required")
    private String message;

    @Builder.Default
    private String language = "hi"; // hi, mr, te, pa, en

    private Double latitude;
    private Double longitude;
}
