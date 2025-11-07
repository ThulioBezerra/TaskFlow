// package com.taskflow.service;

// import java.time.OffsetDateTime;
// import java.util.Optional;
// import java.util.UUID;

// import static org.junit.jupiter.api.Assertions.assertEquals;
// import static org.junit.jupiter.api.Assertions.assertNotNull;
// import static org.junit.jupiter.api.Assertions.assertNull;
// import static org.junit.jupiter.api.Assertions.assertThrows;
// import org.junit.jupiter.api.BeforeEach;
// import org.junit.jupiter.api.Test;
// import org.junit.jupiter.api.extension.ExtendWith;
// import static org.mockito.ArgumentMatchers.any;
// import org.mockito.InjectMocks;
// import org.mockito.Mock;
// import static org.mockito.Mockito.never;
// import static org.mockito.Mockito.times;
// import static org.mockito.Mockito.verify;
// import static org.mockito.Mockito.when;
// import org.mockito.junit.jupiter.MockitoExtension;

// import com.taskflow.dto.CreateTaskRequest;
// import com.taskflow.dto.TaskDto;
// import com.taskflow.dto.UpdateTaskRequest;
// import com.taskflow.exception.ResourceNotFoundException;
// import com.taskflow.model.Project;
// import com.taskflow.model.Task;
// import com.taskflow.model.TaskPriority;
// import com.taskflow.model.User;
// import com.taskflow.repository.ProjectRepository;
// import com.taskflow.repository.TaskRepository;
// import com.taskflow.repository.UserRepository;

// @ExtendWith(MockitoExtension.class)
// public class TaskServiceTest {

//     @Mock
//     private TaskRepository taskRepository;
//     @Mock
//     private UserRepository userRepository;
//     @Mock
//     private ProjectRepository projectRepository;
//     @Mock
//     private GamificationService gamificationService;

//     @InjectMocks
//     private TaskService taskService;

//     private UUID authorId;
//     private User author;
//     private UUID projectId;
//     private Project project;
//     private UUID taskId;
//     private Task task;

//     @BeforeEach
//     void setUp() {
//         authorId = UUID.randomUUID();
//         author = User.builder().id(authorId).email("author@example.com").build();

//         projectId = UUID.randomUUID();
//         project = new Project(projectId, "Test Project", "Description", new java.util.ArrayList<>(), null);

//         taskId = UUID.randomUUID();
//         task = Task.builder()
//                 .id(taskId)
//                 .title("Original Task")
//                 .description("Original Description")
//                 .priority(TaskPriority.MEDIUM)
//                 .author(author)
//                 .assignee(author) // Ensure assignee is not null
//                 .createdAt(OffsetDateTime.now())
//                 .build();
//     }

//     @Test
//     void createTask_shouldCreateTaskWithProject() {
//         CreateTaskRequest request = CreateTaskRequest.builder()
//                 .title("New Task")
//                 .description("Task Description")
//                 .priority(TaskPriority.HIGH)
//                 .projectId(java.util.Optional.of(projectId))
//                 .build();

//         when(userRepository.findById(authorId)).thenReturn(Optional.of(author));
//         when(projectRepository.findById(projectId)).thenReturn(Optional.of(project));
//         when(taskRepository.save(any(Task.class))).thenAnswer(invocation -> {
//             Task savedTask = invocation.getArgument(0);
//             savedTask.setId(UUID.randomUUID());
//             return savedTask;
//         });

//         TaskDto result = taskService.createTask(request, authorId);

//         assertNotNull(result);
//         assertEquals("New Task", result.title());
//         assertEquals(projectId, result.project().id());
//         verify(taskRepository, times(1)).save(any(Task.class));
//     }

//     @Test
//     void createTask_shouldCreateTaskWithoutProject() {
//         CreateTaskRequest request = CreateTaskRequest.builder()
//                 .title("New Task")
//                 .description("Task Description")
//                 .priority(TaskPriority.HIGH)
//                 .projectId(java.util.Optional.empty())
//                 .build();

//         when(userRepository.findById(authorId)).thenReturn(Optional.of(author));
//         when(taskRepository.save(any(Task.class))).thenAnswer(invocation -> {
//             Task savedTask = invocation.getArgument(0);
//             savedTask.setId(UUID.randomUUID());
//             return savedTask;
//         });

//         TaskDto result = taskService.createTask(request, authorId);

//         assertNotNull(result);
//         assertEquals("New Task", result.title());
//         assertNull(result.project());
//         verify(taskRepository, times(1)).save(any(Task.class));
//         verify(projectRepository, never()).findById(any(UUID.class));
//     }

//     @Test
//     void createTask_shouldThrowExceptionIfProjectNotFound() {
//         CreateTaskRequest request = CreateTaskRequest.builder()
//                 .title("New Task")
//                 .description("Task Description")
//                 .priority(TaskPriority.HIGH)
//                 .projectId(java.util.Optional.of(projectId))
//                 .build();

//         when(userRepository.findById(authorId)).thenReturn(Optional.of(author));
//         when(projectRepository.findById(projectId)).thenReturn(Optional.empty());

//         assertThrows(ResourceNotFoundException.class, () -> taskService.createTask(request, authorId));
//         verify(taskRepository, never()).save(any(Task.class));
//     }

//     @Test
//     void updateTask_shouldUpdateTaskWithNewProject() {
//         task.setProject(null); // Start without a project
//         UpdateTaskRequest request = UpdateTaskRequest.builder()
//                 .projectId(java.util.Optional.of(projectId))
//                 .build();

//         when(taskRepository.findById(taskId)).thenReturn(Optional.of(task));
//         when(projectRepository.findById(projectId)).thenReturn(Optional.of(project));
//         when(taskRepository.save(any(Task.class))).thenReturn(task);

//         TaskDto result = taskService.updateTask(taskId, request);

//         assertNotNull(result);
//         assertEquals(projectId, result.project().id());
//         verify(taskRepository, times(1)).save(any(Task.class));
//     }

//     @Test
//     void updateTask_shouldDisassociateTaskFromProject() {
//         task.setProject(project); // Start with a project
//         UpdateTaskRequest request = UpdateTaskRequest.builder()
//                 .projectId(java.util.Optional.ofNullable(null))
//                 .build();

//         when(taskRepository.findById(taskId)).thenReturn(Optional.of(task));
//         when(taskRepository.save(any(Task.class))).thenReturn(task);

//         TaskDto result = taskService.updateTask(taskId, request);

//         assertNotNull(result);
//         assertNull(result.project());
//         verify(taskRepository, times(1)).save(any(Task.class));
//     }

//     @Test
//     void updateTask_shouldChangeProjectToDifferentProject() {
//         UUID oldProjectId = UUID.randomUUID();
//         Project oldProject = new Project(oldProjectId, "Old Project", "Old Description", new java.util.ArrayList<>(),
//                 null);
//         task.setProject(oldProject); // Start with an old project

//         UpdateTaskRequest request = UpdateTaskRequest.builder()
//                 .projectId(java.util.Optional.of(projectId))
//                 .build();

//         when(taskRepository.findById(taskId)).thenReturn(Optional.of(task));
//         when(projectRepository.findById(projectId)).thenReturn(Optional.of(project));
//         when(taskRepository.save(any(Task.class))).thenReturn(task);

//         TaskDto result = taskService.updateTask(taskId, request);

//         assertNotNull(result);
//         assertEquals(projectId, result.project().id());
//         verify(taskRepository, times(1)).save(any(Task.class));
//     }

//     @Test
//     void updateTask_shouldThrowExceptionIfProjectNotFound() {
//         UpdateTaskRequest request = UpdateTaskRequest.builder()
//                 .projectId(java.util.Optional.of(projectId))
//                 .build();

//         when(taskRepository.findById(taskId)).thenReturn(Optional.of(task));
//         when(projectRepository.findById(projectId)).thenReturn(Optional.empty());

//         assertThrows(ResourceNotFoundException.class, () -> taskService.updateTask(taskId, request));
//         verify(taskRepository, never()).save(any(Task.class));
//     }

//     @Test
//     void updateTask_shouldUpdateOtherFieldsWhileKeepingProject() {
//         task.setProject(project); // Task already has a project
//         UpdateTaskRequest request = UpdateTaskRequest.builder()
//                 .title("Updated Title")
//                 .description("Updated Description")
//                 .projectId(java.util.Optional.of(task.getProject().getId())) // Explicitly keep the existing project
//                 .build();

//         when(taskRepository.findById(taskId)).thenReturn(Optional.of(task));
//         when(projectRepository.findById(task.getProject().getId())).thenReturn(Optional.of(project));
//         when(taskRepository.save(any(Task.class))).thenReturn(task);

//         TaskDto result = taskService.updateTask(taskId, request);

//         assertNotNull(result);
//         assertEquals("Updated Title", result.title());
//         assertEquals("Updated Description", result.description());
//         assertEquals(projectId, result.project().id()); // Project should remain unchanged
//         verify(taskRepository, times(1)).save(any(Task.class));
//     }
// }