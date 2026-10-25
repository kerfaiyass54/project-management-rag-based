package com.userskillsmanagement.usersandskillsmanagement.controller;

import com.userskillsmanagement.usersandskillsmanagement.model.dto.RagAnalysisRequest;
import com.userskillsmanagement.usersandskillsmanagement.model.dto.RagEvaluationRequest;
import com.userskillsmanagement.usersandskillsmanagement.model.dto.RagFeedbackRequest;
import com.userskillsmanagement.usersandskillsmanagement.service.RagGatewayService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/rag")
@RequiredArgsConstructor
public class RagController {
    private final RagGatewayService ragGatewayService;

    @PostMapping("/analysis")
    public ResponseEntity<Map<String, Object>> analyze(@Valid @RequestBody RagAnalysisRequest request) {
        return ResponseEntity.ok(ragGatewayService.analyze(request));
    }

    @PostMapping("/feedback")
    public ResponseEntity<Map<String, Object>> feedback(@Valid @RequestBody RagFeedbackRequest request) {
        return ResponseEntity.ok(ragGatewayService.feedback(request));
    }

    @PostMapping("/evaluation")
    public ResponseEntity<Map<String, Object>> evaluate(@Valid @RequestBody RagEvaluationRequest request) {
        return ResponseEntity.ok(ragGatewayService.evaluate(request));
    }
}
