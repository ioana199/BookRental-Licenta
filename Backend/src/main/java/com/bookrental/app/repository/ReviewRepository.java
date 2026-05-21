package com.bookrental.app.repository;

import com.bookrental.app.entities.Review;
import com.bookrental.app.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
}
