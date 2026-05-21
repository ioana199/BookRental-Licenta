package com.bookrental.app.mapper;

import com.bookrental.app.dto.AuthorRequestDTO;
import com.bookrental.app.dto.AuthorResponseDTO;
import com.bookrental.app.entities.Author;

public class AuthorMapper {
    public static Author mapAuthorRequestDTO2Author(AuthorRequestDTO authorRequestDTO) {
        Author author = new Author();

        author.setFirstName(authorRequestDTO.getFirstName());
        author.setLastName(authorRequestDTO.getLastName());
        author.setCountry(authorRequestDTO.getCountry());
        author.setCity(authorRequestDTO.getCity());

        return author;
    }

    public static AuthorResponseDTO mapAuthor2AuthorResponseDTO(Author author) {
        AuthorResponseDTO authorResponseDTO = new AuthorResponseDTO();

        authorResponseDTO.setId(author.getId());
        authorResponseDTO.setFirstName(author.getFirstName());
        authorResponseDTO.setLastName(author.getLastName());
        authorResponseDTO.setCountry(author.getCountry());
        authorResponseDTO.setCity(author.getCity());

        return authorResponseDTO;
    }
}
