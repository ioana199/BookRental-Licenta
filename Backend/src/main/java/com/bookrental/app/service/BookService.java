package com.bookrental.app.service;

import com.bookrental.app.dto.BookRequestDTO;
import com.bookrental.app.dto.BookResponseDTO;
import com.bookrental.app.entities.Author;
import com.bookrental.app.entities.Book;
import com.bookrental.app.entities.Publisher;
import com.bookrental.app.mapper.BookMapper;
import com.bookrental.app.repository.AuthorRepository;
import com.bookrental.app.repository.BookRepository;
import com.bookrental.app.repository.PublisherRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.*;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class BookService {
    public final BookRepository bookRepository;
    private final AuthorRepository authorRepository;
    private final PublisherRepository publisherRepository;

    public BookService(BookRepository bookRepository, AuthorRepository authorRepository, PublisherRepository publisherRepository) {
        this.bookRepository = bookRepository;
        this.authorRepository = authorRepository;
        this.publisherRepository = publisherRepository;
    }

    @Transactional
    public Book create(Long authorId, Long publisherId, Book bookToCreate) {
        Author author = authorRepository.findById(authorId).orElseThrow(() -> new EntityNotFoundException("Author not found with id: " + authorId));
        Publisher publisher = publisherRepository.findById(publisherId).orElseThrow(() -> new EntityNotFoundException("Publisher not found with id: " + publisherId));

        bookToCreate.setAuthor(author);
        bookToCreate.setPublisher(publisher);

        return bookRepository.save(bookToCreate);
    }

    public List<Book> getAll() {
        return bookRepository.findAll();
    }

    public Book getById(Long bookId) {
        return bookRepository.findById(bookId).orElseThrow(() -> new EntityNotFoundException("Book not found with id: " + bookId));
    }

    public Book update(Long bookId, Book book, Long authorId, Long publisherId) {
        Book foundBook = bookRepository.findById(bookId).orElseThrow(() -> new EntityNotFoundException("Book not found with id: " + bookId));

        foundBook.setTitle(book.getTitle());
        foundBook.setISBN(book.getISBN());
        foundBook.setPublicationDate(book.getPublicationDate());

        if (authorId != null) {
            Author foundAuthor = authorRepository.findById(authorId).orElseThrow(() -> new EntityNotFoundException("Author not found with id: " + authorId));
            foundBook.setAuthor(foundAuthor);
        }

        if (publisherId != null) {
            Publisher foundPublisher = publisherRepository.findById(publisherId).orElseThrow(() -> new EntityNotFoundException("Publisher not found with id: " + publisherId));
            foundBook.setPublisher(foundPublisher);
        }

        return bookRepository.save(foundBook);
    }

    public void delete(Long bookId) {
        Book book = getById(bookId);
        bookRepository.delete(book);
    }

    public Page<Book> paginate(Pageable pageable) {
        return bookRepository.findAll(pageable);
    }

    public Page<Book> search(String title, String isbn, LocalDate publicationDate, String firstName, String lastName, String publisherName, Pageable pageable) {
        Book book = new Book();
        book.setTitle(title);
        book.setISBN(isbn);
        book.setPublicationDate(publicationDate);

        Author author = new Author();
        author.setFirstName(firstName);
        author.setLastName(lastName);

        Publisher publisher = new Publisher();
        publisher.setName(firstName);

        book.setAuthor(author);
        book.setPublisher(publisher);

        ExampleMatcher matcher = ExampleMatcher.matching()
                .withIgnoreCase()
                .withStringMatcher(ExampleMatcher.StringMatcher.CONTAINING);

        Example<Book> exampleBook = Example.of(book, matcher);

        return bookRepository.findAll(exampleBook, pageable);

        /*if (title != null) {
            return bookRepository.findByTitle(title).orElseThrow(() -> new EntityNotFoundException("Books not found with title: " + title));
        }
        if (publicationDate != null) {
            return bookRepository.findByPublicationDate(publicationDate).orElseThrow(() -> new EntityNotFoundException("Books not found with publication date: " + publicationDate));
        }
        return null;*/
    }

    public List<Book> getTop10ByReservations() {
        List<Book> booksSortedByContor = bookRepository.findAll().stream().sorted().toList();
        List<Book> top10 = new ArrayList<>();
        for (int i = 0; i < 10; i++) {
            top10.add(booksSortedByContor.get(i));
        }
        return top10;
    }
}
