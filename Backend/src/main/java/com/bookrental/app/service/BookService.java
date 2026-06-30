package com.bookrental.app.service;

import com.bookrental.app.dto.BookRequestDTO;
import com.bookrental.app.dto.BookResponseDTO;
import com.bookrental.app.dto.LibraryResponseDTO;
import com.bookrental.app.entities.Author;
import com.bookrental.app.entities.Book;
import com.bookrental.app.entities.Publisher;
import com.bookrental.app.mapper.BookMapper;
import com.bookrental.app.mapper.LibraryMapper;
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
import java.util.Comparator;
import java.util.List;

@Service
public class BookService {
    public final BookRepository bookRepository;
    private final AuthorRepository authorRepository;
    private final PublisherRepository publisherRepository;
    private final OpenAIService openAIService;

    public BookService(BookRepository bookRepository, AuthorRepository authorRepository, PublisherRepository publisherRepository, OpenAIService openAIService) {
        this.bookRepository = bookRepository;
        this.authorRepository = authorRepository;
        this.publisherRepository = publisherRepository;
        this.openAIService = openAIService;
    }

    @Transactional
    public Book create(Long authorId, Long publisherId, Book bookToCreate) {
        Author author = authorRepository.findById(authorId).orElseThrow(() -> new EntityNotFoundException("Author not found with id: " + authorId));
        Publisher publisher = publisherRepository.findById(publisherId).orElseThrow(() -> new EntityNotFoundException("Publisher not found with id: " + publisherId));

        bookToCreate.setAuthor(author);
        bookToCreate.setPublisher(publisher);

        return bookRepository.save(bookToCreate);
    }

    @Transactional
    public List<Book> getAll() {

        try {
            return bookRepository.findAll();
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }    }

    /*
    @Transactional
    public Book getById(Long bookId) {
        return bookRepository.findById(bookId).orElseThrow(() -> new EntityNotFoundException("Book not found with id: " + bookId));
    }
*/
    @Transactional
    public Book getById(Long bookId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new EntityNotFoundException("Book not found with id: " + bookId));

        if (book.getSummary() == null || book.getSummary().isEmpty()) {
            String summary = openAIService.generateSummary(
                    book.getTitle(),
                    book.getAuthor() != null ? book.getAuthor().getFirstName() : "",
                    book.getAuthor() != null ? book.getAuthor().getLastName() : ""
            );
            if (summary != null) {
                book.setSummary(summary);
                bookRepository.save(book);
            }
        }
        return book;
    }

    public Book update(Long bookId, Book book, Long authorId, Long publisherId) {
        Book foundBook = bookRepository.findById(bookId).orElseThrow(() -> new EntityNotFoundException("Book not found with id: " + bookId));

        foundBook.setTitle(book.getTitle());
        foundBook.setISBN(book.getISBN());
        foundBook.setPublicationDate(book.getPublicationDate());
        foundBook.setImageUrl(book.getImageUrl());
        foundBook.setGenres(book.getGenres());

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

    @Transactional
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
        return bookRepository.findAll().stream()
                .sorted(Comparator.comparingInt(
                                (Book b) -> b.getContorRezervari() == null ? 0 : b.getContorRezervari())
                        .reversed())
                .limit(10)
                .toList();
    }

    @Transactional
    public List<LibraryResponseDTO> getLibrariesForBook(Long bookId) {
        Book book = getById(bookId);
        return book.getExemplaries().stream()
                .map(e -> e.getLibrary())
                .distinct()
                .map(LibraryMapper::mapLibrary2LibraryResponseDTO)
                .toList();
    }
}
