package com.bookrental.app.controller;

import com.bookrental.app.dto.ReservationRequestDTO;
import com.bookrental.app.dto.ReservationResponseDTO;
import com.bookrental.app.dto.UserRequestCreateDTO;
import com.bookrental.app.dto.UserResponseDTO;
import com.bookrental.app.entities.Reservation;
import com.bookrental.app.entities.User;
import com.bookrental.app.enums.StatusReservation;
import com.bookrental.app.mapper.ReservationMapper;
import com.bookrental.app.mapper.UserMapper;
import com.bookrental.app.repository.ReservationRepository;
import com.bookrental.app.service.ReservationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDate;

@RestController
@RequestMapping("/reservations")
public class ReservationController {
    private final ReservationService reservationService;

    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @PostMapping("/{bookId}/{libraryId}")
    public ResponseEntity<?> create(@Valid @RequestBody ReservationRequestDTO reservationRequestCreateDTO,
                                    @PathVariable Long bookId,
                                    @PathVariable Long libraryId,
                                    Principal principal) {
        Reservation reservationToCreate = ReservationMapper.mapReservationRequestDTO2Reservation(reservationRequestCreateDTO);
        LocalDate startDate = reservationToCreate.getStartDate();
        LocalDate endDate = reservationToCreate.getEndDate();

        Reservation createdReservation = reservationService.create(bookId, libraryId, startDate, endDate, Long.parseLong(principal.getName()));

        if (createdReservation == null) {
            String message = "Rezervarea nu a putut fi efectuata";
            return ResponseEntity.status(404).body(message);
        }

        ReservationResponseDTO reservationResponseDTO = ReservationMapper.mapReservation2ReservationResponseDTO(createdReservation);
        return ResponseEntity.status(201).body(reservationResponseDTO);
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAuthority('ROLE_realm_librarian')")
    public ResponseEntity<Reservation> updateStatus(@PathVariable Long id, @RequestParam StatusReservation newStatus) {
        Reservation updatedReservation = reservationService.updateReservationStatus(id, newStatus);

        return ResponseEntity.ok(updatedReservation);
    }
}
