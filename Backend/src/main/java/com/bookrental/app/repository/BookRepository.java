package com.bookrental.app.repository;

import com.bookrental.app.entities.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    Optional<List<Book>> findByTitle(String title);

    Optional<List<Book>> findByPublicationDate(LocalDate publicationDate);

    //<S extends Book> Page<S> findAll(Example<S> example);

    //Iterable<Book> searchAll(Example<Book> example);
    
}
