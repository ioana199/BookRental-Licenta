package com.bookrental.app.controller;

import com.bookrental.app.dto.LibraryRequestDTO;
import com.bookrental.app.dto.LibraryResponseDTO;
import com.bookrental.app.entities.Library;
import com.bookrental.app.mapper.LibraryMapper;
import com.bookrental.app.service.LibraryService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/libraries")
public class LibraryController {
    private final LibraryService libraryService;

    public LibraryController(LibraryService libraryService){
        this.libraryService = libraryService;
    }

    @PostMapping()
    public ResponseEntity<LibraryResponseDTO> create(@Valid @RequestBody LibraryRequestDTO libraryRequestDTO) {
        Library libraryToCreate = LibraryMapper.mapLibraryRequestDTO2Library(libraryRequestDTO);
        Library createdLibrary = libraryService.create(libraryToCreate);
        LibraryResponseDTO libraryResponseDTO = LibraryMapper.mapLibrary2LibraryResponseDTO(createdLibrary);

        return ResponseEntity.status(201).body(libraryResponseDTO);
    }

    @PutMapping("/{libraryId}")
    public ResponseEntity<LibraryResponseDTO> update(@PathVariable Long libraryId,
                                                     @RequestBody LibraryRequestDTO libraryRequestDTO) {

        Library libraryToUpdate = LibraryMapper.mapLibraryRequestDTO2Library(libraryRequestDTO);
        Library updatedLibrary = libraryService.update(libraryId, libraryToUpdate);
        LibraryResponseDTO libraryResponseDTO = LibraryMapper.mapLibrary2LibraryResponseDTO(updatedLibrary);

        return ResponseEntity.status(200).body(libraryResponseDTO);
    }

    @GetMapping("/all")
    public ResponseEntity<List<LibraryResponseDTO>> getAll() {
        List<Library> libraries = libraryService.getAll();
        List<LibraryResponseDTO> libraryResponseDTOS = libraries
                .stream()
                .map(LibraryMapper::mapLibrary2LibraryResponseDTO)
                .toList();

        return ResponseEntity.status(200).body(libraryResponseDTOS);
    }

    @GetMapping("/{libraryId}")
    public ResponseEntity<LibraryResponseDTO> getById(@PathVariable Long libraryId) {
        Library library = libraryService.findById(libraryId);
        LibraryResponseDTO libraryResponseDTO = LibraryMapper.mapLibrary2LibraryResponseDTO(library);

        return ResponseEntity.status(200).body(libraryResponseDTO);
    }

    @DeleteMapping("/{libraryId}")
    public ResponseEntity<?> delete(@PathVariable Long libraryId) {
        libraryService.delete(libraryId);
        return ResponseEntity.noContent().build();
    }
}
