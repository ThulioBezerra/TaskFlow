package com.taskflow.service;

import com.taskflow.dto.AddProjectMemberRequestDto;
import com.taskflow.dto.ProjectRequestDto;
import com.taskflow.dto.ProjectResponseDto;
import com.taskflow.model.Project;
import com.taskflow.model.ProjectMembership;
import com.taskflow.model.User;
import com.taskflow.model.UserRole;
import com.taskflow.repository.ProjectMembershipRepository;
import com.taskflow.repository.ProjectRepository;
import com.taskflow.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectMembershipRepository projectMembershipRepository;
    private final UserRepository userRepository;

    @Transactional
    public ProjectResponseDto createProject(ProjectRequestDto projectRequestDto, User currentUser) {
        Project project = new Project();
        project.setName(projectRequestDto.getName());
        project.setDescription(projectRequestDto.getDescription());
        Project savedProject = projectRepository.save(project);

        ProjectMembership membership = new ProjectMembership();
        membership.setProject(savedProject);
        membership.setUser(currentUser);
        membership.setRole(UserRole.MANAGER); // The creator is the manager
        projectMembershipRepository.save(membership);

        return convertToDto(savedProject);
    }

    @Transactional
    public void addMemberToProject(UUID projectId, AddProjectMemberRequestDto requestDto) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new EntityNotFoundException("Project not found"));
        User user = userRepository.findById(requestDto.getUserId())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        ProjectMembership membership = new ProjectMembership();
        membership.setProject(project);
        membership.setUser(user);
        membership.setRole(requestDto.getRole());
        projectMembershipRepository.save(membership);
    }

    @Transactional(readOnly = true)
    public List<ProjectResponseDto> getAllProjects() {
        return projectRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProjectResponseDto getProjectById(UUID projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new EntityNotFoundException("Project not found"));
        return convertToDto(project);
    }

    @Transactional
    public ProjectResponseDto updateProject(UUID projectId, ProjectRequestDto projectRequestDto) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new EntityNotFoundException("Project not found"));
        project.setName(projectRequestDto.getName());
        project.setDescription(projectRequestDto.getDescription());
        Project updatedProject = projectRepository.save(project);
        return convertToDto(updatedProject);
    }

    private ProjectResponseDto convertToDto(Project project) {
        ProjectResponseDto dto = new ProjectResponseDto();
        dto.setId(project.getId());
        dto.setName(project.getName());
        dto.setDescription(project.getDescription());
        dto.setCreatedAt(project.getCreatedAt());
        if (project.getMemberships() != null) {
            dto.setMembers(project.getMemberships().stream().map(membership -> {
                com.taskflow.dto.ProjectMemberDto memberDto = new com.taskflow.dto.ProjectMemberDto();
                memberDto.setUserId(membership.getUser().getId());
                memberDto.setEmail(membership.getUser().getEmail());
                memberDto.setRole(membership.getRole());
                return memberDto;
            }).collect(Collectors.toSet()));
        }
        return dto;
    }
}
