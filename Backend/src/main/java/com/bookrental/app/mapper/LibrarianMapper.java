package com.bookrental.app.mapper;

import com.bookrental.app.dto.*;
import com.bookrental.app.entities.Librarian;
import com.bookrental.app.enums.AccountRole;

public class LibrarianMapper {
    public static Librarian mapLibrarianRequestCreateDTO2Librarian(LibrarianRequestCreateDTO librarianRequestCreateDTO) {
        Librarian librarian = new Librarian();

        librarian.setFirstName(librarianRequestCreateDTO.getFirstName());
        librarian.setLastName(librarianRequestCreateDTO.getLastName());
        librarian.setEmail(librarianRequestCreateDTO.getEmail());

        return librarian;
    }

    public static Librarian mapLibrarianRequestUpdateDTO2Librarian(LibrarianRequestUpdateDTO librarianRequestUpdateDTO) {
        Librarian librarian = new Librarian();

        librarian.setFirstName(librarianRequestUpdateDTO.getFirstName());
        librarian.setLastName(librarianRequestUpdateDTO.getLastName());
        librarian.setEmail(librarianRequestUpdateDTO.getEmail());

        return librarian;
    }

    public static LibrarianResponseDTO mapLibrarian2LibrarianResponseDTO(Librarian librarian) {
        LibrarianResponseDTO librarianResponseDTO = new LibrarianResponseDTO();

        librarianResponseDTO.setId(librarian.getId());
        librarianResponseDTO.setFirstName(librarian.getFirstName());
        librarianResponseDTO.setLastName(librarian.getLastName());
        librarianResponseDTO.setEmail(librarian.getEmail());

        if (librarian.getLibrary() != null) {
            librarianResponseDTO.setLibraryId(librarian.getLibrary().getId());
        }

        return librarianResponseDTO;
    }

    public static AccountRegistration toAccountRegistration(Librarian librarian, String password) {
        AccountRegistration accountRegistration = new AccountRegistration();

        accountRegistration.setEmail(librarian.getEmail());
        accountRegistration.setFirstname(librarian.getFirstName());
        accountRegistration.setLastname(librarian.getLastName());
        accountRegistration.setPassword(password);
        accountRegistration.setRole(AccountRole.LIBRARIAN);
        accountRegistration.setId(librarian.getId());

        return accountRegistration;
    }
}
