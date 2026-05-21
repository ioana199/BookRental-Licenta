package com.bookrental.app.service;

import com.bookrental.app.entities.Library;
import com.bookrental.app.repository.LibraryRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LibraryService {
    private final LibraryRepository libraryRepository;

    public LibraryService(LibraryRepository libraryRepository){
        this.libraryRepository = libraryRepository;
    }

    @Transactional
    public Library create(Library library) {
        return libraryRepository.save(library);
    }

    public Library update(Long libraryId, Library library) {
        Library foundLibrary = findById(libraryId);

        foundLibrary.setName(library.getName());
        foundLibrary.setCity(library.getCity());
        foundLibrary.setPhoneNumber(library.getPhoneNumber());
        foundLibrary.setEmail(library.getEmail());

        return libraryRepository.save(foundLibrary);
    }

    public List<Library> getAll() {
        return libraryRepository.findAll();
    }

    public Library findById(Long id) {
        return libraryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Library not found with id:" + id));
    }

    public void delete(Long libraryId) {
        Library library = findById(libraryId);
        libraryRepository.delete(library);
    }
}
