package com.bookrental.app.service;

import com.bookrental.app.dto.AccountRegistration;
import com.bookrental.app.dto.AddressDTO;
import com.bookrental.app.entities.Address;
import com.bookrental.app.entities.User;
import com.bookrental.app.mapper.UserMapper;
import com.bookrental.app.repository.UserRepository;
import com.bookrental.app.service.interfaces.IdentityProviderService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final IdentityProviderService identityProviderService;

    public UserService(UserRepository userRepository, IdentityProviderService identityProviderService) {
        this.userRepository = userRepository;
        this.identityProviderService = identityProviderService;
    }

    @Transactional
    public User create(User user, String password) {
        User savedUser = userRepository.save(user);

        AccountRegistration accountRegistration = UserMapper.toAccountRegistration(savedUser, password);

        identityProviderService.create(accountRegistration);

        return savedUser;
    }

    public User update(Long userId, User user) {
        User foundUser = findById(userId);

        foundUser.setFirstName(user.getFirstName());
        foundUser.setLastName(user.getLastName());
        foundUser.setEmail(user.getEmail());

        return userRepository.save(foundUser);
    }

    public List<User> getAll() {
        return userRepository.findAll();
    }

    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id:" + id));
    }

    public void delete(Long userId) {
        User user = findById(userId);
        userRepository.delete(user);
    }

    public User updateAddress(Long userId, AddressDTO addressDTO) {
        User foundUser = findById(userId);
        Address address = foundUser.getAddress();

        address.setCountry(addressDTO.getCountry());
        address.setCity(addressDTO.getCity());
        address.setStreet(addressDTO.getStreet());
        address.setNumber(addressDTO.getNumber());

        return userRepository.save(foundUser);
    }
}
