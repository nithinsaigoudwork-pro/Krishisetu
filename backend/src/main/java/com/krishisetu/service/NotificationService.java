package com.krishisetu.service;

import com.krishisetu.entity.Booking;
import com.krishisetu.entity.Notification;
import com.krishisetu.entity.User;
import com.krishisetu.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Transactional
    public void sendFarmerNotification(User user, Booking booking, String title, String message, String languageCode) {
        Notification notification = Objects.requireNonNull(Notification.builder()
                .user(user)
                .booking(booking)
                .title(title)
                .message(message)
                .channel("PUSH")
                .languageCode(languageCode != null ? languageCode : "hi")
                .isSent(true)
                .isRead(false)
                .build());
        notificationRepository.save(notification);

        // Push via WebSocket to farmer's private topic
        try {
            messagingTemplate.convertAndSend("/topic/farmer/" + user.getId(), notification);
        } catch (Exception e) {
            log.warn("WebSocket push to farmer failed: {}", e.getMessage());
        }
    }

    public void broadcastQueueUpdate(Long centerId, Object queueData) {
        if (queueData == null) {
            log.warn("Null queue data for center {}, skipping broadcast", centerId);
            return;
        }
        try {
            messagingTemplate.convertAndSend("/topic/queue/" + centerId, queueData);
        } catch (Exception e) {
            log.warn("WebSocket broadcast to center {} failed: {}", centerId, e.getMessage());
        }
    }

    public List<Notification> getUnreadNotifications(Long userId) {
        return notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);
    }
}
