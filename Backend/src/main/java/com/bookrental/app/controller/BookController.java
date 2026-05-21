package com.bookrental.app.controller;

import com.bookrental.app.dto.AuthorRequestDTO;
import com.bookrental.app.dto.AuthorResponseDTO;
import com.bookrental.app.dto.BookRequestDTO;
import com.bookrental.app.dto.BookResponseDTO;
import com.bookrental.app.entities.Author;
import com.bookrental.app.entities.Book;
import com.bookrental.app.mapper.AuthorMapper;
import com.bookrental.app.mapper.BookMapper;
import com.bookrental.app.service.BookService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/books")
public class BookController {
    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @PostMapping("/{authorId}/{publisherId}")
    public ResponseEntity<BookResponseDTO> create(@PathVariable Long authorId, @PathVariable Long publisherId, @Valid @RequestBody BookRequestDTO bookRequestDTO) {
        Book bookToCreate = BookMapper.mapBookRequestDTO2Book(bookRequestDTO);
        Book createdBook = bookService.create(authorId, publisherId, bookToCreate);
        BookResponseDTO bookResponseDTO = BookMapper.mapBook2BookResponseDTO(createdBook);

        return ResponseEntity.status(201).body(bookResponseDTO);
    }

    @PutMapping("/{bookId}")
    public ResponseEntity<BookResponseDTO> update(@PathVariable Long bookId, @RequestBody BookRequestDTO bookRequestDTO, @RequestParam(required = false) Long authorId, @RequestParam(required = false) Long publisherId) {
        Book bookToUpdate = BookMapper.mapBookRequestDTO2Book(bookRequestDTO);
        Book updatedBook = bookService.update(bookId, bookToUpdate, authorId, publisherId);
        BookResponseDTO bookResponseDTO = BookMapper.mapBook2BookResponseDTO(updatedBook);

        return ResponseEntity.status(200).body(bookResponseDTO);
    }

    @GetMapping("/all")
    public ResponseEntity<List<BookResponseDTO>> getAll() {
        List<Book> books = bookService.getAll();
        List<BookResponseDTO> bookResponseDTOS = books.stream()
                .map(BookMapper::mapBook2BookResponseDTO)
                .toList();

        return ResponseEntity.status(200).body(bookResponseDTOS);
    }

    @GetMapping("/list")
    public ResponseEntity<Page<BookResponseDTO>> list(@RequestParam(required = false, name = "page", defaultValue = "1") Integer page,
                                                      @RequestParam(required = false, name = "size", defaultValue = "5") Integer size,
                                                      @RequestParam(required = false, name = "sortBy", defaultValue = "id") String sortBy) {
        page -= 1;
        return ResponseEntity.status(200).body(bookService
                .paginate(PageRequest.of(page, size, Sort.by(sortBy)))
                .map(BookMapper::mapBook2BookResponseDTO));
    }

    @GetMapping("/{bookId}")
    public ResponseEntity<BookResponseDTO> getById(@PathVariable Long bookId) {
        Book book = bookService.getById(bookId);
        BookResponseDTO bookResponseDTO = BookMapper.mapBook2BookResponseDTO(book);

        return ResponseEntity.status(200).body(bookResponseDTO);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<BookResponseDTO>> search(@RequestParam(required = false, name = "page", defaultValue = "1") Integer page,
                                                        @RequestParam(required = false, name = "size", defaultValue = "5") Integer size,
                                                        @RequestParam(required = false, name = "sortBy", defaultValue = "id") String sortBy,
                                                        @RequestParam(required = false, name = "title") String title,
                                                        @RequestParam(required = false, name = "isbn") String isbn,
                                                        @RequestParam(required = false, name = "publicationDate") LocalDate publicationDate,
                                                        @RequestParam(required = false, name = "authorFirstName") String authorFirstName,
                                                        @RequestParam(required = false, name = "authorLastName") String authorLastName,
                                                        @RequestParam(required = false, name = "publisherName") String publisherName) {
        page -= 1;
        return ResponseEntity.status(200).body(bookService
                .search(title, isbn, publicationDate, authorFirstName, authorLastName, publisherName, PageRequest.of(page, size, Sort.by(sortBy)))
                .map(BookMapper::mapBook2BookResponseDTO));
    }

    @DeleteMapping("/{bookId}")
    public ResponseEntity<?> delete(@PathVariable Long bookId) {
        bookService.delete(bookId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/top10")
    public ResponseEntity<List<BookResponseDTO>> getTop10() {
        List<Book> books = bookService.getTop10ByReservations();
        List<BookResponseDTO> bookResponseDTOS = books.stream()
                .map(BookMapper::mapBook2BookResponseDTO)
                .toList();

        return ResponseEntity.status(200).body(bookResponseDTOS);
    }
}
