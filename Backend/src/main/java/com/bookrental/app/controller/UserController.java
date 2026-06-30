package com.bookrental.app.controller;

import com.bookrental.app.dto.AddressDTO;
import com.bookrental.app.dto.UserRequestCreateDTO;
import com.bookrental.app.dto.UserRequestUpdateDTO;
import com.bookrental.app.dto.UserResponseDTO;
import com.bookrental.app.entities.User;
import com.bookrental.app.mapper.UserMapper;
import com.bookrental.app.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping()
    public ResponseEntity<UserResponseDTO> create(@Valid @RequestBody UserRequestCreateDTO userRequestCreateDTO) {
        User userToCreate = UserMapper.mapUserRequestCreateDTO2User(userRequestCreateDTO);
        User createdUser = userService.create(userToCreate, userRequestCreateDTO.getPassword());
        UserResponseDTO userResponseDTO = UserMapper.mapUser2UserResponseDTO(createdUser);

        return ResponseEntity.status(201).body(userResponseDTO);
    }

    @PutMapping("/{userId}")
    @PreAuthorize("hasAnyAuthority('ROLE_realm_user','ROLE_realm_admin')")
    public ResponseEntity<UserResponseDTO> update(@PathVariable Long userId,
                                                  @RequestBody UserRequestUpdateDTO userRequestUpdateDTO) {
        User userToUpdate = UserMapper.mapUserRequestUpdateDTO2User(userRequestUpdateDTO);
        User updatedUser = userService.update(userId, userToUpdate);
        UserResponseDTO userResponseDTO = UserMapper.mapUser2UserResponseDTO(updatedUser);

        return ResponseEntity.status(200).body(userResponseDTO);
    }

    @PutMapping("/{userId}/address")
    @PreAuthorize("hasAnyAuthority('ROLE_realm_user','ROLE_realm_admin')")
    public ResponseEntity<UserResponseDTO> updateAddress(@PathVariable Long userId,
                                                         @RequestBody AddressDTO addressDTO) {
        User updatedUser = userService.updateAddress(userId, addressDTO);
        UserResponseDTO userResponseDTO = UserMapper.mapUser2UserResponseDTO(updatedUser);

        return ResponseEntity.status(200).body(userResponseDTO);
    }

    @GetMapping("/all")
    //@PreAuthorize("hasAnyAuthority('ROLE_realm_librarian','ROLE_realm_admin')")
    public ResponseEntity<List<UserResponseDTO>> getAll() {
        List<User> users = userService.getAll();
        List<UserResponseDTO> userResponseDTOS = users
                .stream()
                .map(UserMapper::mapUser2UserResponseDTO)
                .toList();

        return ResponseEntity.status(200).body(userResponseDTOS);
    }

    @GetMapping("/{userId}")
    @PreAuthorize("hasAnyAuthority('ROLE_realm_user','ROLE_realm_admin')")
    public ResponseEntity<UserResponseDTO> getById(@PathVariable Long userId) {
        User user = userService.findById(userId);
        UserResponseDTO userResponseDTO = UserMapper.mapUser2UserResponseDTO(user);

        return ResponseEntity.status(200).body(userResponseDTO);
    }

    @DeleteMapping("/{userId}")
    @PreAuthorize("hasAnyAuthority('ROLE_realm_user','ROLE_realm_admin')")
    public ResponseEntity<?> delete(@PathVariable Long userId) {
        userService.delete(userId);
        return ResponseEntity.noContent().build();
    }
}
