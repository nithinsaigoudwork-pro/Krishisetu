package com.krishisetu.controller;

import com.krishisetu.dto.ApiResponse;
import com.krishisetu.dto.BookingRequest;
import com.krishisetu.dto.BookingResponse;
import com.krishisetu.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<ApiResponse<BookingResponse>> createBooking(@Valid @RequestBody BookingRequest.Create request) {
        BookingResponse response = bookingService.createBooking(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BookingResponse>> getBookingById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(bookingService.getBookingById(id)));
    }

    @GetMapping("/ref/{reference}")
    public ResponseEntity<ApiResponse<BookingResponse>> getBookingByReference(@PathVariable String reference) {
        return ResponseEntity.ok(ApiResponse.ok(bookingService.getBookingByReference(reference)));
    }

    @PutMapping("/{id}/reschedule")
    public ResponseEntity<ApiResponse<BookingResponse>> rescheduleBooking(
            @PathVariable Long id,
            @Valid @RequestBody BookingRequest.Reschedule request) {
        return ResponseEntity.ok(ApiResponse.ok(bookingService.rescheduleBooking(id, request)));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<BookingResponse>> cancelBooking(
            @PathVariable Long id,
            @RequestParam(required = false, defaultValue = "Cancelled by farmer") String reason) {
        return ResponseEntity.ok(ApiResponse.ok(bookingService.cancelBooking(id, reason)));
    }
}
