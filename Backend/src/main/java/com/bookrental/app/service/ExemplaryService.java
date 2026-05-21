package com.bookrental.app.service;

import com.bookrental.app.entities.*;
import com.bookrental.app.repository.BookRepository;
import com.bookrental.app.repository.ExemplaryRepository;
import com.bookrental.app.repository.LibraryRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ExemplaryService {
    private final ExemplaryRepository exemplaryRepository;
    private final BookRepository bookRepository;
    private final LibraryRepository libraryRepository;

    public ExemplaryService(ExemplaryRepository exemplaryRepository, BookRepository bookRepository, LibraryRepository libraryRepository) {
        this.exemplaryRepository = exemplaryRepository;
        this.bookRepository = bookRepository;
        this.libraryRepository = libraryRepository;
    }

    @Transactional
    public List<Exemplary> create(Long bookId, Long libraryId, int nrToCreate) {
        Book book = bookRepository.findById(bookId).orElseThrow(() -> new EntityNotFoundException("Book not found with id: " + bookId));
        Library library = libraryRepository.findById(libraryId).orElseThrow(() -> new EntityNotFoundException("Library not found with id: " + libraryId));

        List<Exemplary> exemplaries = new ArrayList<>();

        for (int i = 0; i < nrToCreate; i++) {
            Exemplary exemplary = new Exemplary();
            exemplary.setLibrary(library);
            exemplary.setBook(book);
            exemplaries.add(exemplary);
        }

        //System.out.println("Thread din exemplary: "+Thread.currentThread().getName());
        //emailService.threadEmail();

        return exemplaryRepository.saveAll(exemplaries);
    }


}
