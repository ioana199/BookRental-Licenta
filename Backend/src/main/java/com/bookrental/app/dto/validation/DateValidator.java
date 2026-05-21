package com.bookrental.app.dto.validation;

import com.bookrental.app.dto.ReservationRequestDTO;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class DateValidator implements ConstraintValidator<ValidDate, ReservationRequestDTO> {
    @Override
    public boolean isValid(ReservationRequestDTO reservationDate, ConstraintValidatorContext constraintValidatorContext) {
        return reservationDate.getStartDate().isBefore(reservationDate.getEndDate());
    }
}
