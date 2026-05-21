package com.bookrental.app.mapper;

import com.bookrental.app.dto.ReviewRequestDTO;
import com.bookrental.app.dto.ReviewResponseDTO;
import com.bookrental.app.entities.Review;

public class ReviewMapper {
    public static Review mapReviewDTO2Review(ReviewRequestDTO reviewRequestDTO) {
        Review review = new Review();

        review.setDescription(reviewRequestDTO.getDescription());
        review.setRating(reviewRequestDTO.getRating());

        return review;
    }

    public static ReviewResponseDTO mapReview2ReviewDTO(Review review) {
        ReviewResponseDTO reviewResponseDTO = new ReviewResponseDTO();

        reviewResponseDTO.setId(review.getId());
        reviewResponseDTO.setDescription(review.getDescription());
        reviewResponseDTO.setRating(review.getRating());
        reviewResponseDTO.setUserFirstName(review.getUser().getFirstName());
        reviewResponseDTO.setLibraryName(review.getLibrary().getName());

        return reviewResponseDTO;
    }
}
