package com.krishisetu.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatResponse {
    private String replyText;
    private String language;
    private String toolUsed;
    private Object toolResultData;
    private List<String> suggestedFollowUpQuestions;
}
