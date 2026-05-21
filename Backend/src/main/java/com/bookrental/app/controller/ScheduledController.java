package com.bookrental.app.controller;

import com.bookrental.app.dto.UserResponseDTO;
import com.bookrental.app.entities.User;
import com.bookrental.app.mapper.UserMapper;
import com.bookrental.app.scheduler.ReservationScheduler;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/scheduled")
public class ScheduledController {
    private final ReservationScheduler reservationScheduler;

    public ScheduledController(ReservationScheduler reservationScheduler) {
        this.reservationScheduler = reservationScheduler;
    }

    @GetMapping("/1")
    public ResponseEntity<?> get1() {
        reservationScheduler.notificationForPending();
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/2")
    public ResponseEntity<?> get2() {
        reservationScheduler.setStatusCanceledFromPending();
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/3")
    public ResponseEntity<?> get3() {
        reservationScheduler.setStatusDelayed();
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/4")
    public ResponseEntity<?> get4() {
        reservationScheduler.resolveConflictsForDelayedItems();
        return ResponseEntity.noContent().build();
    }


}
