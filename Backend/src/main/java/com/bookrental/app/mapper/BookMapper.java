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
        book.setImageUrl(bookRequestDTO.getImageUrl());

        return book;
    }

    public static BookResponseDTO mapBook2BookResponseDTO(Book book) {
        BookResponseDTO bookResponseDTO = new BookResponseDTO();

        bookResponseDTO.setId(book.getId());
        bookResponseDTO.setTitle(book.getTitle());
        bookResponseDTO.setISBN(book.getISBN());
        bookResponseDTO.setPublicationDate(book.getPublicationDate());
        if (book.getAuthor() != null) {
            bookResponseDTO.setAuthorFirstName(book.getAuthor().getFirstName());
        }
        if (book.getAuthor() != null) {
            bookResponseDTO.setAuthorLastName(book.getAuthor().getLastName());
        }
        if (book.getPublisher() != null) {
            bookResponseDTO.setPublisherName(book.getPublisher().getName());
        }
        bookResponseDTO.setImageUrl(book.getImageUrl());

        return bookResponseDTO;
    }
}
