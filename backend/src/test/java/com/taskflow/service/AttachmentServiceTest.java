package com.taskflow.service;

import com.taskflow.model.Attachment;
import com.taskflow.model.Task;
import com.taskflow.repository.AttachmentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AttachmentServiceTest {

    @Mock
    private AttachmentRepository attachmentRepository;

    @Mock
    private TaskService taskService;

    private AttachmentService attachmentService;

    private final String uploadDir = "test_uploads";

    @BeforeEach
    void setUp() throws IOException {
        // Manually instantiate AttachmentService, passing mocks and hardcoded uploadDir
        attachmentService = new AttachmentService(attachmentRepository, taskService, uploadDir);

        // Ensure the test upload directory exists and is empty before each test
        Path path = Paths.get(uploadDir);
        if (Files.exists(path)) {
            Files.walk(path)
                    .map(Path::toFile)
                    .forEach(java.io.File::delete);
        }
        Files.createDirectories(path);
    }

    @Test
    void saveAttachment_shouldSaveFileAndMetadata() throws IOException {
        UUID taskId = UUID.randomUUID();
        Task task = new Task();
        task.setId(taskId);

        MockMultipartFile mockFile = new MockMultipartFile(
                "file",
                "test.txt",
                "text/plain",
                "Hello World".getBytes()
        );

        when(taskService.getTaskById(taskId)).thenReturn(task);
        when(attachmentRepository.save(any(Attachment.class))).thenAnswer(invocation -> {
            Attachment attachment = invocation.getArgument(0);
            attachment.setId(UUID.randomUUID()); // Simulate ID generation by JPA
            return attachment;
        });

        Attachment savedAttachment = attachmentService.saveAttachment(taskId, mockFile);

        assertNotNull(savedAttachment);
        assertNotNull(savedAttachment.getId());
        assertEquals("test.txt", savedAttachment.getFileName());
        assertEquals("text/plain", savedAttachment.getFileType());
        assertEquals(taskId, savedAttachment.getTask().getId());
        assertTrue(Files.exists(Paths.get(uploadDir).resolve("test.txt")));

        verify(taskService, times(1)).getTaskById(taskId);
        verify(attachmentRepository, times(1)).save(any(Attachment.class));
    }

    @Test
    void getAttachmentsForTask_shouldReturnListOfAttachments() {
        UUID taskId = UUID.randomUUID();
        Task task = new Task();
        task.setId(taskId);
        Attachment attachment1 = Attachment.builder().id(UUID.randomUUID()).fileName("file1.txt").task(task).build();
        Attachment attachment2 = Attachment.builder().id(UUID.randomUUID()).fileName("file2.txt").task(task).build();

        when(attachmentRepository.findByTaskId(taskId)).thenReturn(Arrays.asList(attachment1, attachment2));

        List<Attachment> attachments = attachmentService.getAttachmentsForTask(taskId);

        assertNotNull(attachments);
        assertEquals(2, attachments.size());
        assertEquals("file1.txt", attachments.get(0).getFileName());
        assertEquals("file2.txt", attachments.get(1).getFileName());

        verify(attachmentRepository, times(1)).findByTaskId(taskId);
    }

    @Test
    void saveAttachment_shouldThrowExceptionIfTaskNotFound() {
        UUID taskId = UUID.randomUUID();
        MockMultipartFile mockFile = new MockMultipartFile(
                "file",
                "test.txt",
                "text/plain",
                "Hello World".getBytes()
        );

        when(taskService.getTaskById(taskId)).thenReturn(null);

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            attachmentService.saveAttachment(taskId, mockFile);
        });

        assertEquals("Task not found with ID: " + taskId, exception.getMessage());
        verify(taskService, times(1)).getTaskById(taskId);
        verify(attachmentRepository, never()).save(any(Attachment.class));
    }
}
