package com.bookrental.app.dto.validation;

import com.bookrental.app.dto.ReservationRequestDTO;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.time.LocalDate;

public class InFutureDateValidator implements ConstraintValidator<DateInFuture, ReservationRequestDTO> {
    @Override
    public boolean isValid(ReservationRequestDTO reservationDate, ConstraintValidatorContext constraintValidatorContext) {
        return reservationDate.getStartDate().isAfter(LocalDate.now()) && reservationDate.getEndDate().isAfter(LocalDate.now());
    }
}
