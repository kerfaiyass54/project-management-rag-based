package com.userskillsmanagement.usersandskillsmanagement.service;

import com.userskillsmanagement.usersandskillsmanagement.model.dto.RagAnalysisRequest;
import com.userskillsmanagement.usersandskillsmanagement.model.dto.RagEvaluationRequest;
import com.userskillsmanagement.usersandskillsmanagement.model.dto.RagFeedbackRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.Map;

@Service
public class RagGatewayServiceImpl implements RagGatewayService {
    private static final ParameterizedTypeReference<Map<String, Object>> RESPONSE_TYPE =
            new ParameterizedTypeReference<>() {};

    private final RestClient restClient;

    public RagGatewayServiceImpl(
            RestClient.Builder builder,
            @Value("${rag.api.base-url:http://localhost:7050}") String baseUrl
    ) {
        this.restClient = builder.baseUrl(baseUrl).build();
    }

    @Override
    public Map<String, Object> analyze(RagAnalysisRequest request) {
        return post("/analysis", request);
    }

    @Override
    public Map<String, Object> feedback(RagFeedbackRequest request) {
        return post("/feedback", request);
    }

    @Override
    public Map<String, Object> evaluate(RagEvaluationRequest request) {
        return post("/evaluation", request);
    }

    private Map<String, Object> post(String path, Object body) {
        Map<String, Object> response = restClient.post()
                .uri(path)
                .contentType(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .body(RESPONSE_TYPE);
        if (response == null) {
            throw new IllegalStateException("RAG service returned an empty response for " + path);
        }
        return response;
    }
}
