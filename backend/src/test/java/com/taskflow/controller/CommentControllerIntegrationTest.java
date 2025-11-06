package com.taskflow.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.taskflow.config.CustomUserDetails;
import com.taskflow.dto.CreateCommentRequest;
import com.taskflow.model.Comment;
import com.taskflow.model.Task;
import com.taskflow.model.TaskPriority;
import com.taskflow.model.User;
import com.taskflow.repository.CommentRepository;
import com.taskflow.repository.TaskRepository;
import com.taskflow.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class CommentControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private CommentRepository commentRepository;

    private User testUser;
    private Task testTask;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
        taskRepository.deleteAll();
        commentRepository.deleteAll();

        testUser = new User();
        testUser.setEmail("testuser@example.com");
        testUser.setPassword("password");
        testUser.setRole(com.taskflow.model.UserRole.COLLABORATOR);
        userRepository.save(testUser);

        testTask = new Task();
        testTask.setTitle("Test Task");
        testTask.setAuthor(testUser);
        testTask.setCreatedAt(OffsetDateTime.now());
        testTask.setPriority(TaskPriority.MEDIUM);
        taskRepository.save(testTask);

        // Manually set up security context
        CustomUserDetails customUserDetails = new CustomUserDetails(testUser);
        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                customUserDetails, null, customUserDetails.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    @Test
    void createComment_shouldCreateAndReturnComment() throws Exception {
        CreateCommentRequest request = new CreateCommentRequest("This is a test comment");

        mockMvc.perform(post("/api/tasks/{taskId}/comments", testTask.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.content").value("This is a test comment"))
                .andExpect(jsonPath("$.author.email").value("testuser@example.com"));
    }

    @Test
    void getCommentsByTaskId_shouldReturnComments() throws Exception {
        Comment comment = new Comment();
        comment.setContent("Existing comment");
        comment.setAuthor(testUser);
        comment.setTask(testTask);
        comment.setCreatedAt(OffsetDateTime.now());
        commentRepository.save(comment);

        mockMvc.perform(get("/api/tasks/{taskId}/comments", testTask.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].content").value("Existing comment"));
    }
}