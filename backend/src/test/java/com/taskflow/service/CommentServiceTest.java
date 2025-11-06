package com.taskflow.service;

import com.taskflow.dto.CommentDto;
import com.taskflow.dto.CreateCommentRequest;
import com.taskflow.exception.ResourceNotFoundException;
import com.taskflow.model.Comment;
import com.taskflow.model.Task;
import com.taskflow.model.User;
import com.taskflow.repository.CommentRepository;
import com.taskflow.repository.TaskRepository;
import com.taskflow.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.OffsetDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CommentServiceTest {

    @Mock
    private CommentRepository commentRepository;

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private CommentService commentService;

    private User testUser;
    private Task testTask;
    private Comment testComment;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(UUID.randomUUID());
        testUser.setEmail("testuser@example.com");

        testTask = new Task();
        testTask.setId(UUID.randomUUID());

        testComment = new Comment();
        testComment.setId(UUID.randomUUID());
        testComment.setContent("Test comment");
        testComment.setAuthor(testUser);
        testComment.setTask(testTask);
        testComment.setCreatedAt(OffsetDateTime.now());
    }

    @Test
    void createComment_shouldCreateAndReturnCommentDto() {
        CreateCommentRequest request = new CreateCommentRequest("Test comment");

        when(taskRepository.findById(testTask.getId())).thenReturn(Optional.of(testTask));
        when(userRepository.findById(testUser.getId())).thenReturn(Optional.of(testUser));
        when(commentRepository.save(any(Comment.class))).thenReturn(testComment);

        CommentDto result = commentService.createComment(testTask.getId(), request, testUser.getId());

        assertNotNull(result);
        assertEquals(testComment.getId(), result.id());
        assertEquals(testComment.getContent(), result.content());
        assertEquals(testUser.getEmail(), result.author().email());
        verify(commentRepository, times(1)).save(any(Comment.class));
    }

    @Test
    void createComment_shouldThrowResourceNotFoundException_whenTaskNotFound() {
        CreateCommentRequest request = new CreateCommentRequest("Test comment");
        UUID nonExistentTaskId = UUID.randomUUID();

        when(taskRepository.findById(nonExistentTaskId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            commentService.createComment(nonExistentTaskId, request, testUser.getId());
        });
    }

    @Test
    void getCommentsByTaskId_shouldReturnListOfCommentDtos() {
        when(taskRepository.existsById(testTask.getId())).thenReturn(true);
        when(commentRepository.findByTaskId(testTask.getId())).thenReturn(Collections.singletonList(testComment));

        List<CommentDto> result = commentService.getCommentsByTaskId(testTask.getId());

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testComment.getId(), result.get(0).id());
        verify(commentRepository, times(1)).findByTaskId(testTask.getId());
    }

    @Test
    void getCommentsByTaskId_shouldThrowResourceNotFoundException_whenTaskNotFound() {
        UUID nonExistentTaskId = UUID.randomUUID();
        when(taskRepository.existsById(nonExistentTaskId)).thenReturn(false);

        assertThrows(ResourceNotFoundException.class, () -> {
            commentService.getCommentsByTaskId(nonExistentTaskId);
        });
    }
}
