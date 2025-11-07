package com.taskflow.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.taskflow.dto.AllUsersResponseDTO;
import com.taskflow.model.User;
import com.taskflow.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return findByEmail(email);
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

    }

    public List<AllUsersResponseDTO> getUsers() {
        ArrayList<AllUsersResponseDTO> users = new ArrayList<>();
        userRepository
                .findAll()
                .forEach(user -> users.add(new AllUsersResponseDTO(user.getEmail())));
        return users;
    }
}
