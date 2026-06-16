package com.bookrental.app.controller;

import com.bookrental.app.service.RecommendationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/recommendations")
public class RecommendationController {
    private final RecommendationService recommendationService;

    public RecommendationController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_realm_user')")
    public ResponseEntity<List<Map<String, String>>> getRecommendations(Principal principal) {
        List<Map<String, String>> recommendations = recommendationService
                .getRecommendations(Long.parseLong(principal.getName()));
        return ResponseEntity.ok(recommendations);
    }
}
