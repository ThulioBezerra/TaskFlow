package com.taskflow.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.taskflow.config.WithMockCustomUser;
import com.taskflow.dto.CreateTaskRequest;
import com.taskflow.dto.RegisterRequest;
import com.taskflow.dto.UpdateTaskRequest;
import com.taskflow.model.Priority;
import com.taskflow.model.Task;
import com.taskflow.model.User;
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
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.hamcrest.Matchers.hasSize;

@SpringBootTest
@AutoConfigureMockMvc
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

    @BeforeEach
    void setUp() {
        taskRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    @WithMockCustomUser
    void createTask_Success() throws Exception {
        authService.register(new RegisterRequest("test@example.com", "password"));

        CreateTaskRequest createTaskRequest = new CreateTaskRequest("Test Task", "Test Description");

        mockMvc.perform(post("/api/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createTaskRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Test Task"))
                .andExpect(jsonPath("$.description").value("Test Description"))
                .andExpect(jsonPath("$.status").value("TO_DO"));
    }

    @Test
    @WithMockCustomUser
    void getTasks_Success() throws Exception {
        authService.register(new RegisterRequest("test@example.com", "password"));
        taskService.createTask(new CreateTaskRequest("Task 1", "Desc 1"));
        taskService.createTask(new CreateTaskRequest("Task 2", "Desc 2"));

        mockMvc.perform(get("/api/tasks"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)));
    }

    @Test
    @WithMockCustomUser
    void updateTask_Success() throws Exception {
        authService.register(new RegisterRequest("test@example.com", "password"));
        User assignee = userRepository.save(User.builder().email("assignee@example.com").password("password").role(com.taskflow.model.Role.COLLABORATOR).build());
        Task task = taskService.createTask(new CreateTaskRequest("Test Task", "Test Description"));

        UpdateTaskRequest updateRequest = UpdateTaskRequest.builder()
                .title("Updated Title")
                .description("Updated Description")
                .priority(Priority.HIGH)
                .dueDate(LocalDate.of(2025, 12, 31))
                .assigneeId(assignee.getId())
                .build();

        mockMvc.perform(put("/api/tasks/" + task.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Updated Title"))
                .andExpect(jsonPath("$.description").value("Updated Description"))
                .andExpect(jsonPath("$.priority").value("HIGH"))
                .andExpect(jsonPath("$.dueDate").value("2025-12-31"))
                .andExpect(jsonPath("$.assignee.id").value(assignee.getId()));
    }
}
