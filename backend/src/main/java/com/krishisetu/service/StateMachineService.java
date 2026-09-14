package com.krishisetu.service;

import com.krishisetu.dto.AdvanceStageRequest;
import com.krishisetu.entity.Booking;
import com.krishisetu.entity.QueueEvent;
import com.krishisetu.entity.StatusHistory;
import com.krishisetu.entity.enums.BookingStatus;
import com.krishisetu.entity.enums.TokenStatus;
import com.krishisetu.exception.BusinessRuleException;
import com.krishisetu.exception.ResourceNotFoundException;
import com.krishisetu.repository.BookingRepository;
import com.krishisetu.repository.QueueEventRepository;
import com.krishisetu.repository.QueueTokenRepository;
import com.krishisetu.repository.StatusHistoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Objects;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class StateMachineService {

    private final BookingRepository bookingRepository;
    private final QueueTokenRepository queueTokenRepository;
    private final StatusHistoryRepository statusHistoryRepository;
    private final QueueEventRepository queueEventRepository;
    private final NotificationService notificationService;

    // Valid state machine transitions
    private static final Map<BookingStatus, Set<BookingStatus>> VALID_TRANSITIONS = Map.ofEntries(
            Map.entry(BookingStatus.BOOKED, Set.of(BookingStatus.ARRIVED, BookingStatus.GATE_VERIFIED, BookingStatus.WAITING, BookingStatus.CANCELLED, BookingStatus.RESCHEDULED)),
            Map.entry(BookingStatus.ARRIVED, Set.of(BookingStatus.GATE_VERIFIED, BookingStatus.WAITING, BookingStatus.CANCELLED)),
            Map.entry(BookingStatus.GATE_VERIFIED, Set.of(BookingStatus.WAITING, BookingStatus.RESCHEDULED)),
            Map.entry(BookingStatus.WAITING, Set.of(BookingStatus.WEIGHING, BookingStatus.RESCHEDULED)),
            Map.entry(BookingStatus.WEIGHING, Set.of(BookingStatus.QUALITY_CHECK, BookingStatus.REJECTED)),
            Map.entry(BookingStatus.QUALITY_CHECK, Set.of(BookingStatus.ACCEPTED, BookingStatus.REJECTED)),
            Map.entry(BookingStatus.ACCEPTED, Set.of(BookingStatus.UNLOADING)),
            Map.entry(BookingStatus.UNLOADING, Set.of(BookingStatus.DOCUMENTATION)),
            Map.entry(BookingStatus.DOCUMENTATION, Set.of(BookingStatus.PAYMENT_PROCESSING)),
            Map.entry(BookingStatus.PAYMENT_PROCESSING, Set.of(BookingStatus.PAYMENT_COMPLETED)),
            Map.entry(BookingStatus.RESCHEDULED, Set.of(BookingStatus.BOOKED, BookingStatus.ARRIVED, BookingStatus.GATE_VERIFIED, BookingStatus.WAITING, BookingStatus.CANCELLED)),
            Map.entry(BookingStatus.PAYMENT_COMPLETED, Set.of()),
            Map.entry(BookingStatus.REJECTED, Set.of()),
            Map.entry(BookingStatus.CANCELLED, Set.of())
    );

    @Transactional
    public Booking transitionStage(AdvanceStageRequest req) {
        Booking booking = bookingRepository.findById(Objects.requireNonNull(req.getBookingId()))
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + req.getBookingId()));

        BookingStatus current = booking.getStatus();
        BookingStatus target = req.getTargetStatus();

        Set<BookingStatus> allowedTargets = VALID_TRANSITIONS.getOrDefault(current, Set.of());
        if (!allowedTargets.contains(target)) {
            throw new BusinessRuleException(String.format("Invalid state transition from %s to %s", current, target));
        }

        booking.setStatus(target);
        Booking savedBooking = bookingRepository.save(Objects.requireNonNull(booking));

        // Update active token if present
        queueTokenRepository.findByBookingId(savedBooking.getId()).ifPresent(token -> {
            token.setCurrentStage(target.name());
            if (target == BookingStatus.PAYMENT_COMPLETED || target == BookingStatus.REJECTED || target == BookingStatus.CANCELLED) {
                token.setTokenStatus(TokenStatus.SERVED);
                token.setCompletedAt(LocalDateTime.now());
            }
            if (req.getAssignedResource() != null) {
                if (target == BookingStatus.WEIGHING) token.setAssignedWeighbridge(req.getAssignedResource());
                if (target == BookingStatus.QUALITY_CHECK) token.setAssignedLabCounter(req.getAssignedResource());
            }
            queueTokenRepository.save(Objects.requireNonNull(token));

            // Log event duration
            queueEventRepository.save(Objects.requireNonNull(QueueEvent.builder()
                    .center(savedBooking.getCenter())
                    .queueToken(token)
                    .stage(target.name())
                    .enteredStageAt(LocalDateTime.now())
                    .build()));
        });

        // Audit log
        statusHistoryRepository.save(Objects.requireNonNull(StatusHistory.builder()
                .entityType("BOOKING")
                .entityId(savedBooking.getId())
                .fromStatus(current.name())
                .toStatus(target.name())
                .changeReason(req.getReasonOrNotes())
                .build()));

        // Notify farmer
        String stageLabelHi = getHindiStageLabel(target);
        notificationService.sendFarmerNotification(
                savedBooking.getFarmer().getUser(),
                savedBooking,
                "स्थिति अपडेट / Stage: " + target.name(),
                "आपकी खरीद प्रक्रिया अब '" + stageLabelHi + "' चरण में है।",
                savedBooking.getFarmer().getUser().getPreferredLanguage()
        );

        return savedBooking;
    }

    private String getHindiStageLabel(BookingStatus status) {
        return switch (status) {
            case BOOKED -> "स्लॉट बुक";
            case ARRIVED -> "केंद्र पर आगमन";
            case GATE_VERIFIED -> "गेट सत्यापन पूर्ण";
            case WAITING -> "कतार में प्रतीक्षारत";
            case WEIGHING -> "धर्मकांटा तुलाई";
            case QUALITY_CHECK -> "गुणवत्ता जांच प्रयोगशाला";
            case ACCEPTED -> "फसल स्वीकार";
            case UNLOADING -> "गोदाम अनलोडिंग";
            case DOCUMENTATION -> "J-Form / रसीद तैयार";
            case PAYMENT_PROCESSING -> "DBT भुगतान प्रक्रियधीन";
            case PAYMENT_COMPLETED -> "खाते में भुगतान पूर्ण";
            case REJECTED -> "अस्वीकृत";
            case CANCELLED -> "रद्द";
            case RESCHEDULED -> "पुनर्निर्धारित";
        };
    }
}
