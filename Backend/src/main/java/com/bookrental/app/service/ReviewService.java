package com.bookrental.app.service;

import com.bookrental.app.entities.*;
import com.bookrental.app.enums.StatusReservation;
import com.bookrental.app.repository.LibraryRepository;
import com.bookrental.app.repository.ReservationRepository;
import com.bookrental.app.repository.ReviewRepository;
import com.bookrental.app.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
        try {
            User foundUser = userRepository.findById(userId)
                    .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + userId));

            Library foundLibrary = libraryRepository.findById(libraryId)
                    .orElseThrow(() -> new EntityNotFoundException("Library not found with id: " + libraryId));

            List<Reservation> finishedReservations = reservationRepository
                    .findAllByUserIdAndStatus(userId, StatusReservation.FINISHED);

            System.out.println("Finished reservations: " + finishedReservations.size());

            boolean hasReservationAtLibrary = finishedReservations.stream()
                    .anyMatch(r -> r.getExemplary().getLibrary().getId().equals(libraryId));

            System.out.println("Has reservation at library: " + hasReservationAtLibrary);

            if (!hasReservationAtLibrary) {
                throw new IllegalArgumentException("Nu ai nicio rezervare finalizată la această bibliotecă!");
            }

            review.setUser(foundUser);
            review.setLibrary(foundLibrary);

            updateRating(foundLibrary, review);
            return reviewRepository.save(review);
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }

    public Page<Review> paginate(Pageable pageable) {
        return reviewRepository.findAll(pageable);
    }

    public Page<Review> getAll(Long libraryId, Pageable pageable) {
        return reviewRepository.findByLibraryId(libraryId, pageable);
    }

    public void delete(Long reviewId, Long userId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new EntityNotFoundException("Review not found with id: " + reviewId));

        if (userId != review.getUser().getId()) {
            throw new IllegalArgumentException("This review isn't yours. You can't delete it.");
        }

        reviewRepository.delete(review);
    }

    @Async
    private void updateRating(Library library, Review review) {
        Float ratingVechi = library.getMedieRating();
        if (ratingVechi == null) ratingVechi = 0f;
        int nrRatings = library.getReviews().size() + 1;
        float ratingNou = ratingVechi + review.getRating();
        library.setMedieRating(ratingNou / nrRatings);
    }
}
