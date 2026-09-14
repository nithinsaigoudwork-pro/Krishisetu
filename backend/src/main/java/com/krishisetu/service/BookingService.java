package com.krishisetu.service;

import com.krishisetu.dto.BookingRequest;
import com.krishisetu.dto.BookingResponse;
import com.krishisetu.entity.*;
import com.krishisetu.entity.enums.BookingStatus;
import com.krishisetu.entity.enums.SlotStatus;
import com.krishisetu.exception.BusinessRuleException;
import com.krishisetu.exception.ResourceNotFoundException;
import com.krishisetu.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingService {

    private final BookingRepository bookingRepository;
    private final FarmerRepository farmerRepository;
    private final ProcurementCenterRepository centerRepository;
    private final CropRepository cropRepository;
    private final SlotRepository slotRepository;
    private final QueueTokenRepository queueTokenRepository;
    private final QrCodeService qrCodeService;
    private final NotificationService notificationService;
    private final StatusHistoryRepository statusHistoryRepository;

    @Transactional
    public BookingResponse createBooking(BookingRequest.Create req) {
        Farmer farmer = farmerRepository.findById(Objects.requireNonNull(req.getFarmerId()))
                .orElseThrow(() -> new ResourceNotFoundException("Farmer not found with id: " + req.getFarmerId()));

        ProcurementCenter center = centerRepository.findById(Objects.requireNonNull(req.getCenterId()))
                .orElseThrow(() -> new ResourceNotFoundException("Center not found with id: " + req.getCenterId()));

        Crop crop = cropRepository.findById(Objects.requireNonNull(req.getCropId()))
                .orElseThrow(() -> new ResourceNotFoundException("Crop not found with id: " + req.getCropId()));

        // Check if farmer already has an active pending booking for the same crop
        List<Booking> activeBookings = bookingRepository.findActiveBookingsByFarmer(farmer.getId());
        boolean hasDuplicate = activeBookings.stream()
                .anyMatch(b -> b.getCrop().getId().equals(crop.getId()) && b.getScheduledDate().equals(req.getScheduledDate()));
        if (hasDuplicate) {
            throw new BusinessRuleException("You already have an active appointment scheduled for " + crop.getCropNameEn() + " on " + req.getScheduledDate());
        }

        // Slot allocation: either provided or find first available slot on date
        Slot slot = null;
        if (req.getSlotId() != null) {
            slot = slotRepository.findById(Objects.requireNonNull(req.getSlotId()))
                    .orElseThrow(() -> new ResourceNotFoundException("Slot not found with id: " + req.getSlotId()));
        } else {
            List<Slot> availableSlots = slotRepository.findByCenterIdAndSlotDateAndStatusOrderByStartTimeAsc(
                    center.getId(), req.getScheduledDate(), SlotStatus.OPEN
            );
            if (availableSlots.isEmpty()) {
                // Auto-create standard slot if none initialized
                slot = Slot.builder()
                        .center(center)
                        .slotDate(req.getScheduledDate())
                        .startTime(LocalTime.of(9, 0))
                        .endTime(LocalTime.of(12, 0))
                        .maxVehicles(25)
                        .bookedVehicles(0)
                        .maxTonnageQuintals(new BigDecimal("1200.00"))
                        .bookedTonnageQuintals(BigDecimal.ZERO)
                        .status(SlotStatus.OPEN)
                        .build();
                slot = slotRepository.save(Objects.requireNonNull(slot));
            } else {
                slot = availableSlots.get(0);
            }
        }

        if (slot.getBookedVehicles() >= slot.getMaxVehicles()) {
            slot.setStatus(SlotStatus.FULL);
            slotRepository.save(Objects.requireNonNull(slot));
            throw new BusinessRuleException("Selected slot is full. Please choose another slot or center.");
        }

        // Increment slot bookings
        slot.setBookedVehicles(slot.getBookedVehicles() + 1);
        slot.setBookedTonnageQuintals(slot.getBookedTonnageQuintals().add(req.getEstimatedQuantityQuintals()));
        if (slot.getBookedVehicles() >= slot.getMaxVehicles()) {
            slot.setStatus(SlotStatus.FULL);
        }
        slotRepository.save(Objects.requireNonNull(slot));

        String bookingRef = "KS-" + LocalDate.now().getYear() + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        LocalDateTime passExpiry = req.getScheduledDate().atTime(23, 59, 59);

        String qrSignature = qrCodeService.generateOfflineQrPayload(
                null, bookingRef, farmer.getId(), center.getId(), passExpiry
        );

        Booking booking = Booking.builder()
                .bookingReference(bookingRef)
                .farmer(farmer)
                .center(center)
                .crop(crop)
                .slot(slot)
                .scheduledDate(req.getScheduledDate())
                .estimatedQuantityQuintals(req.getEstimatedQuantityQuintals())
                .vehicleType(req.getVehicleType() != null ? req.getVehicleType() : "TRACTOR_TROLLEY")
                .vehicleNumber(req.getVehicleNumber() != null ? req.getVehicleNumber() : "HR-24-TEMP")
                .status(BookingStatus.BOOKED)
                .offlineQrSignature(qrSignature)
                .offlinePassExpiry(passExpiry)
                .build();

        booking = bookingRepository.save(Objects.requireNonNull(booking));

        // Record status history audit
        statusHistoryRepository.save(Objects.requireNonNull(StatusHistory.builder()
                .entityType("BOOKING")
                .entityId(booking.getId())
                .fromStatus(null)
                .toStatus(BookingStatus.BOOKED.name())
                .changedByUser(farmer.getUser())
                .changeReason("Slot booked by farmer")
                .build()));

        // Send notification
        notificationService.sendFarmerNotification(
                farmer.getUser(),
                booking,
                "स्लॉट बुकिंग सफल / Slot Booked",
                String.format("आपका स्लॉट %s केंद्र पर %s के लिए बुक हो गया है। संदर्भ संख्या: %s",
                        center.getCenterName(), req.getScheduledDate(), bookingRef),
                farmer.getUser().getPreferredLanguage()
        );

        return mapToResponse(booking);
    }

    public BookingResponse getBookingById(Long id) {
        Booking booking = bookingRepository.findById(Objects.requireNonNull(id))
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));
        return mapToResponse(booking);
    }

    public BookingResponse getBookingByReference(String ref) {
        Booking booking = bookingRepository.findByBookingReference(ref)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ref: " + ref));
        return mapToResponse(booking);
    }

    public List<BookingResponse> getFarmerBookings(Long farmerId) {
        return bookingRepository.findByFarmerIdOrderByScheduledDateDesc(farmerId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public BookingResponse rescheduleBooking(Long bookingId, BookingRequest.Reschedule req) {
        Booking booking = bookingRepository.findById(Objects.requireNonNull(bookingId))
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        if (booking.getStatus() != BookingStatus.BOOKED && booking.getStatus() != BookingStatus.RESCHEDULED) {
            throw new BusinessRuleException("Cannot reschedule booking once gate check-in is complete.");
        }

        // Release old slot vehicle count
        Slot oldSlot = booking.getSlot();
        if (oldSlot != null) {
            oldSlot.setBookedVehicles(Math.max(0, oldSlot.getBookedVehicles() - 1));
            oldSlot.setStatus(SlotStatus.OPEN);
            slotRepository.save(Objects.requireNonNull(oldSlot));
        }

        booking.setScheduledDate(req.getNewScheduledDate());
        booking.setStatus(BookingStatus.RESCHEDULED);
        if (req.getReason() != null) {
            booking.setCancellationReason(req.getReason());
        }

        LocalDateTime newExpiry = req.getNewScheduledDate().atTime(23, 59, 59);
        booking.setOfflinePassExpiry(newExpiry);
        booking.setOfflineQrSignature(qrCodeService.generateOfflineQrPayload(
                booking.getId(), booking.getBookingReference(), booking.getFarmer().getId(), booking.getCenter().getId(), newExpiry
        ));

        booking = bookingRepository.save(Objects.requireNonNull(booking));

        statusHistoryRepository.save(Objects.requireNonNull(StatusHistory.builder()
                .entityType("BOOKING")
                .entityId(booking.getId())
                .fromStatus(BookingStatus.BOOKED.name())
                .toStatus(BookingStatus.RESCHEDULED.name())
                .changedByUser(booking.getFarmer().getUser())
                .changeReason(req.getReason() != null ? req.getReason() : "Rescheduled by farmer")
                .build()));

        notificationService.sendFarmerNotification(
                booking.getFarmer().getUser(),
                booking,
                "अपॉइंटमेंट पुनर्निर्धारित / Rescheduled",
                "आपका स्लॉट " + req.getNewScheduledDate() + " के लिए पुनर्निर्धारित कर दिया गया है।",
                booking.getFarmer().getUser().getPreferredLanguage()
        );

        return mapToResponse(booking);
    }

    @Transactional
    public BookingResponse cancelBooking(Long bookingId, String reason) {
        Booking booking = bookingRepository.findById(Objects.requireNonNull(bookingId))
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        booking.setStatus(BookingStatus.CANCELLED);
        booking.setCancellationReason(reason);

        // Release slot capacity
        Slot slot = booking.getSlot();
        if (slot != null) {
            slot.setBookedVehicles(Math.max(0, slot.getBookedVehicles() - 1));
            slot.setStatus(SlotStatus.OPEN);
            slotRepository.save(Objects.requireNonNull(slot));
        }

        booking = bookingRepository.save(Objects.requireNonNull(booking));

        statusHistoryRepository.save(Objects.requireNonNull(StatusHistory.builder()
                .entityType("BOOKING")
                .entityId(booking.getId())
                .fromStatus(BookingStatus.BOOKED.name())
                .toStatus(BookingStatus.CANCELLED.name())
                .changedByUser(booking.getFarmer().getUser())
                .changeReason(reason)
                .build()));

        return mapToResponse(booking);
    }

    public BookingResponse mapToResponse(Booking b) {
        String tokenNumber = null;
        Integer queuePosition = null;
        BigDecimal estWait = null;

        var tokenOpt = queueTokenRepository.findByBookingId(b.getId());
        if (tokenOpt.isPresent()) {
            QueueToken token = tokenOpt.get();
            tokenNumber = token.getTokenNumber();
            long ahead = queueTokenRepository.countVehiclesAheadOf(
                    b.getCenter().getId(), token.getTokenDate(), token.getDailySequenceNum()
            );
            queuePosition = (int) ahead + 1;
            estWait = BigDecimal.valueOf(Math.max(5, queuePosition * 8));
        }

        return BookingResponse.builder()
                .id(b.getId())
                .bookingReference(b.getBookingReference())
                .farmerId(b.getFarmer().getId())
                .farmerName(b.getFarmer().getUser().getFullName())
                .farmerMobile(b.getFarmer().getUser().getMobileNumber())
                .centerId(b.getCenter().getId())
                .centerName(b.getCenter().getCenterName())
                .centerAddress(b.getCenter().getAddress())
                .cropId(b.getCrop().getId())
                .cropNameEn(b.getCrop().getCropNameEn())
                .cropNameHi(b.getCrop().getCropNameHi())
                .estimatedQuantityQuintals(b.getEstimatedQuantityQuintals())
                .scheduledDate(b.getScheduledDate())
                .slotStartTime(b.getSlot() != null ? b.getSlot().getStartTime() : null)
                .slotEndTime(b.getSlot() != null ? b.getSlot().getEndTime() : null)
                .vehicleType(b.getVehicleType())
                .vehicleNumber(b.getVehicleNumber())
                .status(b.getStatus())
                .offlineQrSignature(b.getOfflineQrSignature())
                .offlinePassExpiry(b.getOfflinePassExpiry())
                .tokenNumber(tokenNumber)
                .queuePosition(queuePosition)
                .estimatedWaitTimeMins(estWait)
                .createdAt(b.getCreatedAt())
                .build();
    }
}
