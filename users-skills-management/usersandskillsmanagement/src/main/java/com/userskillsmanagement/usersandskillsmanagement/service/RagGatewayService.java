package com.userskillsmanagement.usersandskillsmanagement.service;

import com.userskillsmanagement.usersandskillsmanagement.model.dto.RagAnalysisRequest;
import com.userskillsmanagement.usersandskillsmanagement.model.dto.RagEvaluationRequest;
import com.userskillsmanagement.usersandskillsmanagement.model.dto.RagFeedbackRequest;

import java.util.Map;

public interface RagGatewayService {
    Map<String, Object> analyze(RagAnalysisRequest request);

    Map<String, Object> feedback(RagFeedbackRequest request);

    Map<String, Object> evaluate(RagEvaluationRequest request);
}
