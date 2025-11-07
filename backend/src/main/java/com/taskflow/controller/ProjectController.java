package com.taskflow.controller;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.taskflow.dto.CreateProjectRequest;
import com.taskflow.dto.ProjectResponse;
import com.taskflow.model.Project;
import com.taskflow.model.User;
import com.taskflow.service.ProjectService;
import com.taskflow.service.UserService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;
    private final UserService userService; // Assuming a UserService exists for fetching User details

    public ProjectController(ProjectService projectService, UserService userService) {
        this.projectService = projectService;
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<?> createProject(@Valid @RequestBody CreateProjectRequest request,
            BindingResult result) {
        if (result.hasErrors()) {
            return new ResponseEntity<>(result.getAllErrors(), HttpStatus.BAD_REQUEST);
        }

        // 1) Pega o usuário autenticado
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated()) {
            // Aqui você pode retornar 401 ou 403, dependendo da sua regra
            return new ResponseEntity<>("Unauthorized", HttpStatus.UNAUTHORIZED);
        }

        String email = auth.getName();
        User manager = userService.findByEmail(email);

        // 2) Monta o projeto
        Project project = new Project();
        project.setName(request.getName());
        project.setDescription(request.getDescription());

        Set<UUID> members = new LinkedHashSet<>();
        if (request.getMemberEmails() != null) {
            for (String memberEmail : request.getMemberEmails()) {
                User member = userService.findByEmail(memberEmail);
                if (member != null) {
                    members.add(member.getId());
                }
            }
        }
        members.add(manager.getId());

        List<UUID> memberIds = new ArrayList<>(members);
        // 3) Usa SEMPRE o ID do usuário logado como manager
        Project createdProject = projectService.createProject(
                project,
                manager.getId(), // managerId = usuário autenticado
                memberIds);

        return new ResponseEntity<>(convertToDto(createdProject), HttpStatus.CREATED);
    }

    // Helper method to convert Project entity to ProjectResponse DTO
    private ProjectResponse convertToDto(Project project) {
        ProjectResponse dto = new ProjectResponse();
        dto.setId(project.getId());
        dto.setName(project.getName());
        dto.setDescription(project.getDescription());

        if (project.getManager() != null) {
            dto.setManager(convertToUserDto(project.getManager()));
        }

        if (project.getMembers() != null) {
            List<ProjectResponse.UserDto> memberDtos = project.getMembers().stream()
                    .map(this::convertToUserDto)
                    .collect(Collectors.toList());
            dto.setMembers(memberDtos);
        }
        return dto;
    }

    @GetMapping
    public ResponseEntity<List<ProjectResponse>> getAllProjects() {
        List<Project> projects = projectService.getAllProjects();
        List<ProjectResponse> projectDtos = projects.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return new ResponseEntity<>(projectDtos, HttpStatus.OK);
    }

    @GetMapping("/user")
    public ResponseEntity<?> getAllProjectsForUser() {
        // 1) Pega o usuário autenticado
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated()) {
            // Aqui você pode retornar 401 ou 403, dependendo da sua regra
            return new ResponseEntity<>("Unauthorized", HttpStatus.UNAUTHORIZED);
        }

        String email = auth.getName();
        User user = userService.findByEmail(email);

        List<Project> projects = projectService.getAllProjectsForUser(user);
        List<ProjectResponse> projectDtos = projects.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return new ResponseEntity<>(projectDtos, HttpStatus.OK);
    }

    @GetMapping("/{projectId}")
    public ResponseEntity<ProjectResponse> getProjectById(@PathVariable UUID projectId) {
        // TODO: Implement authentication and authorization checks here
        // Only authenticated users who are members of the project should be able to
        // view it
        return projectService.getProjectById(projectId)
                .map(project -> new ResponseEntity<>(convertToDto(project), HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PutMapping("/{projectId}")
    public ResponseEntity<?> updateProject(@PathVariable UUID projectId,
            @Valid @RequestBody CreateProjectRequest request, BindingResult result) {
        // TODO: Implement authentication and authorization checks here
        // Only authenticated users with 'Manager' or 'Administrator' roles for this
        // project should be able to update it
        if (result.hasErrors()) {
            return new ResponseEntity<>(result.getAllErrors(), HttpStatus.BAD_REQUEST);
        }
        Project project = new Project();
        project.setName(request.getName());
        project.setDescription(request.getDescription());

        Project updatedProject = projectService.updateProject(projectId, project);
        return new ResponseEntity<>(convertToDto(updatedProject), HttpStatus.OK);
    }

    // Helper method to convert User entity to ProjectResponse.UserDto
    private ProjectResponse.UserDto convertToUserDto(User user) {
        return new ProjectResponse.UserDto(user.getId(), user.getEmail());
    }
}