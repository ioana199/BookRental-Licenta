package com.bookrental.app.dto;

import jakarta.validation.constraints.NotNull;

public class LibrarianRequestCreateDTO {
    private Long id;
    private String firstName;
    private String lastName;
    @NotNull(message = "Email is required!")
    private String email;
    @NotNull(message = "Password is required!")
    private String password;
    private LibraryRequestDTO library;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public LibraryRequestDTO getLibrary() {
        return library;
    }

    public void setLibrary(LibraryRequestDTO library) {
        this.library = library;
    }
}
