package com.taskflow.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.taskflow.model.Project;
import com.taskflow.model.User;
import com.taskflow.repository.ProjectRepository;
import com.taskflow.repository.UserRepository;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    @Autowired
    public ProjectService(ProjectRepository projectRepository, UserRepository userRepository) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }

    public Project createProject(Project project, UUID managerId, List<UUID> memberIds) {
        User manager = userRepository.findById(managerId)
                .orElseThrow(() -> new IllegalArgumentException("Manager not found"));

        project.setManager(manager);

        if (memberIds != null && !memberIds.isEmpty()) {
            List<User> members = userRepository.findAllById(memberIds);
            project.setMembers(members);
        }

        // opcional: garantir que o manager também é membro
        if (project.getMembers() == null || project.getMembers().isEmpty()) {
            project.setMembers(List.of(manager));
        } else if (!project.getMembers().contains(manager)) {
            project.getMembers().add(manager);
        }

        return projectRepository.save(project);
    }

    public Optional<Project> getProjectById(UUID id) {
        return projectRepository.findById(id);
    }

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public Project updateProject(UUID id, Project updatedProject) {
        return projectRepository.findById(id)
                .map(project -> {
                    project.setName(updatedProject.getName());
                    project.setDescription(updatedProject.getDescription());
                    project.setWebhookUrl(updatedProject.getWebhookUrl());
                    project.setNotificationEvents(updatedProject.getNotificationEvents());
                    // Members and manager updates would be more complex and handled in separate
                    // methods
                    return projectRepository.save(project);
                })
                .orElseThrow(() -> new IllegalArgumentException("Project not found with ID: " + id));
    }

    public Project addMembersToProject(UUID projectId, List<UUID> userIds) {
        return projectRepository.findById(projectId)
                .map(project -> {
                    // Copia os membros existentes para uma lista mutável
                    List<User> existingMembers = new ArrayList<>(project.getMembers());
                    List<User> newMembers = userRepository.findAllById(userIds);

                    newMembers.forEach(newMember -> {
                        if (!existingMembers.contains(newMember)) {
                            existingMembers.add(newMember);
                        }
                    });

                    project.setMembers(existingMembers);
                    return projectRepository.save(project);
                })
                .orElseThrow(() -> new IllegalArgumentException("Project not found with ID: " + projectId));
    }
}
