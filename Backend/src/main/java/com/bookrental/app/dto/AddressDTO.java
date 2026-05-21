package com.bookrental.app.dto;

public class AddressDTO {
    private long id;
    private String country;
    private String city;
    private String street;
    private String number;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getStreet() {
        return street;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    public String  getNumber() {
        return number;
    }

    public void setNumber(String  number) {
        this.number = number;
    }
}
