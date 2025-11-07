package com.taskflow.service;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.taskflow.dto.CreateTaskRequest;
import com.taskflow.dto.ProjectSummaryDto;
import com.taskflow.dto.TaskDto;
import com.taskflow.dto.UpdateTaskRequest;
import com.taskflow.dto.UserSummaryDto;
import com.taskflow.exception.ResourceNotFoundException;
import com.taskflow.model.Project;
import com.taskflow.model.Task;
import com.taskflow.model.TaskStatus;
import com.taskflow.model.User;
import com.taskflow.repository.ProjectRepository;
import com.taskflow.repository.TaskRepository;
import com.taskflow.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository; // Inject ProjectRepository
    private final GamificationService gamificationService;

    public List<TaskDto> getTasks() {
        return taskRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public TaskDto createTask(CreateTaskRequest request, UUID authorId) {
        User author = userRepository.findById(authorId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setPriority(request.getPriority());
        task.setAuthor(author);
        task.setCreatedAt(OffsetDateTime.now());
        task.setStatus(com.taskflow.model.TaskStatus.TO_DO);

        request.getProjectId().ifPresent(projectId -> {
            Project project = projectRepository.findById(projectId)
                    .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
            task.setProject(project);
        });

        Task savedTask = taskRepository.save(task);
        return toDto(savedTask);
    }

    public TaskDto updateTask(UUID id, UpdateTaskRequest request) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        if (request.getTitle() != null)
            task.setTitle(request.getTitle());
        if (request.getDescription() != null)
            task.setDescription(request.getDescription());
        if (request.getPriority() != null)
            task.setPriority(request.getPriority());
        if (request.getDueDate() != null)
            task.setDueDate(request.getDueDate());

        if (request.getAssigneeId() != null) {
            User assignee = userRepository.findById(request.getAssigneeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Assignee not found"));
            task.setAssignee(assignee);
        }

        if (request.getStatus() != null) {
            task.setStatus(request.getStatus());
            if (request.getStatus() == TaskStatus.COMPLETED) {
                gamificationService.checkAndAwardBadges(task.getAssignee());
            }
        }

        // ✅ TRI-ESTADO para projectId:
        // null -> não tocar (campo ausente no payload)
        // Optional.of -> associar ao projeto informado
        // Optional.empty() -> DESASSOCIAR (set null)
        if (request.getProjectId() != null) {
            if (request.getProjectId().isPresent()) {
                UUID projectId = request.getProjectId().get();
                Project project = projectRepository.findById(projectId)
                        .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
                task.setProject(project);
            } else {
                task.setProject(null); // remover associação
            }
        }

        Task updatedTask = taskRepository.save(task);
        return toDto(updatedTask);
    }

    private TaskDto toDto(Task task) {
        UserSummaryDto assigneeSummary = null;
        if (task.getAssignee() != null) {
            assigneeSummary = new UserSummaryDto(task.getAssignee().getId(), task.getAssignee().getEmail());
        }

        ProjectSummaryDto projectSummary = null;
        if (task.getProject() != null) {
            projectSummary = new ProjectSummaryDto(task.getProject().getId(), task.getProject().getName());
        }

        return new TaskDto(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getStatus(),
                task.getPriority(),
                task.getDueDate(),
                task.getCreatedAt(),
                assigneeSummary,
                projectSummary);
    }

    public Task getTaskById(UUID taskId) {
        return taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with ID: " + taskId));
    }
}
