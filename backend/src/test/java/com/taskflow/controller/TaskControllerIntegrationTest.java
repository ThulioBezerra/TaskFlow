package com.taskflow.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.taskflow.config.CustomUserDetails;
import com.taskflow.dto.CreateTaskRequest;
import com.taskflow.dto.TaskDto;
import com.taskflow.dto.UpdateTaskRequest;
import com.taskflow.model.TaskPriority;
import com.taskflow.model.User;
import com.taskflow.model.UserRole;
import com.taskflow.repository.TaskRepository;
import com.taskflow.repository.UserRepository;
import com.taskflow.service.AuthService;
import com.taskflow.service.TaskService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
class TaskControllerIntegrationTest {

        @Autowired
        private MockMvc mockMvc;

        @Autowired
        private ObjectMapper objectMapper;

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private TaskRepository taskRepository;

        @Autowired
        private AuthService authService;

        @Autowired
        private TaskService taskService;

        private TaskDto task;
        private User assignee;
        private User authorUser;

        @BeforeEach
        void setUp() {
                taskRepository.deleteAll();
                userRepository.deleteAll();

                authorUser = userRepository.save(User.builder()
                                .email("test@example.com")
                                .password("password")
                                .role(UserRole.COLLABORATOR)
                                .build());

                task = taskService.createTask(
                                new CreateTaskRequest("Test Task", "Test Description", TaskPriority.MEDIUM),
                                authorUser.getId());

                assignee = userRepository.save(User.builder()
                                .email("assignee@example.com")
                                .password("password")
                                .role(UserRole.COLLABORATOR)
                                .build());

                // Manually set up security context
                CustomUserDetails customUserDetails = new CustomUserDetails(authorUser);
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                                customUserDetails, null, customUserDetails.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        @Test
        void createTask_Success() throws Exception {
                CreateTaskRequest request = new CreateTaskRequest("New Task", "New Description", TaskPriority.LOW);

                mockMvc.perform(post("/api/tasks")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request)))
                                .andExpect(status().isCreated())
                                .andExpect(jsonPath("$.title").value("New Task"))
                                .andExpect(jsonPath("$.description").value("New Description"))
                                .andExpect(jsonPath("$.priority").value("LOW"));
        }

        @Test
        void getTasks_Success() throws Exception {
                taskService.createTask(new CreateTaskRequest("Task 1", "Description 1", TaskPriority.HIGH),
                                authorUser.getId());
                taskService.createTask(new CreateTaskRequest("Task 2", "Description 2", TaskPriority.MEDIUM),
                                authorUser.getId());

                mockMvc.perform(get("/api/tasks"))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$", hasSize(3)));
        }

        @Test
        void updateTask_Success() throws Exception {
                UpdateTaskRequest request = new UpdateTaskRequest("Updated Title", "Updated Description",
                                TaskPriority.HIGH,
                                LocalDate.now(), assignee.getId());

                mockMvc.perform(put("/api/tasks/" + task.id())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.title").value("Updated Title"))
                                .andExpect(jsonPath("$.description").value("Updated Description"))
                                .andExpect(jsonPath("$.priority").value("HIGH"))
                                .andExpect(jsonPath("$.assignee.id").value(assignee.getId().toString()));
        }
}

