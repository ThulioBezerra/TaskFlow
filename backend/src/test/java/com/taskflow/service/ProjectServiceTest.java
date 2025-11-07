package com.taskflow.service;

import com.taskflow.model.Project;
import com.taskflow.model.User;
import com.taskflow.repository.ProjectRepository;
import com.taskflow.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Optional;
import java.util.UUID;
import java.time.OffsetDateTime;
import com.taskflow.model.UserRole;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ProjectServiceTest {

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ProjectService projectService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void createProject_success() {
        User manager = User.builder()
                .id(UUID.fromString("a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"))
                .email("manager@example.com")
                .password("password")
                .role(UserRole.COLLABORATOR)
                .createdAt(OffsetDateTime.now())
                .build();
        Project project = new Project(null, "Test Project", "Description", new java.util.ArrayList<>(), null);

        when(userRepository.findById(manager.getId())).thenReturn(Optional.of(manager));
        when(projectRepository.save(any(Project.class))).thenReturn(project);

        Project createdProject = projectService.createProject(project, manager.getId(), Arrays.asList(UUID.fromString("c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11")));

        assertNotNull(createdProject);
        assertEquals("Test Project", createdProject.getName());
        assertEquals(manager, createdProject.getManager());
        assertTrue(createdProject.getMembers().contains(manager));
        verify(projectRepository, times(1)).save(project);
    }

    @Test
    void createProject_managerNotFound_throwsException() {
        Project project = new Project(null, "Test Project", "Description", new java.util.ArrayList<>(), null);
        UUID managerId = UUID.fromString("a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11");
        when(userRepository.findById(managerId)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> {
            projectService.createProject(project, managerId, null);
        });
        verify(projectRepository, never()).save(any(Project.class));
    }

    @Test
    void addMembersToProject_success() {
        User existingMember = User.builder()
                .id(UUID.fromString("a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"))
                .email("existing@example.com")
                .password("password")
                .role(UserRole.COLLABORATOR)
                .createdAt(OffsetDateTime.now())
                .build();
        User newMember = User.builder()
                .id(UUID.fromString("c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"))
                .role(UserRole.COLLABORATOR)
                .createdAt(OffsetDateTime.now())
                .build();
        Project project = new Project(UUID.fromString("b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"), "Test Project", "Description", Arrays.asList(existingMember), existingMember);

        when(projectRepository.findById(project.getId())).thenReturn(Optional.of(project));
        when(userRepository.findAllById(Arrays.asList(newMember.getId()))).thenReturn(Arrays.asList(newMember));
        when(projectRepository.save(any(Project.class))).thenReturn(project);

        List<UUID> members = new ArrayList<>();
        members.add(newMember.getId());
        Project updatedProject = projectService.addMembersToProject(project.getId(), members);

        assertNotNull(updatedProject);
        assertTrue(updatedProject.getMembers().contains(newMember));
        assertEquals(2, updatedProject.getMembers().size());
        verify(projectRepository, times(1)).save(project);
    }

    @Test
    void addMembersToProject_projectNotFound_throwsException() {
        UUID projectId = UUID.fromString("b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11");
        when(projectRepository.findById(projectId)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> {
            projectService.addMembersToProject(projectId, Arrays.asList(UUID.fromString("c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11")));
        });
        verify(projectRepository, never()).save(any(Project.class));
    }

    @Test
    void updateProject_success() {
        User manager = User.builder()
                .id(UUID.fromString("a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"))
                .email("manager@example.com")
                .password("password")
                .role(UserRole.COLLABORATOR)
                .createdAt(OffsetDateTime.now())
                .build();
        Project existingProject = new Project(UUID.fromString("b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"), "Old Name", "Old Description", Arrays.asList(manager), manager);
        Project updatedDetails = new Project(null, "New Name", "New Description", new java.util.ArrayList<>(), null);

        when(projectRepository.findById(existingProject.getId())).thenReturn(Optional.of(existingProject));
        when(projectRepository.save(any(Project.class))).thenReturn(existingProject);

        Project result = projectService.updateProject(existingProject.getId(), updatedDetails);

        assertNotNull(result);
        assertEquals("New Name", result.getName());
        assertEquals("New Description", result.getDescription());
        verify(projectRepository, times(1)).save(existingProject);
    }

    @Test
    void updateProject_projectNotFound_throwsException() {
        Project updatedDetails = new Project(null, "New Name", "New Description", new java.util.ArrayList<>(), null);
        UUID projectId = UUID.fromString("b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11");
        when(projectRepository.findById(projectId)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> {
            projectService.updateProject(projectId, updatedDetails);
        });
        verify(projectRepository, never()).save(any(Project.class));
    }

    @Test
    void getProjectById_success() {
        User manager = User.builder()
                .id(UUID.fromString("a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"))
                .email("manager@example.com")
                .password("password")
                .role(UserRole.MANAGER)
                .createdAt(OffsetDateTime.now())
                .build();
        Project project = new Project(UUID.fromString("b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"), "Test Project", "Description", Arrays.asList(manager), manager);

        when(projectRepository.findById(project.getId())).thenReturn(Optional.of(project));

        Optional<Project> foundProject = projectService.getProjectById(project.getId());

        assertTrue(foundProject.isPresent());
        assertEquals("Test Project", foundProject.get().getName());
    }

    @Test
    void getProjectById_notFound() {
        UUID projectId = UUID.fromString("b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11");
        when(projectRepository.findById(projectId)).thenReturn(Optional.empty());

        Optional<Project> foundProject = projectService.getProjectById(projectId);

        assertFalse(foundProject.isPresent());
    }

    @Test
    void getAllProjects_success() {
        User manager = User.builder()
                .id(UUID.fromString("a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"))
                .email("manager@example.com")
                .password("password")
                .role(UserRole.MANAGER)
                .createdAt(OffsetDateTime.now())
                .build();
        Project project1 = new Project(UUID.fromString("b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"), "Project 1", "Desc 1", Arrays.asList(manager), manager);
        Project project2 = new Project(UUID.fromString("d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"), "Project 2", "Desc 2", Arrays.asList(manager), manager);

        when(projectRepository.findAll()).thenReturn(Arrays.asList(project1, project2));

        List<Project> projects = projectService.getAllProjects();

        assertNotNull(projects);
        assertEquals(2, projects.size());
        assertTrue(projects.contains(project1));
        assertTrue(projects.contains(project2));
    }
}
