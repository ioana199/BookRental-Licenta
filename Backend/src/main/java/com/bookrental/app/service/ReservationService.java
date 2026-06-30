package com.bookrental.app.service;

import com.bookrental.app.dto.BookResponseDTO;
import com.bookrental.app.entities.*;
import com.bookrental.app.enums.StatusReservation;
import com.bookrental.app.repository.*;
import com.sun.codemodel.JForEach;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.OptimisticLockException;
import jakarta.transaction.SystemException;
import jakarta.ws.rs.NotFoundException;
import org.keycloak.jose.jwk.JWK;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    private final LibrarianRepository librarianRepository;

    public ReservationService(ReservationRepository reservationRepository,
                              ExemplaryRepository exemplaryRepository,
                              UserRepository userRepository,
                              EmailService emailService, LibrarianRepository librarianRepository) {
        this.reservationRepository = reservationRepository;
        this.exemplaryRepository = exemplaryRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
        this.librarianRepository = librarianRepository;
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
        try {
            List<Exemplary> exemplars = exemplaryRepository.findAvailableExemplar(bookId, libraryId, startDate, endDate, LocalDate.now().plusDays(1));
            if (exemplars.isEmpty()) {
                throw new NotFoundException("No books available, try again later.");
            }

            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + userId));

            Reservation reservation = new Reservation();
            reservation.setExemplary(exemplars.getFirst());
            reservation.setStartDate(startDate);
            reservation.setEndDate(endDate);
            reservation.setUser(user);
            reservation.setStatus(StatusReservation.PENDING);

            reserveMail(user.getEmail(), reservation);
            updateContor(reservation);
            return reservationRepository.save(reservation);
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
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

    @Async
    private void reserveMail(String email, Reservation reservation) {
        String subject = "Reservation Confirmation";
        String body = "Dear " + reservation.getUser().getFirstName()
                + "\nThank you for using our service. This email confirms that your reservation has been successfully processed.\n"
                + "\nReservation Details: "
                + "\nBook Title: " + reservation.getExemplary().getBook().getTitle()
                + "\nPick-up Library: "+ reservation.getExemplary().getLibrary().getName()
                + "\nLocation: " +reservation.getExemplary().getLibrary().getCity()
                + "\n\nPlease ensure you pick up your copy within the allotted timeframe.\n" + "\n"
                + "Best regards,\n"
                + "The Book Rental Team";
        emailService.sendEmail(email, subject, body);
    }

    @Async
    private void updateContor(Reservation reservation) {
        Integer contorVechi = reservation.getExemplary().getBook().getContorRezervari();
        if (contorVechi == null) contorVechi = 0;
        reservation.getExemplary().getBook().setContorRezervari(++contorVechi);
    }

    @Transactional
    public List<Reservation> getAll() {
        return reservationRepository.findAll();
    }

    @Transactional
    public List<Reservation> getByUserId(Long userId) {
        try {
            return reservationRepository.findAllByUserId(userId);
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }

    @Transactional
    public List<Reservation> getReservationsForLibrarian(String email) {
        Librarian librarian = librarianRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("Bibliotecarul nu a fost găsit."));
        Long libraryId = librarian.getLibrary().getId();
        return reservationRepository.findAll().stream()
                .filter(r -> r.getExemplary() != null
                        && r.getExemplary().getLibrary() != null
                        && libraryId.equals(r.getExemplary().getLibrary().getId()))
                .toList();
    }
}
