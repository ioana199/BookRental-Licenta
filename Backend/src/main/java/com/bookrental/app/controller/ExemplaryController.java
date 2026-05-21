package com.bookrental.app.controller;

import com.bookrental.app.dto.BookRequestDTO;
import com.bookrental.app.dto.BookResponseDTO;
import com.bookrental.app.dto.ExemplaryDTO;
import com.bookrental.app.entities.Book;
import com.bookrental.app.entities.Exemplary;
import com.bookrental.app.mapper.BookMapper;
import com.bookrental.app.service.ExemplaryService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/exemplaries")
public class ExemplaryController {
    private final ExemplaryService exemplaryService;

    public ExemplaryController(ExemplaryService exemplaryService) {
        this.exemplaryService = exemplaryService;
    }

    @PostMapping("/{bookId}/{libraryId}/{nrToCreate}")
    public ResponseEntity<List<Exemplary>> create(@PathVariable Long bookId,
                                                  @PathVariable Long libraryId,
                                                  @PathVariable int nrToCreate) {
        return ResponseEntity.status(201).body(exemplaryService.create(bookId, libraryId, nrToCreate));
    }
}
