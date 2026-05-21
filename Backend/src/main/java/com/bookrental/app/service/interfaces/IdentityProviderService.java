package com.bookrental.app.service.interfaces;

import com.bookrental.app.dto.AccountRegistration;
import com.bookrental.app.dto.Authentication;

import java.util.Map;

public interface IdentityProviderService {
    Map<String, Object> generateToken(Authentication authentication);

    Map<String, Object> refreshToken(String refreshToken);

    void create(AccountRegistration accountRegistration);
}
