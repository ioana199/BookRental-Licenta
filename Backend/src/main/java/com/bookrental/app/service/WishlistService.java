package com.bookrental.app.service;

import com.bookrental.app.entities.*;
import com.bookrental.app.repository.BookRepository;
import com.bookrental.app.repository.UserRepository;
import com.bookrental.app.repository.WishlistRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class WishlistService {
    private final WishlistRepository wishlistRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    public WishlistService(WishlistRepository wishlistRepository, BookRepository bookRepository, UserRepository userRepository) {
        this.wishlistRepository = wishlistRepository;
        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Wishlist create(Wishlist wishlist, Long bookId, Long userId) {
        Book foundBook = bookRepository.findById(bookId)
                .orElseThrow(() -> new EntityNotFoundException("Book not found with id: " + bookId));

        User foundUser = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + userId));

        wishlist.setBook(foundBook);
        wishlist.setUser(foundUser);

        return wishlistRepository.save(wishlist);
    }

    public void delete(Long bookId, Long userId) {
        Wishlist wishlist = wishlistRepository.findByBookIdAndUserId(bookId, userId);
        wishlistRepository.delete(wishlist);
    }

    public Page<Wishlist> paginate(Pageable pageable) {
        return wishlistRepository.findAll(pageable);
    }

    public Page<Wishlist> search(String title, String isbn, LocalDate publicationDate, String firstName, String lastName, String publisherName, Pageable pageable, Long userId) {
        Book book = new Book();
        book.setTitle(title);
        book.setISBN(isbn);
        book.setPublicationDate(publicationDate);

        Author author = new Author();
        author.setFirstName(firstName);
        author.setLastName(lastName);

        Publisher publisher = new Publisher();
        publisher.setName(publisherName);

        book.setAuthor(author);
        book.setPublisher(publisher);

        User user = new User();
        user.setId(userId);

        Wishlist wishlist = new Wishlist();
        wishlist.setBook(book);
        wishlist.setUser(user);

        ExampleMatcher matcher = ExampleMatcher.matching()
                .withIgnoreCase()
                .withStringMatcher(ExampleMatcher.StringMatcher.CONTAINING);

        Example<Wishlist> exampleWishlist = Example.of(wishlist, matcher);

        return wishlistRepository.findAll(exampleWishlist, pageable);
    }
}
