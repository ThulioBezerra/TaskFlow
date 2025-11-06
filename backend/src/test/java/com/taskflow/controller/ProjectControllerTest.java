package com.taskflow.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.taskflow.dto.CreateProjectRequest;
import com.taskflow.model.Project;
import com.taskflow.model.User;
import com.taskflow.service.ProjectService;
import com.taskflow.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.Optional;
import java.util.UUID;
import java.time.OffsetDateTime;
import com.taskflow.model.UserRole;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProjectController.class)
class ProjectControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProjectService projectService;

    @MockBean
    private UserService userService; // Mock if ProjectController depends on it

    @Autowired
    private ObjectMapper objectMapper;

    private User manager;
    private Project project;

    @BeforeEach
    void setUp() {
        manager = User.builder()
                .id(UUID.fromString("a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"))
                .email("manager@example.com")
                .password("password")
                .role(UserRole.COLLABORATOR)
                .createdAt(OffsetDateTime.now())
                .build();
        project = new Project(UUID.fromString("b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"), "Test Project", "Description", Arrays.asList(manager), manager);
    }

    @Test
    void createProject_success() throws Exception {
        CreateProjectRequest request = new CreateProjectRequest("New Project", "New Desc", manager.getId(), Arrays.asList(UUID.fromString("c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11")));
        Project createdProject = new Project(UUID.fromString("d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"), "New Project", "New Desc", Arrays.asList(manager), manager);

        when(projectService.createProject(any(Project.class), any(UUID.class), any(java.util.List.class)))
                .thenReturn(createdProject);

        mockMvc.perform(post("/api/projects")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("New Project"));
    }

    @Test
    void createProject_validationError() throws Exception {
        CreateProjectRequest request = new CreateProjectRequest("", "New Desc", manager.getId(), Arrays.asList(UUID.fromString("c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"))); // Empty name

        mockMvc.perform(post("/api/projects")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void getProjectById_success() throws Exception {
        when(projectService.getProjectById(project.getId())).thenReturn(Optional.of(project));

        mockMvc.perform(get("/api/projects/{projectId}", project.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Test Project"));
    }

    @Test
    void getProjectById_notFound() throws Exception {
        when(projectService.getProjectById(UUID.fromString("e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"))).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/projects/{projectId}", UUID.fromString("e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11")))
                .andExpect(status().isNotFound());
    }

    @Test
    void updateProject_success() throws Exception {
        CreateProjectRequest request = new CreateProjectRequest("Updated Project", "Updated Desc", manager.getId(), null);
        Project updatedProject = new Project(project.getId(), "Updated Project", "Updated Desc", Arrays.asList(manager), manager);

        when(projectService.updateProject(any(UUID.class), any(Project.class)))
                .thenReturn(updatedProject);

        mockMvc.perform(put("/api/projects/{projectId}", project.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Updated Project"));
    }

    @Test
    void updateProject_validationError() throws Exception {
        CreateProjectRequest request = new CreateProjectRequest("", "Updated Desc", manager.getId(), null); // Empty name

        mockMvc.perform(put("/api/projects/{projectId}", project.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void getAllProjects_success() throws Exception {
        User user2 = User.builder()
                .id(UUID.fromString("f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"))
                .email("user2@example.com")
                .password("password")
                .role(UserRole.COLLABORATOR)
                .createdAt(OffsetDateTime.now())
                .build();
        Project project2 = new Project(UUID.fromString("g0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"), "Project 2", "Desc 2", Arrays.asList(user2), user2);

        when(projectService.getAllProjects()).thenReturn(Arrays.asList(project, project2));

        mockMvc.perform(get("/api/projects"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].name").value("Test Project"));
    }
}
