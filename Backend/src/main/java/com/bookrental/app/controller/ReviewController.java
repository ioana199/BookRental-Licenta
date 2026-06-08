package com.bookrental.app.controller;

import com.bookrental.app.dto.ReviewRequestDTO;
import com.bookrental.app.dto.ReviewResponseDTO;
import com.bookrental.app.dto.WishlistRequestDTO;
import com.bookrental.app.dto.WishlistResponseDTO;
import com.bookrental.app.entities.Review;
import com.bookrental.app.entities.Wishlist;
import com.bookrental.app.mapper.ReviewMapper;
import com.bookrental.app.mapper.WishlistMapper;
import com.bookrental.app.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDate;

@RestController
@RequestMapping("/review")
public class ReviewController {
    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping("/{libraryId}")
    @PreAuthorize("hasAuthority('ROLE_realm_user')")
    public ResponseEntity<ReviewResponseDTO> create(@Valid @RequestBody ReviewRequestDTO reviewRequestDTO,
                                                    @PathVariable Long libraryId,
                                                    Principal principal) {
        Review reviewToCreate = ReviewMapper.mapReviewDTO2Review(reviewRequestDTO);
        Review createdReview = reviewService.create(reviewToCreate, libraryId, Long.parseLong(principal.getName()));
        ReviewResponseDTO reviewResponseDTO = ReviewMapper.mapReview2ReviewDTO(createdReview);

        return ResponseEntity.status(201).body(reviewResponseDTO);
    }

    @GetMapping("/getAll/{libraryId}")
    public ResponseEntity<Page<ReviewResponseDTO>> getAll(
            @PathVariable Long libraryId,
            @RequestParam(required = false, name = "page", defaultValue = "1") Integer page,
            @RequestParam(required = false, name = "size", defaultValue = "5") Integer size,
            @RequestParam(required = false, name = "sortBy", defaultValue = "id") String sortBy) {
        page -= 1;
        return ResponseEntity.status(200).body(reviewService
                .getAll(libraryId, PageRequest.of(page, size, Sort.by(sortBy)))
                .map(ReviewMapper::mapReview2ReviewDTO));
    }

    @DeleteMapping("/{reviewId}")
    @PreAuthorize("hasAuthority('ROLE_realm_user')")
    public ResponseEntity<?> delete(@PathVariable Long reviewId,
                                    Principal principal) {
        reviewService.delete(reviewId, Long.parseLong(principal.getName()));
        return ResponseEntity.noContent().build();
    }
}
