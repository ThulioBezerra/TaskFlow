package com.taskflow.controller;

import java.time.OffsetDateTime;
import java.util.UUID;

import static org.hamcrest.Matchers.containsString;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.taskflow.dto.ForgotPasswordRequest;
import com.taskflow.dto.LoginRequest;
import com.taskflow.dto.RegisterRequest;
import com.taskflow.dto.ResetPasswordRequest;
import com.taskflow.model.User;
import com.taskflow.model.UserRole;
import com.taskflow.repository.UserRepository;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(properties = "frontend.url=http://localhost:5173")
class AuthControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll(); // Clear database before each test
    }

    @Test
    void register_Success() throws Exception {
        RegisterRequest registerRequest = new RegisterRequest("test@example.com", "password", UserRole.COLLABORATOR);

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("User registered successfully")));
    }

    @Test
    void register_EmailAlreadyExists_ReturnsBadRequest() throws Exception {
        // First registration
        RegisterRequest registerRequest = new RegisterRequest("test@example.com", "password", UserRole.COLLABORATOR);
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isOk());

        // Second registration with same email
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string(containsString("Email already registered")));
    }

    @Test
    void login_Success() throws Exception {
        // Register a user first
        RegisterRequest registerRequest = new RegisterRequest("test@example.com", "password", UserRole.COLLABORATOR);
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isOk());

        // Attempt to login
        LoginRequest loginRequest = new LoginRequest("test@example.com", "password");
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("token")));
    }

    @Test
    void login_InvalidCredentials_ReturnsUnauthorized() throws Exception {
        // Attempt to login with invalid credentials
        LoginRequest loginRequest = new LoginRequest("wrong@example.com", "wrongpassword");
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void forgotPassword_UserExists_ReturnsOk() throws Exception {
        // Register a user first
        RegisterRequest registerRequest = new RegisterRequest("test@example.com", "password", UserRole.COLLABORATOR);
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)));

        ForgotPasswordRequest forgotPasswordRequest = new ForgotPasswordRequest("test@example.com");

        mockMvc.perform(post("/api/auth/forgot-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(forgotPasswordRequest)))
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("If an account with that email exists, a password reset link has been sent.")));

        User user = userRepository.findByEmail("test@example.com").orElseThrow();
        assertNotNull(user.getPasswordResetToken());
        assertNotNull(user.getPasswordResetTokenExpiry());
    }

    @Test
    void forgotPassword_UserDoesNotExist_ReturnsOk() throws Exception {
        ForgotPasswordRequest forgotPasswordRequest = new ForgotPasswordRequest("nonexistent@example.com");

        mockMvc.perform(post("/api/auth/forgot-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(forgotPasswordRequest)))
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("If an account with that email exists, a password reset link has been sent.")));
    }

    @Test
    void resetPassword_ValidToken_Success() throws Exception {
        // Register a user and set a reset token
        RegisterRequest registerRequest = new RegisterRequest("test@example.com", "password", UserRole.COLLABORATOR);
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)));

        User user = userRepository.findByEmail("test@example.com").orElseThrow();
        String token = UUID.randomUUID().toString();
        user.setPasswordResetToken(token);
        user.setPasswordResetTokenExpiry(OffsetDateTime.now().plusHours(1));
        userRepository.save(user);

        ResetPasswordRequest resetPasswordRequest = new ResetPasswordRequest(token, "ValidPass1!");

        mockMvc.perform(post("/api/auth/reset-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(resetPasswordRequest)))
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("Password has been reset successfully.")));

        User updatedUser = userRepository.findByEmail("test@example.com").orElseThrow();
        assertTrue(passwordEncoder.matches("ValidPass1!", updatedUser.getPassword()));
    }

    @Test
    void resetPassword_InvalidToken_ReturnsBadRequest() throws Exception {
        ResetPasswordRequest resetPasswordRequest = new ResetPasswordRequest("invalid-token", "ValidPass1!");

        mockMvc.perform(post("/api/auth/reset-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(resetPasswordRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string(containsString("Invalid password reset token.")));
    }

    @Test
    void resetPassword_ExpiredToken_ReturnsBadRequest() throws Exception {
        // Register a user and set an expired reset token
        RegisterRequest registerRequest = new RegisterRequest("test@example.com", "password", UserRole.COLLABORATOR);
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)));

        User user = userRepository.findByEmail("test@example.com").orElseThrow();
        String token = UUID.randomUUID().toString();
        user.setPasswordResetToken(token);
        user.setPasswordResetTokenExpiry(OffsetDateTime.now().minusHours(1)); // Expired token
        userRepository.save(user);

        ResetPasswordRequest resetPasswordRequest = new ResetPasswordRequest(token, "ValidPass1!");

        mockMvc.perform(post("/api/auth/reset-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(resetPasswordRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string(containsString("Password reset token has expired.")));
    }
}
