package com.bookrental.app.controller;

import com.bookrental.app.dto.BookRequestDTO;
import com.bookrental.app.dto.BookResponseDTO;
import com.bookrental.app.dto.WishlistRequestDTO;
import com.bookrental.app.dto.WishlistResponseDTO;
import com.bookrental.app.entities.Book;
import com.bookrental.app.entities.Wishlist;
import com.bookrental.app.mapper.BookMapper;
import com.bookrental.app.mapper.WishlistMapper;
import com.bookrental.app.service.WishlistService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDate;

@RestController
@RequestMapping("/wishlists")
public class WishlistController {
    private final WishlistService wishlistService;

    public WishlistController(WishlistService wishlistService) {
        this.wishlistService = wishlistService;
    }

    @PostMapping("/{bookId}")
    @PreAuthorize("hasAuthority('ROLE_realm_user')")
    public ResponseEntity<WishlistResponseDTO> create(@Valid @RequestBody WishlistRequestDTO wishlistRequestDTO,
                                                      @PathVariable Long bookId,
                                                      Principal principal) {
        Wishlist wishlistToCreate = WishlistMapper.mapWishlistDTO2Wishlist(wishlistRequestDTO);
        Wishlist cratedWishlist = wishlistService.create(wishlistToCreate, bookId, Long.parseLong(principal.getName()));
        WishlistResponseDTO wishlistResponseDTO = WishlistMapper.mapWishlist2WishlistDTO(cratedWishlist);

        return ResponseEntity.status(201).body(wishlistResponseDTO);
    }

    @DeleteMapping("/{bookId}")
    @PreAuthorize("hasAuthority('ROLE_realm_user')")
    public ResponseEntity<?> delete(@PathVariable Long bookId,
                                    Principal principal) {
        wishlistService.delete(bookId, Long.parseLong(principal.getName()));
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    @PreAuthorize("hasAuthority('ROLE_realm_user')")
    public ResponseEntity<Page<WishlistResponseDTO>> search(@RequestParam(required = false, name = "page", defaultValue = "1") Integer page,
                                                            @RequestParam(required = false, name = "size", defaultValue = "5") Integer size,
                                                            @RequestParam(required = false, name = "sortBy", defaultValue = "id") String sortBy,
                                                            @RequestParam(required = false, name = "title") String title,
                                                            @RequestParam(required = false, name = "isbn") String isbn,
                                                            @RequestParam(required = false, name = "publicationDate") LocalDate publicationDate,
                                                            @RequestParam(required = false, name = "authorFirstName") String authorFirstName,
                                                            @RequestParam(required = false, name = "authorLastName") String authorLastName,
                                                            @RequestParam(required = false, name = "publisherName") String publisherName,
                                                            Principal principal) {
        page -= 1;
        return ResponseEntity.status(200).body(wishlistService
                .search(title, isbn, publicationDate, authorFirstName, authorLastName, publisherName, PageRequest.of(page, size, Sort.by(sortBy)),  Long.parseLong(principal.getName()))
                .map(WishlistMapper::mapWishlist2WishlistDTO));
    }

}
