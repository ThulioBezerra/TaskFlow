package com.taskflow.service;

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
import com.taskflow.model.TaskPriority;
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
    private final ProjectRepository projectRepository;
    private final GamificationService gamificationService;
    private final NotificationService notificationService;

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
        task.setStatus(TaskStatus.TO_DO);
        task.setAuthor(author);

        // se não veio prioridade, define uma default:
        task.setPriority(
                request.getPriority() != null
                        ? request.getPriority()
                        : TaskPriority.MEDIUM);

        UUID projectId = request.getProjectId();
        if (projectId != null) {
            Project project = projectRepository.findById(projectId)
                    .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
            task.setProject(project);
        }

        Task savedTask = taskRepository.save(task);

        // Send notification
        if (task.getProject() != null && task.getProject().getWebhookUrl() != null &&
                task.getProject().getNotificationEvents() != null &&
                task.getProject().getNotificationEvents().contains("Task Created")) {
            String message = "Task Created: " + savedTask.getTitle();
            notificationService.sendNotification(task.getProject().getWebhookUrl(), message);
        }

        return toDto(savedTask);
    }

    public TaskDto updateTask(UUID id, UpdateTaskRequest request) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

        TaskStatus oldStatus = task.getStatus();

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
            if (request.getStatus() == TaskStatus.DONE) {
                gamificationService.checkAndAwardBadges(task.getAssignee());
            }
        }

        if (request.getProjectId() != null) {
            if (request.getProjectId().isPresent()) {
                UUID projectId = request.getProjectId().get();
                Project project = projectRepository.findById(projectId)
                        .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
                task.setProject(project);
            } else {
                task.setProject(null);
            }
        }

        Task updatedTask = taskRepository.save(task);

        // Send notification if status changed
        if (request.getStatus() != null && request.getStatus() != oldStatus &&
                task.getProject() != null && task.getProject().getWebhookUrl() != null &&
                task.getProject().getNotificationEvents() != null &&
                task.getProject().getNotificationEvents().contains("Task Status Changed")) {
            String message = "Task '" + updatedTask.getTitle() + "' status changed to: " + updatedTask.getStatus();
            notificationService.sendNotification(task.getProject().getWebhookUrl(), message);
        }

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

    public void deleteTask(UUID id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
        taskRepository.delete(task);
    }
}
