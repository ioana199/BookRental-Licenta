package com.bookrental.app.mapper;

import com.bookrental.app.dto.ReservationRequestDTO;
import com.bookrental.app.dto.ReservationResponseDTO;
import com.bookrental.app.entities.Reservation;

public class ReservationMapper {
    public static Reservation mapReservationRequestDTO2Reservation(ReservationRequestDTO reservationRequestDTO) {
        Reservation reservation = new Reservation();

        reservation.setStartDate(reservationRequestDTO.getStartDate());
        reservation.setEndDate(reservationRequestDTO.getEndDate());

        return reservation;
    }

    public static ReservationResponseDTO mapReservation2ReservationResponseDTO(Reservation reservation) {
        ReservationResponseDTO reservationResponseDTO = new ReservationResponseDTO();

        reservationResponseDTO.setId(reservation.getId());
        reservationResponseDTO.setStartDate(reservation.getStartDate());
        reservationResponseDTO.setEndDate(reservation.getEndDate());
        reservationResponseDTO.setUserId(reservation.getUser().getId());
        reservationResponseDTO.setStatus(reservation.getStatus());
        reservationResponseDTO.setExemplaryId(reservation.getExemplary().getId());
        reservationResponseDTO.setBookName(reservation.getExemplary().getBook().getTitle());
        reservationResponseDTO.setUserFirstName(reservation.getUser().getFirstName());
        reservationResponseDTO.setUserLastName(reservation.getUser().getLastName());

        return reservationResponseDTO;
    }
}
