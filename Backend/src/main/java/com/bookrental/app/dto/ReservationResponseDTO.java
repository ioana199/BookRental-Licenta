package com.bookrental.app.dto;

import com.bookrental.app.enums.StatusReservation;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;

public class ReservationResponseDTO {
    private Long id;
    private LocalDate startDate;
    private LocalDate endDate;
    private Long userId;
    private Long exemplaryId;
    private StatusReservation status;
    private String bookName;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getExemplaryId() {
        return exemplaryId;
    }

    public void setExemplaryId(Long exemplaryId) {
        this.exemplaryId = exemplaryId;
    }

    public StatusReservation getStatus() {
        return status;
    }

    public void setStatus(StatusReservation status) {
        this.status = status;
    }

    public String getBookName() {
        return bookName;
    }

    public void setBookName(String bookName) {
        this.bookName = bookName;
    }
}
