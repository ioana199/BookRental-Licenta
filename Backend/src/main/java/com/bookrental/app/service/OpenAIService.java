package com.bookrental.app.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class OpenAIService {

    @Value("${openai.api.key}")
    private String openaiApiKey;

    @Value("${openai.api.url}")
    private String openaiApiUrl;

    public String generateSummary(String title, String authorFirstName, String authorLastName) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(openaiApiKey);

            String prompt = "Scrie un rezumat scurt (maxim 3 propoziții) în limba română pentru cartea \""
                    + title + "\" de " + authorFirstName + " " + authorLastName
                    + ". Rezumatul trebuie să fie informativ și să prezinte ideea principală a cărții.";

            String requestBody = "{"
                    + "\"model\": \"gpt-4o-mini\","
                    + "\"messages\": [{\"role\": \"user\", \"content\": \""
                    + prompt.replace("\"", "\\\"").replace("\n", "\\n")
                    + "\"}],"
                    + "\"temperature\": 0.7,"
                    + "\"max_tokens\": 200"
                    + "}";

            HttpEntity<String> request = new HttpEntity<>(requestBody, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(openaiApiUrl, request, String.class);

            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response.getBody());
            return root.path("choices").get(0)
                    .path("message").path("content").asText();

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}