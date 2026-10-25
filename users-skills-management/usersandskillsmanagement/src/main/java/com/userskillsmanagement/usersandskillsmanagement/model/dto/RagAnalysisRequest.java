package com.userskillsmanagement.usersandskillsmanagement.model.dto;

public record RagAnalysisRequest(
        String query,
        String conversationId,
        Integer topK,
        Long teamId
) {
}
