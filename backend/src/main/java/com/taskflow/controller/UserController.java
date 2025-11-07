package com.taskflow.controller;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.taskflow.dto.AllUsersResponseDTO;
import com.taskflow.dto.BadgeDto;
import com.taskflow.model.Badge;
import com.taskflow.model.User;
import com.taskflow.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me/badges")
    public Set<BadgeDto> getMyBadges() {
        User user = userService.getCurrentUser();
        return user.getBadges().stream()
                .map(this::toDto)
                .collect(Collectors.toSet());
    }

    private BadgeDto toDto(Badge badge) {
        return BadgeDto.builder()
                .id(badge.getId())
                .name(badge.getName())
                .description(badge.getDescription())
                .icon(badge.getIcon())
                .build();
    }

    @GetMapping("/")
    public List<AllUsersResponseDTO> getUsersByName() {
        return userService.getUsers();
    }

}
