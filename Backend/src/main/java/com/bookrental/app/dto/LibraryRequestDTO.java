package com.bookrental.app.dto;

import jakarta.validation.constraints.NotBlank;

public class LibraryRequestDTO {
    private Long id;
    @NotBlank(message = "Name is required!")
    private String name;
    @NotBlank(message = "City is required!")
    private String city;
    @NotBlank(message = "Phone number is required!")
    private String phoneNumber;
    @NotBlank(message = "Email is required!")
    private String email;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }
}
