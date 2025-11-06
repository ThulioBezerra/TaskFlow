package com.taskflow.controller;

import com.taskflow.model.Badge;
import com.taskflow.model.User;
import com.taskflow.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.HashSet;
import java.util.Set;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

@ExtendWith(MockitoExtension.class)
class UserControllerTest {

    @Mock
    private UserService userService;

    @InjectMocks
    private UserController userController;

    private MockMvc mockMvc;

    private User user;
    private Badge badge;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(userController).build();

        user = new User();
        badge = Badge.builder().name("Test Badge").description("Test Description").icon("test-icon").build();
        Set<Badge> badges = new HashSet<>();
        badges.add(badge);
        user.setBadges(badges);
    }

    @Test
    void getMyBadges_ReturnsUserBadges() throws Exception {
        when(userService.getCurrentUser()).thenReturn(user);

        mockMvc.perform(get("/api/users/me/badges"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Test Badge"));
    }
}
