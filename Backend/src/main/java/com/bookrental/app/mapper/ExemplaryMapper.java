package com.bookrental.app.mapper;

import com.bookrental.app.dto.ExemplaryDTO;
import com.bookrental.app.entities.Exemplary;

public class ExemplaryMapper {

    public static Exemplary mapExemplaryDTO2Exemplary(ExemplaryDTO exemplaryDTO) {
        Exemplary exemplary = new Exemplary();

        exemplary.setBook(exemplaryDTO.getBook());
        exemplary.setLibrary(exemplaryDTO.getLibrary());

        return exemplary;
    }

    public static ExemplaryDTO mapExemplary2ExemplaryDTO(Exemplary exemplary) {
        ExemplaryDTO exemplaryDTO = new ExemplaryDTO();

        exemplaryDTO.setId(exemplary.getId());
        exemplaryDTO.setBook(exemplary.getBook());
        exemplaryDTO.setLibrary(exemplary.getLibrary());

        return exemplaryDTO;
    }
}
