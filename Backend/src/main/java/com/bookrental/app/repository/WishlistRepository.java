package com.bookrental.app.repository;

import com.bookrental.app.entities.User;
import com.bookrental.app.entities.Wishlist;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface WishlistRepository  extends JpaRepository<Wishlist, Long> {
    Wishlist findByBookIdAndUserId(Long bookId, Long userId);

    List<Wishlist> findByUserIdAndDate(Long id, LocalDate localDate);

    List<Wishlist> findByUserIdAndDateIsBefore(Long id, LocalDate localDate);

    Page<Wishlist> findByUserId(Long userId, Pageable pageable);
}
