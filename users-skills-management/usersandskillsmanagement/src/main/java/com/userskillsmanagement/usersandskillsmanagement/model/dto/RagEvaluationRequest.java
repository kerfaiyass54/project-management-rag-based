package com.userskillsmanagement.usersandskillsmanagement.model.dto;

import java.util.List;

public record RagEvaluationRequest(
        String query,
        String answer,
        List<String> contexts,
        String referenceAnswer
) {
}
