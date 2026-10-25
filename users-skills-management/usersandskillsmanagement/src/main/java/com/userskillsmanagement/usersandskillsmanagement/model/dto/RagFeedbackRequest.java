package com.userskillsmanagement.usersandskillsmanagement.model.dto;

public record RagFeedbackRequest(
        String conversationId,
        String query,
        String answer,
        Integer rating,
        String correction
) {
}
