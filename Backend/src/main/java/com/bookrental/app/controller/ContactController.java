package com.bookrental.app.controller;

import com.bookrental.app.dto.ContactDTO;
import com.bookrental.app.service.EmailService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/contact")
public class ContactController {
    private final EmailService emailService;

    public ContactController(EmailService emailService) {
        this.emailService = emailService;
    }

    @PostMapping
    public ResponseEntity<?> sendContactEmail(@Valid @RequestBody ContactDTO contactDTO) {
        String subject = "Mesaj nou de contact de la " + contactDTO.getName();
        String body = "Nume: " + contactDTO.getName() + "\n"
                + "Email: " + contactDTO.getEmail() + "\n\n"
                + "Mesaj:\n" + contactDTO.getMessage();

        emailService.sendEmail("ioanaardelean199@gmail.com", subject, body);
        return ResponseEntity.ok("Mesaj trimis cu succes!");
    }
}