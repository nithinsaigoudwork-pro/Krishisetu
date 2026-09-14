package com.krishisetu.service;

import com.krishisetu.dto.GateCheckinRequest;
import com.krishisetu.dto.QueueStatusResponse;
import com.krishisetu.entity.*;
import com.krishisetu.entity.enums.BookingStatus;
import com.krishisetu.entity.enums.TokenStatus;
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
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class QueueService {

    private final BookingRepository bookingRepository;
    private final QueueTokenRepository queueTokenRepository;
    private final StatusHistoryRepository statusHistoryRepository;
    private final QueueEventRepository queueEventRepository;
    private final QrCodeService qrCodeService;
    private final NotificationService notificationService;
    private final AiServiceClient aiServiceClient;

    @Transactional
    public QueueStatusResponse performGateCheckin(GateCheckinRequest.Checkin req) {
        String bookingRef = qrCodeService.extractBookingReference(req.getQrPayloadOrReference());

        Booking booking = bookingRepository.findByBookingReference(bookingRef)
                .orElseThrow(() -> new ResourceNotFoundException("Booking reference not found: " + bookingRef));

        if (booking.getStatus() == BookingStatus.CANCELLED || booking.getStatus() == BookingStatus.REJECTED) {
            throw new BusinessRuleException("Cannot check in booking with status " + booking.getStatus());
        }

        // If already checked in and has active token, return current status
        Optional<QueueToken> existingToken = queueTokenRepository.findByBookingId(booking.getId());
        if (existingToken.isPresent()) {
            return getQueueStatusForBooking(booking.getId());
        }

        LocalDate today = LocalDate.now();
        int nextSeq = queueTokenRepository.findMaxDailySequenceNum(booking.getCenter().getId(), today) + 1;
        String tokenNumber = "T-" + (100 + nextSeq);

        booking.setStatus(BookingStatus.WAITING);
        booking = bookingRepository.save(Objects.requireNonNull(booking));

        QueueToken token = QueueToken.builder()
                .booking(booking)
                .center(booking.getCenter())
                .tokenNumber(tokenNumber)
                .dailySequenceNum(nextSeq)
                .tokenDate(today)
                .currentStage("WAITING")
                .tokenStatus(TokenStatus.ACTIVE)
                .issuedAt(LocalDateTime.now())
                .build();

        token = queueTokenRepository.save(Objects.requireNonNull(token));

        // Record stage event
        queueEventRepository.save(Objects.requireNonNull(QueueEvent.builder()
                .center(booking.getCenter())
                .queueToken(token)
                .stage("WAITING")
                .enteredStageAt(LocalDateTime.now())
                .build()));

        // Record status history audit
        statusHistoryRepository.save(Objects.requireNonNull(StatusHistory.builder()
                .entityType("BOOKING")
                .entityId(booking.getId())
                .fromStatus(BookingStatus.BOOKED.name())
                .toStatus(BookingStatus.WAITING.name())
                .changeReason("Gate QR Check-in verified. Token issued: " + tokenNumber)
                .build()));

        // WebSocket Broadcasts
        QueueStatusResponse status = buildQueueStatusResponse(booking, token);
        notificationService.broadcastQueueUpdate(booking.getCenter().getId(), status);
        notificationService.sendFarmerNotification(
                booking.getFarmer().getUser(),
                booking,
                "टोकन जारी / Token Generated: " + tokenNumber,
                String.format("आपका टोकन नंबर %s है। आपकी कतार स्थिति: #%d (अनुमानित समय: %s मिनट)",
                        tokenNumber, status.getQueuePosition(), status.getEstimatedWaitTimeMins()),
                booking.getFarmer().getUser().getPreferredLanguage()
        );

        return status;
    }

    public QueueStatusResponse getFarmerQueueStatus(Long farmerId) {
        List<Booking> activeBookings = bookingRepository.findActiveBookingsByFarmer(farmerId);
        if (activeBookings.isEmpty()) {
            throw new ResourceNotFoundException("No active bookings found for farmer id: " + farmerId);
        }

        Booking currentBooking = activeBookings.get(0);
        return getQueueStatusForBooking(currentBooking.getId());
    }

    public QueueStatusResponse getQueueStatusForBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(Objects.requireNonNull(bookingId))
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found: " + bookingId));

        QueueToken token = queueTokenRepository.findByBookingId(bookingId)
                .orElse(null);

        return buildQueueStatusResponse(booking, token);
    }

    @Transactional
    public QueueStatusResponse callNextToken(Long centerId, String assignedWeighbridge) {
        LocalDate today = LocalDate.now();
        List<QueueToken> activeTokens = queueTokenRepository
                .findByCenterIdAndTokenDateAndTokenStatusOrderByDailySequenceNumAsc(centerId, today, TokenStatus.ACTIVE);

        if (activeTokens.isEmpty()) {
            throw new BusinessRuleException("No active tokens waiting in queue for center: " + centerId);
        }

        QueueToken nextToken = activeTokens.get(0);
        nextToken.setCurrentStage("WEIGHING");
        nextToken.setAssignedWeighbridge(assignedWeighbridge != null ? assignedWeighbridge : "Weighbridge-1");
        nextToken.setCalledAt(LocalDateTime.now());
        queueTokenRepository.save(Objects.requireNonNull(nextToken));

        Booking booking = nextToken.getBooking();
        booking.setStatus(BookingStatus.WEIGHING);
        bookingRepository.save(Objects.requireNonNull(booking));

        // Record stage transition event
        queueEventRepository.save(Objects.requireNonNull(QueueEvent.builder()
                .center(booking.getCenter())
                .queueToken(nextToken)
                .stage("WEIGHING")
                .enteredStageAt(LocalDateTime.now())
                .build()));

        QueueStatusResponse status = buildQueueStatusResponse(booking, nextToken);
        notificationService.broadcastQueueUpdate(centerId, status);

        notificationService.sendFarmerNotification(
                booking.getFarmer().getUser(),
                booking,
                "तुलाई हेतु बुलावा / Called to Weighbridge",
                String.format("टोकन %s: कृपया अपने वाहन को %s पर ले जाएं।", nextToken.getTokenNumber(), nextToken.getAssignedWeighbridge()),
                booking.getFarmer().getUser().getPreferredLanguage()
        );

        return status;
    }

    public List<QueueToken> getActiveCenterQueue(Long centerId) {
        return queueTokenRepository.findByCenterIdAndTokenDateAndTokenStatusOrderByDailySequenceNumAsc(
                centerId, LocalDate.now(), TokenStatus.ACTIVE
        );
    }

    private QueueStatusResponse buildQueueStatusResponse(Booking booking, QueueToken token) {
        if (token == null) {
            return QueueStatusResponse.builder()
                    .bookingId(booking.getId())
                    .bookingReference(booking.getBookingReference())
                    .centerId(booking.getCenter().getId())
                    .centerName(booking.getCenter().getCenterName())
                    .cropName(booking.getCrop().getCropNameEn())
                    .quantityQuintals(booking.getEstimatedQuantityQuintals())
                    .currentStage(booking.getStatus())
                    .statusMessageEn("Appointment booked. Present QR code at gate upon arrival.")
                    .statusMessageHi("अपॉइंटमेंट बुक है। आगमन पर गेट पर क्यूआर कोड दिखाएं।")
                    .build();
        }

        long ahead = queueTokenRepository.countVehiclesAheadOf(
                booking.getCenter().getId(), token.getTokenDate(), token.getDailySequenceNum()
        );
        int position = (int) ahead + 1;

        Double aiWait = aiServiceClient.predictWaitTime(
                booking.getCenter().getId(), position, booking.getCenter().getActiveWeighbridges(), booking.getCrop().getCropCode()
        );

        BigDecimal estWaitMins = BigDecimal.valueOf(Math.round(aiWait));
        LocalDateTime estServiceTime = LocalDateTime.now().plusMinutes(estWaitMins.longValue());

        String msgEn = String.format("Token %s is #%d in queue. Est wait: %.0f mins.", token.getTokenNumber(), position, aiWait);
        String msgHi = String.format("टोकन %s कतार में #%d स्थान पर है। अनुमानित प्रतीक्षा: %.0f मिनट।", token.getTokenNumber(), position, aiWait);

        return QueueStatusResponse.builder()
                .bookingId(booking.getId())
                .bookingReference(booking.getBookingReference())
                .tokenId(token.getId())
                .tokenNumber(token.getTokenNumber())
                .centerId(booking.getCenter().getId())
                .centerName(booking.getCenter().getCenterName())
                .cropName(booking.getCrop().getCropNameEn())
                .quantityQuintals(booking.getEstimatedQuantityQuintals())
                .queuePosition(position)
                .totalInQueue((int) queueTokenRepository.countByCenterIdAndTokenDateAndTokenStatus(
                        booking.getCenter().getId(), token.getTokenDate(), TokenStatus.ACTIVE))
                .estimatedWaitTimeMins(estWaitMins)
                .currentStage(booking.getStatus())
                .tokenStatus(token.getTokenStatus())
                .assignedWeighbridge(token.getAssignedWeighbridge())
                .assignedLabCounter(token.getAssignedLabCounter())
                .issuedAt(token.getIssuedAt())
                .estimatedServiceTime(estServiceTime)
                .statusMessageEn(msgEn)
                .statusMessageHi(msgHi)
                .build();
    }
}
