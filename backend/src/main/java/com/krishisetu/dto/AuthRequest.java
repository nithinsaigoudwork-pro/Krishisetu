package com.krishisetu.dto;

import com.krishisetu.entity.enums.Role;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

public class AuthRequest {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Login {
        @NotBlank(message = "Mobile number is required")
        private String mobileNumber;

        @NotBlank(message = "Password is required")
        private String password;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Register {
        @NotBlank(message = "Mobile number is required")
        private String mobileNumber;

        @NotBlank(message = "Password is required")
        private String password;

        @NotBlank(message = "Full name is required")
        private String fullName;

        @NotNull(message = "Role is required")
        private Role role;

        private String preferredLanguage;

        // Farmer specific fields
        private String aadhaarHash;
        private String state;
        private String district;
        private String village;
        private String pincode;
        private Double latitude;
        private Double longitude;
        private BigDecimal landholdingAcres;
        private String bankAccountNumber;
        private String bankIfsc;
        private String bankName;
    }
}
