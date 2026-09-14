package com.krishisetu.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {

    @Builder.Default
    private boolean success = true;

    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();

    private T data;

    private ErrorDetails error;

    public static <T> ApiResponse<T> ok(T data) {
        return ApiResponse.<T>builder()
                .success(true)
                .timestamp(LocalDateTime.now())
                .data(data)
                .build();
    }

    public static <T> ApiResponse<T> fail(String code, String message) {
        return ApiResponse.<T>builder()
                .success(false)
                .timestamp(LocalDateTime.now())
                .error(new ErrorDetails(code, message))
                .build();
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ErrorDetails {
        private String code;
        private String message;
    }
}
