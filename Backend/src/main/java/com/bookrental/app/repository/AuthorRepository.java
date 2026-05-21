package com.bookrental.app.repository;

import com.bookrental.app.entities.Author;
import com.bookrental.app.entities.Librarian;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AuthorRepository extends JpaRepository<Author, Long> {
    Author findAllByFirstName(String firstName);

    Author findAllByLastName(String lastName);
}
