package com.bookrental.app.service;

import com.bookrental.app.entities.Author;
import com.bookrental.app.entities.Publisher;
import com.bookrental.app.repository.PublisherRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PublisherService {
    private final PublisherRepository publisherRepository;


    public PublisherService(PublisherRepository publisherRepository) {
        this.publisherRepository = publisherRepository;
    }

    @Transactional
    public Publisher create(Publisher publisher) {
        return publisherRepository.save(publisher);
    }

    public Publisher update(Long publisherId, Publisher publisherToUpdate) {
        Publisher foundPublisher = publisherRepository.findById(publisherId).orElseThrow(() -> new EntityNotFoundException("Publisher not found with id: " + publisherId));

        foundPublisher.setName(publisherToUpdate.getName());
        foundPublisher.setEmail(publisherToUpdate.getEmail());
        foundPublisher.setCountry(publisherToUpdate.getCountry());
        foundPublisher.setCity(publisherToUpdate.getCity());

        return publisherRepository.save(foundPublisher);
    }

    public List<Publisher> getAll() {
        return publisherRepository.findAll();
    }

    public Publisher getById(Long publisherId) {
        return publisherRepository.findById(publisherId).orElseThrow(() -> new EntityNotFoundException("Publisher not found with id: " + publisherId));
    }

    public void delete(Long publisherId) {
        Publisher publisher = getById(publisherId);
        publisherRepository.delete(publisher);
    }

    public Page<Publisher> paginate(Pageable pageable) {
        return publisherRepository.findAll(pageable);
    }

    public Page<Publisher> search(String name, String email, String country, String city, Pageable pageable) {
        Publisher publisher = new Publisher();
        publisher.setName(name);
        publisher.setEmail(email);
        publisher.setCountry(country);
        publisher.setCity(city);

        ExampleMatcher matcher = ExampleMatcher.matching()
                .withIgnoreCase()
                .withStringMatcher(ExampleMatcher.StringMatcher.CONTAINING);

        Example<Publisher> examplePublisher = Example.of(publisher, matcher);

        return publisherRepository.findAll(examplePublisher, pageable);
    }

}
