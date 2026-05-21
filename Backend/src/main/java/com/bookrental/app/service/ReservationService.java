package com.bookrental.app.service;

import com.bookrental.app.dto.BookResponseDTO;
import com.bookrental.app.entities.*;
import com.bookrental.app.enums.StatusReservation;
import com.bookrental.app.repository.*;
import com.sun.codemodel.JForEach;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.OptimisticLockException;
import jakarta.transaction.SystemException;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;
import org.keycloak.jose.jwk.JWK;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Optional;

@Service
public class ReservationService {
    private final ReservationRepository reservationRepository;
    private final ExemplaryRepository exemplaryRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    public ReservationService(ReservationRepository reservationRepository, ExemplaryRepository exemplaryRepository, UserRepository userRepository, EmailService emailService) {
        this.reservationRepository = reservationRepository;
        this.exemplaryRepository = exemplaryRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    /*
    @Transactional
    public Reservation create(Reservation reservation, Long bookId, Long libraryId, Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        Library library = libraryRepository.findById(libraryId).orElseThrow();
        Book book = bookRepository.findById(bookId).orElseThrow();

        reservation.setUser(user);

        List<Exemplary> allExemplaries = exemplaryRepository.findByBookAndLibrary(book, library);

        if (reservation.getEndDate().isBefore(reservation.getStartDate())) {
            throw new IllegalArgumentException("End date is invalid");
        }

        if (reservation.getStartDate().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Start is invalid");
        }

        for (Exemplary e : allExemplaries) {
            boolean disponibilInProgress = false;
            boolean disponibilPending = false;
            boolean disponibilDelayed = false;


            List<Reservation> allReservations = reservationRepository.findAllByExemplaryId(e.getId());

            List<Reservation> reservationsPending = allReservations.stream().filter(r -> r.getStatus().equals(StatusReservation.PENDING)).toList();
            List<Reservation> reservationsInProgress = allReservations.stream().filter(r -> r.getStatus().equals(StatusReservation.IN_PROGRESS)).toList();
            List<Reservation> reservationsDelayed = allReservations.stream().filter(r -> r.getStatus().equals(StatusReservation.DELAYED)).toList();


            reservation.setExemplary(e);
            e.setLastUpdate(LocalDateTime.now());
            exemplaryRepository.save(e);

            if (reservation.getStartDate().equals(LocalDate.now())) {
                reservation.setStatus(StatusReservation.IN_PROGRESS);
            } else {
                reservation.setStatus(StatusReservation.PENDING);
            }

            if (allReservations.isEmpty()) {
                reserveMail(user.getEmail(), book.getTitle());
                return reservationRepository.save(reservation);
            }

            if (reservationsInProgress.isEmpty()) {
                disponibilInProgress = true;
            } else {
                for (Reservation r : reservationsInProgress) {
                    if (reservation.getStartDate().isAfter(r.getEndDate())) {
                        disponibilInProgress = true;
                        break;
                    }
                }
            }

            if (reservationsPending.isEmpty()) {
                disponibilPending = true;
            } else {
                for (Reservation r : reservationsPending) {
                    if (reservation.getEndDate().isBefore(r.getStartDate()) || reservation.getStartDate().isAfter(r.getEndDate())) {
                        disponibilPending = true;
                    } else {
                        disponibilPending = false;
                        break;
                    }
                }
            }

            if (reservationsDelayed.isEmpty()) {
                disponibilDelayed = true;
            }

            System.out.println("1: " + disponibilInProgress + " 2: " + disponibilPending);

            if (disponibilInProgress && disponibilPending && disponibilDelayed) {
                reserveMail(user.getEmail(), book.getTitle());
                return reservationRepository.save(reservation);
            }
        }
        throw new NotFoundException("Rezervarea nu a putut fi creata");
    }
    */

    @Transactional
    public Reservation create(Long bookId, Long libraryId, LocalDate startDate, LocalDate endDate, Long userId) {

        List<Exemplary> exemplars = exemplaryRepository.findAvailableExemplar(bookId, libraryId, startDate, endDate);
        if (exemplars.isEmpty()) {
            throw new NotFoundException("No books available, try again later.");//sau return null
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + userId));

        Reservation reservation = new Reservation();
        reservation.setExemplary(exemplars.getFirst());
        reservation.setStartDate(startDate);
        reservation.setEndDate(endDate);
        reservation.setUser(user);
        reservation.setStatus(StatusReservation.PENDING);


        reserveMail(user.getEmail());
        updateContor(reservation);
        return reservationRepository.save(reservation);
    }

    public Reservation updateReservationStatus(Long reservationId, StatusReservation newStatus) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new NotFoundException("Reservation not found!"));

        StatusReservation currentStatus = reservation.getStatus();

        if (currentStatus.isNextStatePossible(newStatus)) {
            reservation.setStatus(newStatus);
            return reservationRepository.save(reservation);
        } else {
            throw new IllegalStateException("Nu se poate schimba statusul din " + currentStatus + " în " + newStatus);
        }
    }

    private void reserveMail(String email) {
        String subject = "Book Rental Reservation";
        String body = "We announce that the reservation was recieved";
        emailService.sendEmail(email, subject, body);
    }

    private void updateContor(Reservation reservation) {
        int contorVechi = reservation.getExemplary().getBook().getContorRezervari();
        reservation.getExemplary().getBook().setContorRezervari(++contorVechi);
    }
}
