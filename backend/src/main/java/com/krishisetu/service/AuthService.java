package com.krishisetu.service;

import com.krishisetu.config.JwtTokenProvider;
import com.krishisetu.dto.AuthRequest;
import com.krishisetu.dto.AuthResponse;
import com.krishisetu.entity.Farmer;
import com.krishisetu.entity.User;
import com.krishisetu.entity.enums.Role;
import com.krishisetu.exception.BusinessRuleException;
import com.krishisetu.exception.UnauthorizedException;
import com.krishisetu.repository.FarmerRepository;
import com.krishisetu.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Objects;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final FarmerRepository farmerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Transactional
    public AuthResponse register(AuthRequest.Register request) {
        if (userRepository.existsByMobileNumber(request.getMobileNumber())) {
            throw new BusinessRuleException("User with mobile number " + request.getMobileNumber() + " already exists");
        }

        User user = User.builder()
                .mobileNumber(request.getMobileNumber())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .role(request.getRole())
                .preferredLanguage(request.getPreferredLanguage() != null ? request.getPreferredLanguage() : "hi")
                .isActive(true)
                .build();

        user = userRepository.save(Objects.requireNonNull(user));
        Long farmerId = null;

        if (request.getRole() == Role.ROLE_FARMER) {
            Farmer farmer = Farmer.builder()
                    .user(user)
                    .aadhaarHash(request.getAadhaarHash() != null ? request.getAadhaarHash() : "HASH_" + request.getMobileNumber())
                    .state(request.getState() != null ? request.getState() : "Haryana")
                    .district(request.getDistrict() != null ? request.getDistrict() : "Sirsa")
                    .village(request.getVillage() != null ? request.getVillage() : "Rania")
                    .pincode(request.getPincode() != null ? request.getPincode() : "125055")
                    .latitude(request.getLatitude() != null ? request.getLatitude() : 29.53)
                    .longitude(request.getLongitude() != null ? request.getLongitude() : 75.03)
                    .landholdingAcres(request.getLandholdingAcres() != null ? request.getLandholdingAcres() : java.math.BigDecimal.valueOf(4.5))
                    .bankAccountNumber(request.getBankAccountNumber() != null ? request.getBankAccountNumber() : "SBIN00012345678")
                    .bankIfsc(request.getBankIfsc() != null ? request.getBankIfsc() : "SBIN0001234")
                    .bankName(request.getBankName() != null ? request.getBankName() : "State Bank of India")
                    .build();
            farmer = farmerRepository.save(Objects.requireNonNull(farmer));
            farmerId = farmer.getId();
        }

        String token = jwtTokenProvider.generateToken(user);

        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .userId(user.getId())
                .farmerId(farmerId)
                .fullName(user.getFullName())
                .mobileNumber(user.getMobileNumber())
                .role(user.getRole())
                .preferredLanguage(user.getPreferredLanguage())
                .build();
    }

    public AuthResponse login(AuthRequest.Login request) {
        User user = userRepository.findByMobileNumber(request.getMobileNumber())
                .orElseThrow(() -> new UnauthorizedException("Invalid mobile number or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new UnauthorizedException("Invalid mobile number or password");
        }

        if (!user.getIsActive()) {
            throw new BusinessRuleException("User account is inactive. Please contact administration.");
        }

        Long farmerId = null;
        if (user.getRole() == Role.ROLE_FARMER) {
            Farmer farmer = farmerRepository.findByUserId(user.getId()).orElse(null);
            if (farmer != null) {
                farmerId = farmer.getId();
            }
        }

        String token = jwtTokenProvider.generateToken(user);

        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .userId(user.getId())
                .farmerId(farmerId)
                .fullName(user.getFullName())
                .mobileNumber(user.getMobileNumber())
                .role(user.getRole())
                .preferredLanguage(user.getPreferredLanguage())
                .build();
    }
}
