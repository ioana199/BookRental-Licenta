package com.bookrental.app.service;

import com.bookrental.app.dto.AccountRegistration;
import com.bookrental.app.dto.LibraryRequestDTO;
import com.bookrental.app.entities.Librarian;
import com.bookrental.app.entities.Library;
import com.bookrental.app.mapper.LibrarianMapper;
import com.bookrental.app.mapper.LibraryMapper;
import com.bookrental.app.repository.LibrarianRepository;
import com.bookrental.app.repository.LibraryRepository;
import com.bookrental.app.service.interfaces.IdentityProviderService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LibrarianService {
    private final LibrarianRepository librarianRepository;
    private final IdentityProviderService identityProviderService;
    private final LibraryRepository libraryRepository;
    private final LibraryService libraryService;

    public LibrarianService(LibrarianRepository librarianRepository, IdentityProviderService identityProviderService, LibraryRepository libraryRepository, LibraryService libraryService) {
        this.librarianRepository = librarianRepository;
        this.identityProviderService = identityProviderService;
        this.libraryRepository = libraryRepository;
        this.libraryService = libraryService;
    }

    @Transactional
    public Librarian create(Librarian librarian, String password, Long libraryId) {
        Library library = libraryRepository.findById(libraryId)
                .orElseThrow(() -> new EntityNotFoundException("Library not found with id: " + libraryId));

        librarian.setLibrary(library);

        Librarian savedLibrarian = librarianRepository.save(librarian);

        AccountRegistration accountRegistration = LibrarianMapper.toAccountRegistration(savedLibrarian, password);
        identityProviderService.create(accountRegistration);

        return savedLibrarian;
    }

    @Transactional
    public Librarian createWithLibrary(Librarian librarian, String password, LibraryRequestDTO libraryRequestDTO) {
        Library libraryToCreate = LibraryMapper.mapLibraryRequestDTO2Library(libraryRequestDTO);
        Library library = libraryService.create(libraryToCreate);

        librarian.setLibrary(library);

        Librarian savedLibrarian = librarianRepository.save(librarian);

        AccountRegistration accountRegistration = LibrarianMapper.toAccountRegistration(savedLibrarian, password);
        identityProviderService.create(accountRegistration);

        return savedLibrarian;
    }

    public Librarian update(Long librarianId, Librarian librarian, Long libraryId) {
        Librarian foundLibrarian = findById(librarianId);
        Library library = libraryRepository.findById(libraryId)
                .orElseThrow(() -> new EntityNotFoundException("Library not found with id: " + libraryId));

        foundLibrarian.setFirstName(librarian.getFirstName());
        foundLibrarian.setLastName(librarian.getLastName());
        foundLibrarian.setEmail(librarian.getEmail());
        foundLibrarian.setLibrary(library);

        return librarianRepository.save(foundLibrarian);
    }

    public List<Librarian> findAll() {
        return librarianRepository.findAll();
    }

    public Librarian findById(Long id) {
        return librarianRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Librarian not found with id:" + id));
    }

    public void delete(Long librarianId) {
        Librarian librarian = findById(librarianId);
        librarianRepository.delete(librarian);
    }
}
