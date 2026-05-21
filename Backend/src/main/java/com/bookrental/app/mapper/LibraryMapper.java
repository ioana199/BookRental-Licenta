package com.bookrental.app.mapper;

import com.bookrental.app.dto.LibraryRequestDTO;
import com.bookrental.app.dto.LibraryResponseDTO;
import com.bookrental.app.entities.Library;

public class LibraryMapper {
    public static Library mapLibraryRequestDTO2Library(LibraryRequestDTO libraryRequestDTO){
        Library library = new Library();

        library.setName(libraryRequestDTO.getName());
        library.setCity(libraryRequestDTO.getCity());
        library.setPhoneNumber(libraryRequestDTO.getPhoneNumber());
        library.setEmail(libraryRequestDTO.getEmail());

        return library;
    }

    public static LibraryResponseDTO mapLibrary2LibraryResponseDTO(Library library){
        LibraryResponseDTO libraryResponseDTO = new LibraryResponseDTO();

        libraryResponseDTO.setId(library.getId());
        libraryResponseDTO.setName(library.getName());
        libraryResponseDTO.setCity(library.getCity());
        libraryResponseDTO.setPhoneNumber(library.getPhoneNumber());
        libraryResponseDTO.setEmail(library.getEmail());

        return libraryResponseDTO;
    }

}
