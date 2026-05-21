package com.bookrental.app.mapper;

import com.bookrental.app.dto.*;
import com.bookrental.app.entities.Address;
import com.bookrental.app.entities.User;
import com.bookrental.app.enums.AccountRole;

public class UserMapper {
    public static User mapUserRequestCreateDTO2User(UserRequestCreateDTO userRequestCreateDTO) {
        User user = new User();

        user.setFirstName(userRequestCreateDTO.getFirstName());
        user.setLastName(userRequestCreateDTO.getLastName());
        user.setEmail(userRequestCreateDTO.getEmail());

        AddressDTO addressDTO = userRequestCreateDTO.getAddress();
        if (addressDTO != null) {
            Address address = AddressMapper.mapAddressDTO2Address(addressDTO);
            address.setUser(user);

            user.setAddress(address);
        }
        return user;
    }

    public static User mapUserRequestUpdateDTO2User(UserRequestUpdateDTO userRequestUpdateDTO) {
        User user = new User();

        user.setFirstName(userRequestUpdateDTO.getFirstName());
        user.setLastName(userRequestUpdateDTO.getLastName());
        user.setEmail(userRequestUpdateDTO.getEmail());

        AddressDTO addressDTO = userRequestUpdateDTO.getAddress();
        if (addressDTO != null) {
            Address address = AddressMapper.mapAddressDTO2Address(addressDTO);
            address.setUser(user);

            user.setAddress(address);
        }
        return user;
    }

    public static UserResponseDTO mapUser2UserResponseDTO(User user) {
        UserResponseDTO userResponseDTO = new UserResponseDTO();

        userResponseDTO.setId(user.getId());
        userResponseDTO.setFirstName(user.getFirstName());
        userResponseDTO.setLastName(user.getLastName());
        userResponseDTO.setEmail(user.getEmail());

        Address address = user.getAddress();
        AddressDTO addressDTO = AddressMapper.mapAddress2AddressDTO(address);

        userResponseDTO.setAddress(addressDTO);

        return userResponseDTO;
    }

    public static AccountRegistration toAccountRegistration(User user, String password) {
        AccountRegistration accountRegistration = new AccountRegistration();

        accountRegistration.setEmail(user.getEmail());
        accountRegistration.setFirstname(user.getFirstName());
        accountRegistration.setLastname(user.getLastName());
        accountRegistration.setPassword(password);
        accountRegistration.setRole(AccountRole.USER);
        accountRegistration.setId(user.getId());

        return accountRegistration;
    }
}
