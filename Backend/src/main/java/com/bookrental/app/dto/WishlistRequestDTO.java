package com.bookrental.app.dto;

import com.bookrental.app.dto.validation.BasicValidation;
import com.bookrental.app.dto.validation.DateValidation;
import com.bookrental.app.entities.Book;
import com.bookrental.app.entities.User;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public class WishlistRequestDTO {
    @NotNull(message = "Start date is required", groups = BasicValidation.class)
    @Future(message = "Start date must be in the future", groups = DateValidation.class)
    private LocalDate date;

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }
}
