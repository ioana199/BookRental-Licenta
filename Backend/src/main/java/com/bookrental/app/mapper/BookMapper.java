package com.bookrental.app.mapper;

import com.bookrental.app.dto.BookRequestDTO;
import com.bookrental.app.dto.BookResponseDTO;
import com.bookrental.app.entities.Book;

public class BookMapper {

    public static Book mapBookRequestDTO2Book(BookRequestDTO bookRequestDTO) {
        Book book = new Book();

        book.setTitle(bookRequestDTO.getTitle());
        book.setISBN(bookRequestDTO.getISBN());
        book.setPublicationDate(bookRequestDTO.getPublicationDate());
        //book.setAuthor(bookRequestDTO.getAuthor());
        //book.setPublisher(bookRequestDTO.getPublisher());

        return book;
    }

    public static BookResponseDTO mapBook2BookResponseDTO(Book book) {
        BookResponseDTO bookResponseDTO = new BookResponseDTO();

        bookResponseDTO.setId(book.getId());
        bookResponseDTO.setTitle(book.getTitle());
        bookResponseDTO.setISBN(book.getISBN());
        bookResponseDTO.setPublicationDate(book.getPublicationDate());
        bookResponseDTO.setAuthor(book.getAuthor());
        bookResponseDTO.setPublisher(book.getPublisher());

        return bookResponseDTO;
    }
}
