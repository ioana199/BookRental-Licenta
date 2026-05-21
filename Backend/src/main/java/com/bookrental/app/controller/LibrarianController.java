package com.bookrental.app.controller;

import com.bookrental.app.dto.LibrarianRequestCreateDTO;
import com.bookrental.app.dto.LibrarianRequestUpdateDTO;
import com.bookrental.app.dto.LibrarianResponseDTO;
import com.bookrental.app.entities.Librarian;
import com.bookrental.app.mapper.LibrarianMapper;
import com.bookrental.app.service.LibrarianService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/librarians")
public class LibrarianController {
    private final LibrarianService librarianService;

    public LibrarianController(LibrarianService librarianService) {
        this.librarianService = librarianService;
    }

    @PostMapping()
    public ResponseEntity<LibrarianResponseDTO> create(@RequestParam(required = false) Long libraryId, @Valid @RequestBody LibrarianRequestCreateDTO librarianRequestCreateDTO) {
        Librarian librarianToCreate = LibrarianMapper.mapLibrarianRequestCreateDTO2Librarian(librarianRequestCreateDTO);
        Librarian createdLibrarian;
        if (libraryId == null) {
            createdLibrarian = librarianService.createWithLibrary(librarianToCreate, librarianRequestCreateDTO.getPassword(), librarianRequestCreateDTO.getLibrary());
        } else {
            createdLibrarian = librarianService.create(librarianToCreate, librarianRequestCreateDTO.getPassword(), libraryId);
        }
        LibrarianResponseDTO librarianResponseDTO = LibrarianMapper.mapLibrarian2LibrarianResponseDTO(createdLibrarian);
        return ResponseEntity.status(201).body(librarianResponseDTO);
    }

    @PutMapping("/{librarianId}")
    public ResponseEntity<LibrarianResponseDTO> update(@PathVariable Long librarianId,
                                                       @RequestBody LibrarianRequestUpdateDTO librarianRequestUpdateDTO) {
        Librarian librarianToUpdate = LibrarianMapper.mapLibrarianRequestUpdateDTO2Librarian(librarianRequestUpdateDTO);
        Librarian updatedLibrarian = librarianService.update(librarianId, librarianToUpdate, librarianRequestUpdateDTO.getLibraryId());
        LibrarianResponseDTO librarianResponseDTO = LibrarianMapper.mapLibrarian2LibrarianResponseDTO(updatedLibrarian);

        return ResponseEntity.status(200).body(librarianResponseDTO);
    }

    @GetMapping("/all")
    public ResponseEntity<List<LibrarianResponseDTO>> getAll() {
        List<Librarian> librarians = librarianService.findAll();
        List<LibrarianResponseDTO> librarianResponseDTOS = librarians
                .stream()
                .map(LibrarianMapper::mapLibrarian2LibrarianResponseDTO)
                .toList();

        return ResponseEntity.status(200).body(librarianResponseDTOS);
    }

    @GetMapping("/{librarianId}")
    public ResponseEntity<LibrarianResponseDTO> getById(@PathVariable Long librarianId) {
        Librarian librarian = librarianService.findById(librarianId);
        LibrarianResponseDTO librarianResponseDTO = LibrarianMapper.mapLibrarian2LibrarianResponseDTO(librarian);

        return ResponseEntity.status(200).body(librarianResponseDTO);
    }

    @DeleteMapping("/{librarianId}")
    public ResponseEntity<?> delete(@PathVariable Long librarianId) {
        librarianService.delete(librarianId);
        return ResponseEntity.noContent().build();
    }
}
