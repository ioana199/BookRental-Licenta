package com.bookrental.app.repository;

import com.bookrental.app.entities.Librarian;
import com.bookrental.app.entities.Publisher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PublisherRepository extends JpaRepository<Publisher, Long> {
}
