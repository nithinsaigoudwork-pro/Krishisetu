package com.krishisetu.controller;

import com.krishisetu.dto.AdminAnalyticsResponse;
import com.krishisetu.dto.ApiResponse;
import com.krishisetu.service.AdminAnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminAnalyticsService adminAnalyticsService;

    @GetMapping("/analytics/overview")
    public ResponseEntity<ApiResponse<AdminAnalyticsResponse>> getOverview(
            @RequestParam(required = false) String district) {
        return ResponseEntity.ok(ApiResponse.ok(adminAnalyticsService.getDistrictAnalyticsOverview(district)));
    }
}
