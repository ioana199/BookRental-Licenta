package com.bookrental.app.dto;

import com.bookrental.app.dto.validation.BasicValidation;
import com.bookrental.app.dto.validation.DateValidation;
import com.bookrental.app.dto.validation.ValidDate;
import jakarta.validation.GroupSequence;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

@GroupSequence({BasicValidation.class, DateValidation.class, ReservationRequestDTO.class})
@ValidDate(groups = DateValidation.class)
public class ReservationRequestDTO {
    private Long id;

    @NotNull(message = "Start date is required", groups = BasicValidation.class)
    @Future(message = "Start date must be in the future", groups = DateValidation.class)
    private LocalDate startDate;

    @NotNull(message = "End date is required!", groups = BasicValidation.class)
    @Future(message = "End date must be in the future", groups = DateValidation.class)
    private LocalDate endDate;

    public Long getId() {
        return id;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }
}
