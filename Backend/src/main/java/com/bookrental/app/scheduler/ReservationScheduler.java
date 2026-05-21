package com.bookrental.app.scheduler;

import ch.qos.logback.core.encoder.EchoEncoder;
import com.bookrental.app.dto.LibrarianDTO;
import com.bookrental.app.entities.Book;
import com.bookrental.app.entities.Reservation;
import com.bookrental.app.entities.User;
import com.bookrental.app.entities.Wishlist;
import com.bookrental.app.enums.StatusReservation;
import com.bookrental.app.repository.ReservationRepository;
import com.bookrental.app.repository.UserRepository;
import com.bookrental.app.repository.WishlistRepository;
import com.bookrental.app.service.EmailService;
import com.bookrental.app.service.ReservationService;
import jakarta.transaction.Transactional;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Component
public class ReservationScheduler {
    private final ReservationRepository reservationRepository;
    private final EmailService emailService;
    private final ReservationService reservationService;
    private final WishlistRepository wishlistRepository;
    private final UserRepository userRepository;

    public ReservationScheduler(ReservationRepository reservationRepository, EmailService emailService, ReservationService reservationService, WishlistRepository wishlistRepository, UserRepository userRepository) {
        this.reservationRepository = reservationRepository;
        this.emailService = emailService;
        this.reservationService = reservationService;
        this.wishlistRepository = wishlistRepository;
        this.userRepository = userRepository;
    }

    @Scheduled(fixedRate = 5000)
    public void scheduled() {
        System.out.println("Hello from my scheduled");
    }

    @Scheduled(cron = "0 * * * * *")
    public void scheduledCron() {
        System.out.println("Hello from my scheduled with cron!");
    }

    @Transactional
    @Scheduled(cron = "0 0 1 * * *")
    public void notificationForPending() {
        List<Reservation> reservationsPending = reservationRepository.findByStatusAndStartDate(StatusReservation.PENDING, LocalDate.now().minusDays(1));

        for (Reservation r : reservationsPending) {
            String to = r.getUser().getEmail();
            String subject = "Friendly reminder: Your requested book is ready for pickup!";
            String body = "Dear " + r.getUser().getFirstName() + ", This is a quick reminder that the book you requested, " + r.getExemplary().getBook().getTitle() + ", is waiting for you at the library " + r.getExemplary().getLibrary().getName();
            emailService.sendEmail(to, subject, body);
        }
    }

    @Transactional
    @Scheduled(cron = "0 0 2 * * *")
    public void setStatusCanceledFromPending() {
        List<Reservation> reservationsPending = reservationRepository.findByStatusAndStartDate(StatusReservation.PENDING, LocalDate.now().minusDays(3));

        for (Reservation r : reservationsPending) {
            r.setStatus(StatusReservation.CANCELED);
            reservationRepository.save(r);

            String to = r.getUser().getEmail();
            String subject = "Friendly reminder: Your requested book is ready for pickup!";
            String body = "Dear " + r.getUser().getFirstName() + ", This is a quick reminder that the book you requested, " + r.getExemplary().getBook().getTitle() + ", is waiting for you at the library " + r.getExemplary().getLibrary().getName();
            emailService.sendEmail(to, subject, body);
        }
    }

    @Transactional
    @Scheduled(cron = "0 0 20 * * *")
    public void setStatusDelayed() {
        List<Reservation> reservationsInProgress = reservationRepository.findByStatusAndEndDate(StatusReservation.IN_PROGRESS, LocalDate.now());

        for (Reservation r : reservationsInProgress) {
            r.setStatus(StatusReservation.DELAYED);
            reservationRepository.save(r);

            String to = r.getUser().getEmail();
            String subject = "Friendly Reminder: Overdue Book Return";
            String body = "Dear " + r.getUser().getFirstName() + ", We hope you enjoyed your reading! This is a quick reminder that the book " + r.getExemplary().getBook().getTitle() + ", which you borrowed from " + r.getExemplary().getLibrary().getName() + ", is currently past its due date and has not yet been returned.";
            emailService.sendEmail(to, subject, body);
        }
    }

    @Transactional
    @Scheduled(cron = "0 15 20 * * *")
    public void resolveConflictsForDelayedItems() {
        List<Reservation> reservationsPending = reservationRepository.findByStatusAndStartDate(StatusReservation.PENDING, LocalDate.now().plusDays(1));
        for (Reservation r : reservationsPending) {
            List<Reservation> reservationsOfExemplary = r.getExemplary().getReservations();
            for (Reservation re : reservationsOfExemplary) {
                if (re.getStatus().equals(StatusReservation.DELAYED)) {
                    r.setStatus(StatusReservation.CANCELED);
                    reservationRepository.save(r);

                    Reservation newReservation = reservationService.create(re.getExemplary().getBook().getId(), re.getExemplary().getLibrary().getId(), re.getStartDate(), re.getEndDate(), re.getUser().getId());

                    if (newReservation == null) {
                        String to = r.getUser().getEmail();
                        String subject = "Important update regarding your reservation";
                        String body = "Dear " + r.getUser().getFirstName() + ", We are writing to inform you about an issue with your upcoming reservation for the book " + r.getExemplary().getBook().getTitle() + ", scheduled to begin tomorrow. Unfortunately, the previous borrower has not yet returned the specific copy reserved for you. We automatically tried to rebook another copy of the same book for your dates, but there are currently no other copies available at " + r.getExemplary().getLibrary().getName() + ". Please check back in a few days to place a new reservation once the book is returned.";
                        emailService.sendEmail(to, subject, body);
                    }
                    break;
                }
            }
        }
    }

    @Transactional
    @Scheduled(cron = "0 0 10 1 * *")
    @Scheduled(cron = "0 0 10 8 * *")
    @Scheduled(cron = "0 0 10 15 * *")
    @Scheduled(cron = "0 0 10 22 * *")
    @Scheduled(cron = "0 0 10 28 * *")
    public void reminderBooksInWishlist() {
        List<User> users = userRepository.findAll().stream().filter(user -> user.getWishlists() != null).toList();
        List<Book> books = new ArrayList<>();
        for (User user : users) {
            List<Wishlist> wishlists = wishlistRepository.findByUserIdAndDateIsBefore(user.getId(), LocalDate.now().minusDays(7));
            for (Wishlist wishlist : wishlists) {
                books.add(wishlist.getBook());
            }
            String to = user.getEmail();
            String subject = "Reminder about wishlist";
            String body = "Dear " + user.getFirstName() + ", We are writing to inform you about your books from wishlist: " + books;
            emailService.sendEmail(to, subject, body);
        }
    }


}
