package com.bookrental.app.service;

import com.bookrental.app.entities.Author;
import com.bookrental.app.entities.Book;
import com.bookrental.app.repository.AuthorRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.nio.channels.FileChannel;
import java.time.LocalDate;
import java.util.List;

@Service
public class AuthorService {
    private final AuthorRepository authorRepository;

    public AuthorService(AuthorRepository authorRepository) {
        this.authorRepository = authorRepository;
    }

    @Transactional
    public Author create(Author author) {
        return authorRepository.save(author);
    }

    public Author update(Long authorId, Author authorToUpdate) {
        Author foundAuthor = authorRepository.findById(authorId).orElseThrow(() -> new EntityNotFoundException("Author not found with id: " + authorId));

        foundAuthor.setFirstName(authorToUpdate.getFirstName());
        foundAuthor.setLastName(authorToUpdate.getLastName());
        foundAuthor.setCountry(authorToUpdate.getCountry());
        foundAuthor.setCity(authorToUpdate.getCity());

        return authorRepository.save(foundAuthor);
    }

    public List<Author> getAll() {
        return authorRepository.findAll();
    }

    public Author getById(Long authorId) {
        return authorRepository.findById(authorId).orElseThrow(() -> new EntityNotFoundException("Author not found with id:" + authorId));
    }

    public void delete(Long authorId) {
        Author author = getById(authorId);
        authorRepository.delete(author);
    }

    public Page<Author> paginate(Pageable pageable) {
        return authorRepository.findAll(pageable);
    }

    public Page<Author> search(String firstName, String lastName, String country, String city, Pageable pageable) {
        Author author = new Author();
        author.setFirstName(firstName);
        author.setLastName(lastName);
        author.setCountry(country);
        author.setCity(city);

        ExampleMatcher matcher = ExampleMatcher.matching()
                .withIgnoreCase()
                .withStringMatcher(ExampleMatcher.StringMatcher.CONTAINING);

        Example<Author> exampleAuthor = Example.of(author, matcher);

        return authorRepository.findAll(exampleAuthor, pageable);
    }
}
