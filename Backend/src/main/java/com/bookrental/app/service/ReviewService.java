package com.bookrental.app.service;

import com.bookrental.app.entities.*;
import com.bookrental.app.enums.StatusReservation;
import com.bookrental.app.repository.LibraryRepository;
import com.bookrental.app.repository.ReservationRepository;
import com.bookrental.app.repository.ReviewRepository;
import com.bookrental.app.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ReviewService {
    private final ReviewRepository reviewRepository;
    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;
    private final LibraryRepository libraryRepository;

    public ReviewService(ReviewRepository reviewRepository, ReservationRepository reservationRepository, UserRepository userRepository, LibraryRepository libraryRepository) {
        this.reviewRepository = reviewRepository;
        this.reservationRepository = reservationRepository;
        this.userRepository = userRepository;
        this.libraryRepository = libraryRepository;
    }

    @Transactional
    public Review create(Review review, Long libraryId, Long userId) {
        User foundUser = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + userId));

        Library foundLibrary = libraryRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Library not found with id: " + libraryId));

        if (reservationRepository.findAllByUserIdAndStatus(userId, StatusReservation.FINISHED) == null) {
            throw new IllegalArgumentException("You don't have any finished reservations");
        }

        review.setUser(foundUser);
        review.setLibrary(foundLibrary);

        updateRating(foundLibrary, review);
        return reviewRepository.save(review);
    }

    public Page<Review> paginate(Pageable pageable) {
        return reviewRepository.findAll(pageable);
    }

    public Page<Review> getAll(Pageable pageable) {
        Review review = new Review();
        Example<Review> exampleReview = Example.of(review);
        return reviewRepository.findAll(exampleReview, pageable);
    }

    public void delete(Long reviewId, Long userId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new EntityNotFoundException("Review not found with id: " + reviewId));

        if (userId != review.getUser().getId()) {
            throw new IllegalArgumentException("This review isn't yours. You can't delete it.");
        }

        reviewRepository.delete(review);
    }

    private void updateRating(Library library, Review review) {
        float ratingVechi = library.getMedieRating();
        int nrRatings = library.getReviews().size() + 1;
        float ratingNou = ratingVechi + review.getRating();

        library.setMedieRating(ratingNou / nrRatings);
    }
}
