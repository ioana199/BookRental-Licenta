package com.bookrental.app.repository;

import com.bookrental.app.entities.Publisher;
import com.bookrental.app.entities.Reservation;
import com.bookrental.app.enums.StatusReservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    //List<Reservation> findAllByExemplary_Id(Long id);

    List<Reservation> findAllByExemplaryIdAndStatusPENDING(Long id, StatusReservation statusReservation);

    List<Reservation> findAllByExemplaryId(Long id);

    List<Reservation> findByStatusAndStartDate(StatusReservation statusReservation, LocalDate localDate);

    List<Reservation> findByStatusAndEndDate(StatusReservation statusReservation, LocalDate now);

    List<Reservation> findAllByUserIdAndStatus(Long userId, StatusReservation statusReservation);
    List<Reservation> findAllByUserId(Long userId);
}
