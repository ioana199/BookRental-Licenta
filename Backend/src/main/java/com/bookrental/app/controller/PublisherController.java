package com.bookrental.app.controller;

import com.bookrental.app.dto.*;
import com.bookrental.app.entities.Author;
import com.bookrental.app.entities.Library;
import com.bookrental.app.entities.Publisher;
import com.bookrental.app.mapper.AuthorMapper;
import com.bookrental.app.mapper.LibraryMapper;
import com.bookrental.app.mapper.PublisherMapper;
import com.bookrental.app.service.PublisherService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/publishers")
public class PublisherController {
    private final PublisherService publisherService;

    public PublisherController(PublisherService publisherService) {
        this.publisherService = publisherService;
    }

    @PostMapping()
    @PreAuthorize("hasAnyAuthority('ROLE_realm_librarian','ROLE_realm_admin')")
    public ResponseEntity<PublisherResponseDTO> create(@Valid @RequestBody PublisherRequestDTO publisherRequestDTO) {
        Publisher publisherToCreate = PublisherMapper.mapPublisherRequestDTO2Publisher(publisherRequestDTO);
        Publisher createdPublisher = publisherService.create(publisherToCreate);
        PublisherResponseDTO publisherResponseDTO = PublisherMapper.mapPublisher2PublisherResponseDTO(createdPublisher);

        return ResponseEntity.status(201).body(publisherResponseDTO);
    }

    @PutMapping("/{publisherId}")
    @PreAuthorize("hasAnyAuthority('ROLE_realm_librarian','ROLE_realm_admin')")
    public ResponseEntity<PublisherResponseDTO> update(@PathVariable Long publisherId,
                                                       @RequestBody PublisherRequestDTO publisherRequestDTO) {

        Publisher publisherToUpdate = PublisherMapper.mapPublisherRequestDTO2Publisher(publisherRequestDTO);
        Publisher updatedPublisher = publisherService.update(publisherId, publisherToUpdate);
        PublisherResponseDTO publisherResponseDTO = PublisherMapper.mapPublisher2PublisherResponseDTO(updatedPublisher);

        return ResponseEntity.status(200).body(publisherResponseDTO);
    }

    @GetMapping("/all")
    public ResponseEntity<List<PublisherResponseDTO>> getAll() {
        List<Publisher> publishers = publisherService.getAll();
        List<PublisherResponseDTO> publisherResponseDTOS = publishers.stream()
                .map(PublisherMapper::mapPublisher2PublisherResponseDTO)
                .toList();

        return ResponseEntity.status(200).body(publisherResponseDTOS);
    }

    @GetMapping("/{publisherId}")
    public ResponseEntity<PublisherResponseDTO> getById(@PathVariable Long publisherId) {
        Publisher publisher = publisherService.getById(publisherId);
        PublisherResponseDTO publisherResponseDTO = PublisherMapper.mapPublisher2PublisherResponseDTO(publisher);

        return ResponseEntity.status(200).body(publisherResponseDTO);
    }

    @GetMapping("/list")
    public ResponseEntity<Page<PublisherResponseDTO>> list(@RequestParam(required = false, name = "page", defaultValue = "1") Integer page,
                                                           @RequestParam(required = false, name = "size", defaultValue = "5") Integer size,
                                                           @RequestParam(required = false, name = "sortBy", defaultValue = "id") String sortBy) {
        page -= 1;
        return ResponseEntity.status(200).body(publisherService
                .paginate(PageRequest.of(page, size, Sort.by(sortBy)))
                .map(PublisherMapper::mapPublisher2PublisherResponseDTO));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<PublisherResponseDTO>> search(@RequestParam(required = false, name = "page", defaultValue = "1") Integer page,
                                                             @RequestParam(required = false, name = "size", defaultValue = "5") Integer size,
                                                             @RequestParam(required = false, name = "sortBy", defaultValue = "id") String sortBy,
                                                             @RequestParam(required = false, name = "name") String name,
                                                             @RequestParam(required = false, name = "email") String email,
                                                             @RequestParam(required = false, name = "country") String country,
                                                             @RequestParam(required = false, name = "city") String city) {
        page = Math.max(page - 1, 0); //acelasi lucru ca page-=1
        return ResponseEntity.status(200).body(publisherService
                .search(name, email, country, city, PageRequest.of(page, size, Sort.by(sortBy)))
                .map(PublisherMapper::mapPublisher2PublisherResponseDTO));
    }

    @DeleteMapping("/{publisherId}")
    @PreAuthorize("hasAnyAuthority('ROLE_realm_librarian','ROLE_realm_admin')")
    public ResponseEntity<?> delete(@PathVariable Long publisherId) {
        publisherService.delete(publisherId);
        return ResponseEntity.noContent().build();
    }
}
