# Backend Architecture

The backend follows a classic layered architecture pattern to separate concerns, enhance maintainability, and improve testability. The primary layers are:
- **Controller:** Handles HTTP requests, data validation, and API responses.
- **Service:** Contains the core business logic.
- **Repository:** Manages data access and persistence.
- **Model:** Defines the data entities (JPA).

This structure is organized into packages as shown below.

## Directory Structure
```text
backend/
└── src/main/java/com/taskflow/
    ├── config/         # Security, WebSocket, and other bean configurations
    ├── controller/     # API endpoints (TaskController, AuthController)
    ├── dto/            # Data Transfer Objects (request/response models)
    ├── exception/      # Custom exception classes and global handlers
    ├── model/          # JPA Entities (Task, User, Project)
    ├── repository/     # Spring Data JPA interfaces (TaskRepository)
    ├── service/        # Business logic interfaces and implementations (TaskService)
    └── TaskflowApplication.java
```

## Model / Entity Layer
This layer contains the Plain Old Java Objects (POJOs) that are mapped to database tables using the Java Persistence API (JPA). These entities represent the core data models of the application. With the inclusion of **Lombok**, we significantly reduce boilerplate code like getters, setters, and constructors, resulting in cleaner and more maintainable entity classes.

### User.java
```java
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.OffsetDateTime;
import java.util.Set;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;

    @Column(nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @OneToMany(mappedBy = "assignee")
    private Set<Task> assignedTasks;

    @ManyToMany(mappedBy = "members")
    private Set<Project> projects;

    @OneToMany(mappedBy = "author")
    private Set<Comment> comments;

    @ManyToMany(mappedBy = "users")
    private Set<Badge> badges;
}

public enum UserRole {
    ADMINISTRATOR, MANAGER, COLLABORATOR
}
```

### Project.java
```java
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.OffsetDateTime;
import java.util.Set;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "projects")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private String name;

    private String description;

    @Column(nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Task> tasks;

    @ManyToMany
    @JoinTable(
        name = "project_members",
        joinColumns = @JoinColumn(name = "project_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> members;
}
```

### Task.java
```java
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.Set;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "tasks")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private String title;

    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TaskStatus status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TaskPriority priority;

    private LocalDate dueDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assignee_id")
    private User assignee;
    
    @Column(nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Comment> comments;

    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Attachment> attachments;
}

public enum TaskStatus {
    TO_DO, IN_PROGRESS, COMPLETED
}

public enum TaskPriority {
    LOW, MEDIUM, HIGH
}
```

### Comment.java
```java
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "comments")
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id", nullable = false)
    private Task task;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    private User author;

    @Column(nullable = false, updatable = false)
    private OffsetDateTime createdAt;
}
```

### Attachment.java
```java
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.OffsetDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "attachments")
public class Attachment {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private String fileName;

    @Column(nullable = false)
    private String fileUrl;

    private String fileType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id", nullable = false)
    private Task task;

    @Column(nullable = false, updatable = false)
    private OffsetDateTime uploadedAt;
}
```

### Badge.java
```java
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Set;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "badges")
public class Badge {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(unique = true, nullable = false)
    private String name;

    private String description;

    private String iconUrl;

    @ManyToMany
    @JoinTable(
        name = "user_badges",
        joinColumns = @JoinColumn(name = "badge_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> users;
}
```

## Repository Layer (Data Access)
This layer abstracts the data source. We use Spring Data JPA, which automatically creates repository implementations from interfaces, significantly reducing boilerplate code.

### Repository Example (`TaskRepository.java`)
```java
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface TaskRepository extends JpaRepository<Task, UUID> {
    
    // Spring Data JPA will automatically implement this method
    // based on the method name.
    List<Task> findByProjectId(UUID projectId);

    // Custom queries can be added here using @Query annotation if needed.
}
```

## Service Layer (Business Logic)
The service layer contains the application's core business logic. It orchestrates calls to repositories and other services to fulfill requests from the controller layer. It works with DTOs to receive data and return it to the web layer.

### Service Example (`TaskService.java`)
```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private TaskMapper taskMapper; // Imaginary mapper (e.g., MapStruct)

    @Transactional(readOnly = true)
    public TaskDTO getTaskById(UUID id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new TaskNotFoundException("Task not found with id: " + id));
        return taskMapper.toDto(task);
    }

    @Transactional
    public TaskDTO updateTask(UUID id, UpdateTaskDTO updateDto) {
        Task existingTask = taskRepository.findById(id)
                .orElseThrow(() -> new TaskNotFoundException("Task not found with id: " + id));

        // Update fields from DTO
        existingTask.setStatus(updateDto.getStatus());
        existingTask.setAssignee(getAssigneeReference(updateDto.getAssigneeId()));
        // ... other fields

        Task savedTask = taskRepository.save(existingTask);
        
        // Here you would also trigger notifications or gamification events
        
        return taskMapper.toDto(savedTask);
    }
}
```

## DTOs (Data Transfer Objects)
DTOs are used to transfer data between the client and the server. They help prevent exposing internal entity structures and can be tailored to the specific needs of a view, which is a security and performance best practice.

### Request DTO Example (`UpdateTaskDTO.java`)
This DTO is used as the request body for updating a task. It only contains the fields that are allowed to be changed.
```java
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

// Using Java 17 Record for a concise, immutable DTO
public record UpdateTaskDTO(
    String title,
    String description,
    
    @NotNull
    TaskStatus status,
    
    TaskPriority priority,
    UUID assigneeId
) {}
```

### Response DTO Example (`TaskDTO.java`)
This DTO represents the full task details sent back to the client. It's shaped to match the frontend's `Task` interface.
```java
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

public record TaskDTO(
    UUID id,
    String title,
    String description,
    TaskStatus status,
    TaskPriority priority,
    LocalDate dueDate,
    UserSummaryDTO assignee, // Another DTO to avoid exposing the full User entity
    UUID projectId,
    OffsetDateTime createdAt
) {}
```

## Controller Layer (API Endpoints)
The controller layer is the entry point for all API requests. It's responsible for validating input (using DTOs with validation annotations), calling the appropriate service method, and returning an HTTP response.

### Controller Example (`TaskController.java`)
```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.UUID;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @GetMapping("/{id}")
    public ResponseEntity<TaskDTO> getTaskById(@PathVariable UUID id) {
        TaskDTO task = taskService.getTaskById(id);
        return ResponseEntity.ok(task);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskDTO> updateTask(@PathVariable UUID id, @Valid @RequestBody UpdateTaskDTO taskDTO) {
        TaskDTO updatedTask = taskService.updateTask(id, taskDTO);
        // Here you would also broadcast the update via WebSocket
        return ResponseEntity.ok(updatedTask);
    }
}
```

## Authentication and Authorization
Security is handled by Spring Security. A custom filter chain is configured to protect endpoints and validate JSON Web Tokens (JWTs).

### Security Configuration (`SecurityConfig.java`)
This class sets up the security filter chain, defines public routes, and integrates the custom JWT filter.
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll() // Public endpoints
                .anyRequest().authenticated() // All other endpoints require auth
            )
            .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
}
```

### JWT Filter (`JwtAuthFilter.java`)
This filter intercepts every request. It extracts the JWT from the `Authorization` header, validates it, and if valid, sets the user's authentication context for the duration of the request.
```java
@Component
public class JwtAuthFilter extends OncePerRequestFilter {
    
    @Autowired
    private JwtService jwtService; // Service to handle JWT logic
    
    @Autowired
    private UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        final String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }
        
        final String jwt = authHeader.substring(7);
        final String userEmail = jwtService.extractUsername(jwt);

        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);
            if (jwtService.isTokenValid(jwt, userDetails)) {
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        filterChain.doFilter(request, response);
    }
}
```

## Error Handling
The backend uses a centralized exception handling mechanism. See the `Error Handling Strategy` section for details on the `@ControllerAdvice` implementation and the standard `ApiError` response format.
