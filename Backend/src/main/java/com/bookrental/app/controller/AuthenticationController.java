package com.bookrental.app.controller;

import com.bookrental.app.dto.Authentication;
import com.bookrental.app.service.interfaces.IdentityProviderService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("authentication")
class AuthenticationController {

    private final IdentityProviderService identityProviderService;

    public AuthenticationController(IdentityProviderService identityProviderService) {
        this.identityProviderService = identityProviderService;
    }

    @PostMapping
    public ResponseEntity<?> authenticate(@RequestBody Authentication authentication) {
        return ResponseEntity.status(HttpStatus.OK).body(identityProviderService.generateToken(authentication));
    }

    @PostMapping("refresh")
    public ResponseEntity<?> refreshToken(@RequestParam String refreshToken) {
        return ResponseEntity.status(HttpStatus.OK).body(identityProviderService.refreshToken(refreshToken));
    }

//    @GetMapping("whoami")
//    public ResponseEntity<Map<String, Object>> whoami(Principal principal) {
//        Map<String, Object> claim = new HashMap<>();
//        claim.put("id", principal.getName());
//        return ResponseEntity.status(HttpStatus.OK).body(claim);
//    }

    @GetMapping("whoami")
    public ResponseEntity<?> whoami(Principal principal) {
        Map<String, Object> claim = new HashMap<>();
        claim.put("id", principal.getName());
        return ResponseEntity.status(200).body(claim);
    }
}