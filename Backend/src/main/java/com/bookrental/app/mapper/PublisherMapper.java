package com.bookrental.app.mapper;

import com.bookrental.app.dto.PublisherRequestDTO;
import com.bookrental.app.dto.PublisherResponseDTO;
import com.bookrental.app.entities.Publisher;
import org.springframework.security.core.parameters.P;

public class PublisherMapper {
    public static Publisher mapPublisherRequestDTO2Publisher(PublisherRequestDTO publisherRequestDTO) {
        Publisher publisher = new Publisher();

        publisher.setName(publisherRequestDTO.getName());
        publisher.setEmail(publisherRequestDTO.getEmail());
        publisher.setCountry(publisherRequestDTO.getCountry());
        publisher.setCity(publisherRequestDTO.getCity());

        return publisher;
    }

    public static PublisherResponseDTO mapPublisher2PublisherResponseDTO(Publisher publisher) {
        PublisherResponseDTO publisherResponseDTO = new PublisherResponseDTO();

        publisherResponseDTO.setId(publisher.getId());
        publisherResponseDTO.setName(publisher.getName());
        publisherResponseDTO.setEmail(publisher.getEmail());
        publisherResponseDTO.setCountry(publisher.getCountry());
        publisherResponseDTO.setCity(publisher.getCity());

        return publisherResponseDTO;
    }
}
