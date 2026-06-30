package com.bookrental.app.service;

import com.bookrental.app.entities.Book;
import com.bookrental.app.entities.Reservation;
import com.bookrental.app.entities.Wishlist;
import com.bookrental.app.repository.BookRepository;
import com.bookrental.app.repository.ReservationRepository;
import com.bookrental.app.repository.WishlistRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class RecommendationService {

    @Value("${openai.api.key}")
    private String openaiApiKey;

    @Value("${openai.api.url}")
    private String openaiApiUrl;

    private final ReservationRepository reservationRepository;
    private final WishlistRepository wishlistRepository;
    private final BookRepository bookRepository;

    public RecommendationService(ReservationRepository reservationRepository,
                                 WishlistRepository wishlistRepository,
                                 BookRepository bookRepository) {
        this.reservationRepository = reservationRepository;
        this.wishlistRepository = wishlistRepository;
        this.bookRepository = bookRepository;
    }

    @Transactional
    public List<Map<String, String>> getRecommendations(Long userId) {
        List<Reservation> reservations = reservationRepository.findAllByUserId(userId);
        List<String> reservedBooks = reservations.stream()
                .map(r -> r.getExemplary().getBook().getTitle() + " de " +
                        r.getExemplary().getBook().getAuthor().getFirstName() + " " +
                        r.getExemplary().getBook().getAuthor().getLastName())
                .distinct()
                .collect(Collectors.toList());

        List<Wishlist> wishlists = wishlistRepository.findByUserId(userId, org.springframework.data.domain.Pageable.unpaged()).getContent();
        List<String> favoriteBooks = wishlists.stream()
                .map(w -> w.getBook().getTitle())
                .collect(Collectors.toList());

        List<Book> allBooks = bookRepository.findAll();
        List<String> availableBooks = allBooks.stream()
                .map(b -> b.getTitle() + " de " +
                        (b.getAuthor() != null ? b.getAuthor().getFirstName() + " " + b.getAuthor().getLastName() : "autor necunoscut") +
                        (b.getGenres() != null && !b.getGenres().isEmpty() ? " (genuri: " + b.getGenres() + ")" : ""))
                .collect(Collectors.toList());

        if (reservedBooks.isEmpty() && favoriteBooks.isEmpty()) {
            return List.of(Map.of(
                    "title", "Nu avem suficiente date",
                    "reason", "Rezervează sau adaugă cărți la favorite pentru a primi recomandări personalizate!"
            ));
        }

        String prompt = "Ești un sistem de recomandare de cărți. " +
                "Utilizatorul a rezervat următoarele cărți: " + reservedBooks + ". " +
                "Utilizatorul are la favorite următoarele cărți: " + favoriteBooks + ". " +
                "Din lista de cărți disponibile în aplicație: " + availableBooks + ", " +
                "recomandă maximum 3 cărți pe care utilizatorul nu le-a rezervat și nu le are la favorite. " +
                "Răspunde DOAR în format JSON, fără text suplimentar, fără markdown, fără backticks. " +
                "Formatul exact trebuie să fie: " +
                "[{\"title\": \"titlul cartii\", \"reason\": \"S-ar putea să îți placă această carte deoarece...\"}]" +
                "Răspunsul trebuie să fie în limba română.";

        try {
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(openaiApiKey);

            String requestBody = "{"
                    + "\"model\": \"gpt-4o-mini\","
                    + "\"messages\": [{\"role\": \"user\", \"content\": \""
                    + prompt.replace("\"", "\\\"").replace("\n", "\\n")
                    + "\"}],"
                    + "\"temperature\": 0.7"
                    + "}";

            HttpEntity<String> request = new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(openaiApiUrl, request, String.class);

            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response.getBody());
            String text = root.path("choices").get(0)
                    .path("message").path("content").asText();

            text = text.trim();
            if (text.startsWith("```")) {
                text = text.replaceAll("```json", "").replaceAll("```", "").trim();
            }

            List<Map<String, String>> recommendations = mapper.readValue(text,
                    mapper.getTypeFactory().constructCollectionType(List.class, Map.class));

            for (Map<String, String> rec : recommendations) {
                String recTitle = normalize(rec.get("title"));
                allBooks.stream()
                        .filter(b -> normalize(b.getTitle()).equals(recTitle))
                        .findFirst()
                        .ifPresent(b -> {
                            rec.put("id", String.valueOf(b.getId()));
                            rec.put("title", b.getTitle()); // titlul canonic din baza de date
                            rec.put("imageUrl", b.getImageUrl() != null ? b.getImageUrl() : "");
                            rec.put("author", b.getAuthor().getFirstName() + " " + b.getAuthor().getLastName());
                        });
            }

            return recommendations;

        } catch (Exception e) {
            System.out.println("EROARE RECOMANDARI: " + e.getMessage());
            e.printStackTrace();
            return List.of(Map.of(
                    "title", "Eroare",
                    "reason", "Nu am putut genera recomandări în acest moment. Încearcă din nou!"
            ));
        }

    }

    private String normalize(String s) {
        if (s == null) return "";
        return java.text.Normalizer.normalize(s, java.text.Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")   // elimină diacriticele
                .toLowerCase()
                .trim();
    }
}