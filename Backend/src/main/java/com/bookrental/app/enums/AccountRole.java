package com.bookrental.app.enums;

import lombok.Getter;

@Getter
public enum AccountRole {
    USER("user"),
    LIBRARIAN("librarian");

    private final String type;

    AccountRole(String type) {
        this.type = type;
    }

}