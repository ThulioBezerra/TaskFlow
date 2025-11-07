package com.taskflow.controller;

import java.time.LocalDate;

import static org.hamcrest.Matchers.hasSize;
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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.taskflow.config.CustomUserDetails;
import com.taskflow.dto.CreateTaskRequest;
import com.taskflow.dto.TaskDto;
import com.taskflow.dto.UpdateTaskRequest;
import com.taskflow.model.Project;
import com.taskflow.model.TaskPriority;
import com.taskflow.model.TaskStatus;
import com.taskflow.model.User;
import com.taskflow.model.UserRole;
import com.taskflow.repository.ProjectRepository;
import com.taskflow.repository.TaskRepository;
import com.taskflow.repository.UserRepository;
import com.taskflow.service.AuthService;
import com.taskflow.service.TaskService;

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

        @Autowired
        private ProjectRepository projectRepository;

        private TaskDto task;
        private User assignee;
        private User authorUser;
        private Project testProject;

        @BeforeEach
        void setUp() {
                taskRepository.deleteAll();
                userRepository.deleteAll();
                projectRepository.deleteAll();

                authorUser = userRepository.save(User.builder()
                                .email("test@example.com")
                                .password("password")
                                .role(UserRole.COLLABORATOR)
                                .build());

                testProject = projectRepository.save(new Project(null,
                                "Integration Test Project",
                                "Project for testing task associations",
                                new java.util.ArrayList<>(),
                                authorUser));

                task = taskService.createTask(
                                new CreateTaskRequest("Test Task", "Test Description", TaskPriority.MEDIUM,
                                                java.util.Optional.of(testProject.getId())),
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
                CreateTaskRequest request = new CreateTaskRequest("New Task", "New Description", TaskPriority.LOW,
                                java.util.Optional.empty());

                mockMvc.perform(post("/api/tasks")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request)))
                                .andExpect(status().isCreated())
                                .andExpect(jsonPath("$.title").value("New Task"))
                                .andExpect(jsonPath("$.description").value("New Description"))
                                .andExpect(jsonPath("$.priority").value("LOW"));
        }

        @Test
        void createTask_WithProject_Success() throws Exception {
                CreateTaskRequest request = new CreateTaskRequest("Project Task", "Task for project",
                                TaskPriority.MEDIUM, java.util.Optional.of(testProject.getId()));

                mockMvc.perform(post("/api/tasks")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request)))
                                .andExpect(status().isCreated())
                                .andExpect(jsonPath("$.title").value("Project Task"))
                                .andExpect(jsonPath("$.project.id").value(testProject.getId().toString()));
        }

        @Test
        void getTasks_Success() throws Exception {
                taskService.createTask(
                                new CreateTaskRequest("Task 1", "Description 1", TaskPriority.HIGH,
                                                java.util.Optional.empty()),
                                authorUser.getId());
                taskService.createTask(
                                new CreateTaskRequest("Task 2", "Description 2", TaskPriority.MEDIUM,
                                                java.util.Optional.empty()),
                                authorUser.getId());

                mockMvc.perform(get("/api/tasks"))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$", hasSize(3)));
        }

        @Test
        void updateTask_Success() throws Exception {
                UpdateTaskRequest request = new UpdateTaskRequest("Updated Title", "Updated Description",
                                TaskPriority.HIGH,
                                LocalDate.now(), assignee.getId(), TaskStatus.IN_PROGRESS,
                                java.util.Optional.of(testProject.getId()));

                mockMvc.perform(put("/api/tasks/" + task.id())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.title").value("Updated Title"))
                                .andExpect(jsonPath("$.description").value("Updated Description"))
                                .andExpect(jsonPath("$.priority").value("HIGH"))
                                .andExpect(jsonPath("$.assignee.id").value(assignee.getId().toString()))
                                .andExpect(jsonPath("$.status").value(String.valueOf(TaskStatus.IN_PROGRESS)));
        }

        @Test
        void updateTask_AssociateWithProject_Success() throws Exception {
                // Create a task without a project initially
                TaskDto taskWithoutProject = taskService.createTask(
                                new CreateTaskRequest("Task No Project", "Desc", TaskPriority.LOW,
                                                java.util.Optional.empty()),
                                authorUser.getId());

                UpdateTaskRequest request = new UpdateTaskRequest(null, null, null, null, null, null,
                                java.util.Optional.of(testProject.getId()));

                mockMvc.perform(put("/api/tasks/" + taskWithoutProject.id())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.project.id").value(testProject.getId().toString()));
        }

        @Test
        void updateTask_DisassociateFromProject_Success() throws Exception {
                // Task 'task' is already associated with 'testProject' from setUp
                UpdateTaskRequest request = new UpdateTaskRequest(null, null, null, null, null, null,
                                java.util.Optional.ofNullable(null));

                mockMvc.perform(put("/api/tasks/" + task.id())
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.name").doesNotExist());
        }
}

