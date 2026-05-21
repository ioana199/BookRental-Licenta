package com.bookrental.app.mapper;

import com.bookrental.app.dto.AddressDTO;
import com.bookrental.app.entities.Address;

public class AddressMapper {
    public static AddressDTO mapAddress2AddressDTO(Address address) {
        AddressDTO addressDTO = new AddressDTO();

        addressDTO.setId(address.getId());
        addressDTO.setCountry(address.getCountry());
        addressDTO.setCity(address.getCity());
        addressDTO.setStreet(address.getStreet());
        addressDTO.setNumber(address.getNumber());

        return addressDTO;
    }

    public static Address mapAddressDTO2Address(AddressDTO addressDTO) {
        Address address = new Address();

        address.setCountry(addressDTO.getCountry());
        address.setCity(addressDTO.getCity());
        address.setStreet(addressDTO.getStreet());
        address.setNumber(addressDTO.getNumber());

        return address;
    }
}
