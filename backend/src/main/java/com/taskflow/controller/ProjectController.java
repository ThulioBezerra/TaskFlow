package com.taskflow.controller;

import com.taskflow.dto.CreateProjectRequest;
import com.taskflow.dto.ProjectResponse;
import com.taskflow.model.Project;
import com.taskflow.model.User;
import com.taskflow.service.ProjectService;
import com.taskflow.service.UserService;
import jakarta.validation.Valid;
import org.springframework.validation.BindingResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;
import java.util.UUID;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;
    private final UserService userService; // Assuming a UserService exists for fetching User details

    @Autowired
    public ProjectController(ProjectService projectService, UserService userService) {
        this.projectService = projectService;
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<?> createProject(@Valid @RequestBody CreateProjectRequest request, BindingResult result) {
        // TODO: Implement authentication and authorization checks here
        // Only authenticated users with appropriate roles should be able to create projects
        if (result.hasErrors()) {
            return new ResponseEntity<>(result.getAllErrors(), HttpStatus.BAD_REQUEST);
        }
        Project project = new Project();
        project.setName(request.getName());
        project.setDescription(request.getDescription());

        // For now, we'll assume the managerId from the request is the creating user.
        // In a real app, this would come from the authenticated user's context.
        Project createdProject = projectService.createProject(project, request.getManagerId(), request.getMemberIds());
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
        // TODO: Implement authentication and authorization checks here
        // Only authenticated users should be able to view projects, potentially filtered by membership
        List<Project> projects = projectService.getAllProjects();
        List<ProjectResponse> projectDtos = projects.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return new ResponseEntity<>(projectDtos, HttpStatus.OK);
    }

    @GetMapping("/{projectId}")
    public ResponseEntity<ProjectResponse> getProjectById(@PathVariable UUID projectId) {
        // TODO: Implement authentication and authorization checks here
        // Only authenticated users who are members of the project should be able to view it
        return projectService.getProjectById(projectId)
                .map(project -> new ResponseEntity<>(convertToDto(project), HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PutMapping("/{projectId}")
    public ResponseEntity<?> updateProject(@PathVariable UUID projectId, @Valid @RequestBody CreateProjectRequest request, BindingResult result) {
        // TODO: Implement authentication and authorization checks here
        // Only authenticated users with 'Manager' or 'Administrator' roles for this project should be able to update it
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