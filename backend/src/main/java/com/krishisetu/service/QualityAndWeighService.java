package com.krishisetu.service;

import com.krishisetu.dto.QualityAssayRequest;
import com.krishisetu.dto.WeighRecordRequest;
import com.krishisetu.entity.*;
import com.krishisetu.entity.enums.BookingStatus;
import com.krishisetu.entity.enums.PaymentStatus;
import com.krishisetu.entity.enums.QualityGrade;
import com.krishisetu.exception.BusinessRuleException;
import com.krishisetu.exception.ResourceNotFoundException;
import com.krishisetu.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class QualityAndWeighService {

    private final BookingRepository bookingRepository;
    private final ProcurementRecordRepository recordRepository;
    private final QualityCheckRepository qualityCheckRepository;
    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Transactional
    public ProcurementRecord recordGrossWeight(WeighRecordRequest.GrossWeigh req) {
        Long bookingId = req.getBookingId();
        if (bookingId == null) {
            throw new BusinessRuleException("Booking ID must not be null");
        }
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found: " + bookingId));

        Long operatorId = req.getWeighbridgeOperatorId();
        User operator = operatorId != null ?
                userRepository.findById(operatorId).orElse(null) : null;

        ProcurementRecord record = recordRepository.findByBookingId(booking.getId())
                .orElse(ProcurementRecord.builder()
                        .booking(booking)
                        .appliedMspRate(booking.getCrop().getMspRatePerQuintal())
                        .build());

        record.setGrossWeightKg(req.getGrossWeightKg());
        if (req.getBagsCount() != null) {
            record.setBagsCount(req.getBagsCount());
        }
        record.setWeighbridgeOperator(operator);

        record = recordRepository.save(record);

        booking.setStatus(BookingStatus.QUALITY_CHECK);
        bookingRepository.save(booking);

        notificationService.sendFarmerNotification(
                booking.getFarmer().getUser(),
                booking,
                "सकल वजन दर्ज / Gross Weight Recorded",
                String.format("सकल वजन: %s किग्रा दर्ज किया गया। कृपया गुणवत्ता जांच लैब में नमूना दें।", req.getGrossWeightKg()),
                booking.getFarmer().getUser().getPreferredLanguage()
        );

        return record;
    }

    @Transactional
    public QualityCheck recordQualityAssay(QualityAssayRequest req) {
        Long bookingId = req.getBookingId();
        if (bookingId == null) {
            throw new BusinessRuleException("Booking ID must not be null");
        }
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found: " + bookingId));

        ProcurementRecord record = recordRepository.findByBookingId(booking.getId())
                .orElseThrow(() -> new BusinessRuleException("Gross weight must be recorded before quality assay"));

        Crop crop = booking.getCrop();
        boolean passedMoisture = req.getMoisturePercentage().compareTo(crop.getMaxMoisturePercentage()) <= 0;
        boolean passedForeign = req.getForeignMatterPercentage().compareTo(crop.getMaxForeignMatterPercentage()) <= 0;
        boolean isApproved = (req.getIsApproved() != null) ? req.getIsApproved() : (passedMoisture && passedForeign);

        QualityGrade grade = req.getQualityGrade() != null ? req.getQualityGrade() :
                (isApproved ? QualityGrade.FAQ_STANDARD : QualityGrade.REJECTED);

        Long officerId = req.getAssayedByOfficerId();
        User officer = officerId != null ?
                userRepository.findById(Objects.requireNonNull(officerId)).orElse(null) : booking.getFarmer().getUser();

        String barcode = req.getSampleBarcode() != null ? req.getSampleBarcode() : "SMP-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        QualityCheck qualityCheck = qualityCheckRepository.findByProcurementRecordId(record.getId())
                .orElse(QualityCheck.builder()
                        .procurementRecord(record)
                        .build());

        qualityCheck.setSampleBarcode(barcode);
        qualityCheck.setMoisturePercentage(req.getMoisturePercentage());
        qualityCheck.setForeignMatterPercentage(req.getForeignMatterPercentage());
        qualityCheck.setBrokenGrainsPercentage(req.getBrokenGrainsPercentage() != null ? req.getBrokenGrainsPercentage() : BigDecimal.ZERO);
        qualityCheck.setImmatureShriveledPercentage(req.getImmatureShriveledPercentage() != null ? req.getImmatureShriveledPercentage() : BigDecimal.ZERO);
        qualityCheck.setQualityGrade(grade);
        qualityCheck.setIsApproved(isApproved);
        qualityCheck.setRejectionReason(req.getRejectionReason());
        qualityCheck.setAssayedByOfficer(officer);

        qualityCheck = qualityCheckRepository.save(qualityCheck);

        if (isApproved) {
            booking.setStatus(BookingStatus.ACCEPTED);
            notificationService.sendFarmerNotification(
                    booking.getFarmer().getUser(),
                    booking,
                    "गुणवत्ता स्वीकृत / Quality Approved (" + grade.name() + ")",
                    String.format("नमी: %s%% (मानक: %s%%). फसल खरीद हेतु स्वीकृत। अनलोडिंग के लिए आगे बढ़ें।",
                            req.getMoisturePercentage(), crop.getMaxMoisturePercentage()),
                    booking.getFarmer().getUser().getPreferredLanguage()
            );
        } else {
            booking.setStatus(BookingStatus.REJECTED);
            notificationService.sendFarmerNotification(
                    booking.getFarmer().getUser(),
                    booking,
                    "गुणवत्ता अस्वीकृत / Quality Rejected",
                    String.format("नमी %s%% अधिक है। कारण: %s", req.getMoisturePercentage(), req.getRejectionReason()),
                    booking.getFarmer().getUser().getPreferredLanguage()
            );
        }

        bookingRepository.save(booking);
        return qualityCheck;
    }

    @Transactional
    public ProcurementRecord recordTareWeightAndFinalize(WeighRecordRequest.TareWeigh req) {
        Long bookingId = req.getBookingId();
        if (bookingId == null) {
            throw new BusinessRuleException("Booking ID must not be null");
        }
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found: " + bookingId));

        ProcurementRecord record = recordRepository.findByBookingId(booking.getId())
                .orElseThrow(() -> new BusinessRuleException("Gross weigh record missing for booking: " + req.getBookingId()));

        BigDecimal tare = req.getTareWeightKg();
        BigDecimal gross = record.getGrossWeightKg();
        if (tare.compareTo(gross) >= 0) {
            throw new BusinessRuleException("Tare weight cannot be greater than or equal to Gross weight");
        }

        BigDecimal netKg = gross.subtract(tare);
        BigDecimal netQuintals = netKg.divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        BigDecimal mspRate = record.getAppliedMspRate();
        BigDecimal totalAmount = netQuintals.multiply(mspRate).setScale(2, RoundingMode.HALF_UP);

        String jForm = "JFORM-" + LocalDateTime.now().getYear() + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        record.setTareWeightKg(tare);
        record.setNetWeightKg(netKg);
        record.setNetWeightQuintals(netQuintals);
        record.setTotalProcurementAmount(totalAmount);
        record.setJFormReceiptNumber(jForm);

        record = recordRepository.save(record);

        booking.setStatus(BookingStatus.PAYMENT_PROCESSING);
        bookingRepository.save(booking);

        // Initiate DBT Payment Record
        Farmer farmer = booking.getFarmer();
        Payment payment = Payment.builder()
                .booking(booking)
                .farmer(farmer)
                .grossAmount(totalAmount)
                .statutoryDeductions(BigDecimal.ZERO)
                .netPayableAmount(totalAmount)
                .paymentMode("DBT_PFMS")
                .bankAccountNumber(farmer.getBankAccountNumber())
                .bankIfsc(farmer.getBankIfsc())
                .pfmsTransactionId("PFMS-" + UUID.randomUUID().toString().substring(0, 12).toUpperCase())
                .bankUtrNumber("UTR" + UUID.randomUUID().toString().substring(0, 10).toUpperCase())
                .paymentStatus(PaymentStatus.PROCESSING)
                .build();
        paymentRepository.save(Objects.requireNonNull(payment));

        notificationService.sendFarmerNotification(
                farmer.getUser(),
                booking,
                "J-Form रसीद जारी / J-Form Generated: " + jForm,
                String.format("शुद्ध वजन: %s क्विंटल। कुल राशि: ₹%s। DBT भुगतान भेजा जा रहा है।", netQuintals, totalAmount),
                farmer.getUser().getPreferredLanguage()
        );

        return record;
    }
}
