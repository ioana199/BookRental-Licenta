package com.bookrental.app.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity(name = "book")
@Table(name = "books", schema = "public")
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "title")
    private String title;

    @Column(name = "isbn")
    private String ISBN;

    @Column(name = "publication_date")
    private LocalDate publicationDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "publisher_id")
    private Publisher publisher;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id")
    private Author author;

    @JsonIgnore
    @OneToMany(mappedBy = "book", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<Exemplary> exemplaries;

    @JsonIgnore
    @OneToMany(mappedBy = "book", fetch = FetchType.LAZY)
    private List<Wishlist> wishlists;

    @Column(name = "contorRezervari")
    private Integer contorRezervari = 0;

    @Column(name = "image_url")
    private String imageUrl;

    /*
    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
            name = "book_tags", // Numele tabelului de legătură din baza de date
            joinColumns = @JoinColumn(name = "book_id"), // Cheia străină către Book
            inverseJoinColumns = @JoinColumn(name = "tag_id") // Cheia străină către Tag
    )
    private Set<Tag> tags = new HashSet<>();
    si in tags am avea:
    @ManyToMany(mappedBy = "tags")
    private Set<Book> books = new HashSet<>();

    si in responseDTO punem(ca altfel avem stackoverflow):
    private Set<String> tagNames;
    Set<String> names = book.getTags().stream()
                        .map(Tag::getName)
                        .collect(Collectors.toSet());
    bookResponseDto.setTagNames(names);
    */

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getISBN() {
        return ISBN;
    }

    public void setISBN(String ISBN) {
        this.ISBN = ISBN;
    }

    public LocalDate getPublicationDate() {
        return publicationDate;
    }

    public void setPublicationDate(LocalDate publicationDate) {
        this.publicationDate = publicationDate;
    }

    public Publisher getPublisher() {
        return publisher;
    }

    public void setPublisher(Publisher publisher) {
        this.publisher = publisher;
    }

    public Author getAuthor() {
        return author;
    }

    public void setAuthor(Author author) {
        this.author = author;
    }

    public List<Exemplary> getExemplaries() {
        return exemplaries;
    }

    public void setExemplaries(List<Exemplary> exemplaries) {
        this.exemplaries = exemplaries;
    }

    public List<Wishlist> getWishlists() {
        return wishlists;
    }

    public void setWishlists(List<Wishlist> wishlists) {
        this.wishlists = wishlists;
    }

    public Integer getContorRezervari() {
        return contorRezervari;
    }

    public void setContorRezervari(Integer contorRezervari) {
        this.contorRezervari = contorRezervari;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}
