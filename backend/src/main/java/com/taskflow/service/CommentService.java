package com.taskflow.service;

import com.taskflow.dto.CommentDto;
import com.taskflow.dto.CreateCommentRequest;
import com.taskflow.dto.UserSummaryDto;
import com.taskflow.exception.ResourceNotFoundException;
import com.taskflow.model.Comment;
import com.taskflow.model.Task;
import com.taskflow.model.User;
import com.taskflow.repository.CommentRepository;
import com.taskflow.repository.TaskRepository;
import com.taskflow.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public CommentDto createComment(UUID taskId, CreateCommentRequest request, UUID authorId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
        User author = userRepository.findById(authorId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Comment comment = new Comment();
        comment.setContent(request.content());
        comment.setTask(task);
        comment.setAuthor(author);
        comment.setCreatedAt(OffsetDateTime.now());

        Comment savedComment = commentRepository.save(comment);

        return toDto(savedComment);
    }

    @Transactional(readOnly = true)
    public List<CommentDto> getCommentsByTaskId(UUID taskId) {
        if (!taskRepository.existsById(taskId)) {
            throw new ResourceNotFoundException("Task not found");
        }
        List<Comment> comments = commentRepository.findByTaskId(taskId);
        return comments.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    private CommentDto toDto(Comment comment) {
        UserSummaryDto authorSummary = new UserSummaryDto(comment.getAuthor().getId(), comment.getAuthor().getEmail());
        return new CommentDto(
                comment.getId(),
                comment.getContent(),
                authorSummary,
                comment.getCreatedAt(),
                comment.getTask().getId()
        );
    }
}
