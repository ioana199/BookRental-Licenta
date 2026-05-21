package com.bookrental.app.dto;

import com.bookrental.app.entities.Book;
import com.bookrental.app.entities.Library;

public class ExemplaryDTO {
    private Long id;
    private Library library;
    private Book book;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Library getLibrary() {
        return library;
    }

    public void setLibrary(Library library) {
        this.library = library;
    }

    public Book getBook() {
        return book;
    }

    public void setBook(Book book) {
        this.book = book;
    }
}
