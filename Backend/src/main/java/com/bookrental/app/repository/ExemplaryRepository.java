package com.bookrental.app.repository;

import com.bookrental.app.entities.Book;
import com.bookrental.app.entities.Exemplary;
import com.bookrental.app.entities.Library;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ExemplaryRepository extends JpaRepository<Exemplary, Long> {
    List<Exemplary> findByBookAndLibrary(Book book, Library library);

    @Query("SELECT e FROM exemplary e " +
            "WHERE e.book.id = :bookId " +
            "AND e.library.id = :libraryId " +
            "AND e.id NOT IN (" +
            "   SELECT r.exemplary.id FROM reservation r " +
            "   WHERE r.startDate <= :endDate " +
            "   AND r.endDate >= :startDate" +
            "   OR  (:startDate = :tomorrow" +
            "   AND r.status=com.bookrental.app.enums.StatusReservation.DELAYED)" +
            ")")
    List<Exemplary> findAvailableExemplar(
            @Param("bookId") Long bookId,
            @Param("libraryId") Long libraryId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("tomorrow") LocalDate tomorrow
    );
}
