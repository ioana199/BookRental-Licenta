package com.bookrental.app.controller;

import com.bookrental.app.dto.*;
import com.bookrental.app.entities.*;
import com.bookrental.app.mapper.*;
import com.bookrental.app.service.AuthorService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/authors")
public class AuthorController {
    private final AuthorService authorService;

    public AuthorController(AuthorService authorService) {
        this.authorService = authorService;
    }

    @PostMapping()
    @PreAuthorize("hasAnyAuthority('ROLE_realm_librarian','ROLE_realm_admin')")
    public ResponseEntity<AuthorResponseDTO> create(@Valid @RequestBody AuthorRequestDTO authorRequestDTO) {
        Author authorToCreate = AuthorMapper.mapAuthorRequestDTO2Author(authorRequestDTO);
        Author createdAuthor = authorService.create(authorToCreate);
        AuthorResponseDTO authorResponseDTO = AuthorMapper.mapAuthor2AuthorResponseDTO(createdAuthor);

        return ResponseEntity.status(201).body(authorResponseDTO);
    }

    @PutMapping("/{authorId}")
    @PreAuthorize("hasAnyAuthority('ROLE_realm_librarian','ROLE_realm_admin')")
    public ResponseEntity<AuthorResponseDTO> update(@PathVariable Long authorId,
                                                    @RequestBody AuthorRequestDTO authorRequestDTO) {

        Author authorToUpdate = AuthorMapper.mapAuthorRequestDTO2Author(authorRequestDTO);
        Author updatedAuthor = authorService.update(authorId, authorToUpdate);
        AuthorResponseDTO authorResponseDTO = AuthorMapper.mapAuthor2AuthorResponseDTO(updatedAuthor);

        return ResponseEntity.status(200).body(authorResponseDTO);
    }

    @GetMapping("/all")
    public ResponseEntity<List<AuthorResponseDTO>> getAll() {
        List<Author> authors = authorService.getAll();
        List<AuthorResponseDTO> authorResponseDTOS = authors.stream()
                .map(AuthorMapper::mapAuthor2AuthorResponseDTO)
                .toList();

        return ResponseEntity.status(200).body(authorResponseDTOS);
    }

    @GetMapping("/{authorId}")
    public ResponseEntity<AuthorResponseDTO> getById(@PathVariable Long authorId) {
        Author author = authorService.getById(authorId);
        AuthorResponseDTO authorResponseDTO = AuthorMapper.mapAuthor2AuthorResponseDTO(author);

        return ResponseEntity.status(200).body(authorResponseDTO);
    }

    @GetMapping("/list")
    public ResponseEntity<Page<AuthorResponseDTO>> list(@RequestParam(required = false, name = "page", defaultValue = "1") Integer page,
                                                        @RequestParam(required = false, name = "size", defaultValue = "5") Integer size,
                                                        @RequestParam(required = false, name = "sortBy", defaultValue = "id") String sortBy) {
        page -= 1;
        return ResponseEntity.status(200).body(authorService
                .paginate(PageRequest.of(page, size, Sort.by(sortBy)))
                .map(AuthorMapper::mapAuthor2AuthorResponseDTO));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<AuthorResponseDTO>> search(@RequestParam(required = false, name = "page", defaultValue = "1") Integer page,
                                                          @RequestParam(required = false, name = "size", defaultValue = "5") Integer size,
                                                          @RequestParam(required = false, name = "sortBy", defaultValue = "id") String sortBy,
                                                          @RequestParam(required = false, name = "firstName") String authorFirstName,
                                                          @RequestParam(required = false, name = "lastName") String authorLastName,
                                                          @RequestParam(required = false, name = "country") String country,
                                                          @RequestParam(required = false, name = "city") String city) {
        page -= 1;
        return ResponseEntity.status(200).body(authorService
                .search(authorFirstName, authorLastName, country, city, PageRequest.of(page, size, Sort.by(sortBy)))
                .map(AuthorMapper::mapAuthor2AuthorResponseDTO));
    }

    @DeleteMapping("/{authorId}")
    @PreAuthorize("hasAnyAuthority('ROLE_realm_librarian','ROLE_realm_admin')")
    public ResponseEntity<?> delete(@PathVariable Long authorId) {
        authorService.delete(authorId);
        return ResponseEntity.noContent().build();
    }
}
