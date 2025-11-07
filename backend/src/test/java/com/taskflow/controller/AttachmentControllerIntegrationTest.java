package com.taskflow.controller;

import org.junit.jupiter.api.AfterAll;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.taskflow.dto.AttachmentDTO;
import com.taskflow.model.Attachment;
import com.taskflow.model.Task;
import com.taskflow.service.AttachmentService;
import com.taskflow.service.TaskService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.OffsetDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
@AutoConfigureMockMvc
public class AttachmentControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AttachmentService attachmentService;

    @MockBean
    private TaskService taskService; // Mock TaskService as it's a dependency of AttachmentService

    @Autowired
    private WebApplicationContext webApplicationContext;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
    }

    @Test
    void uploadAttachment_shouldReturnCreatedAttachment() throws Exception {
        UUID taskId = UUID.randomUUID();
        MockMultipartFile mockFile = new MockMultipartFile(
                "file",
                "test.txt",
                "text/plain",
                "Hello World".getBytes()
        );

        Task mockTask = new Task();
        mockTask.setId(taskId);

        Attachment mockAttachment = Attachment.builder()
                .id(UUID.randomUUID())
                .fileName("test.txt")
                .fileType("text/plain")
                .url("/api/tasks/" + taskId + "/attachments/test.txt")
                .task(mockTask)
                .uploadedAt(OffsetDateTime.now())
                .build();

        when(attachmentService.saveAttachment(eq(taskId), any(MockMultipartFile.class))).thenReturn(mockAttachment);

        mockMvc.perform(multipart("/api/tasks/{taskId}/attachments", taskId)
                        .file(mockFile))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fileName").value("test.txt"))
                .andExpect(jsonPath("$.fileType").value("text/plain"));
    }

    @Test
    void getAttachmentsForTask_shouldReturnListOfAttachments() throws Exception {
        UUID taskId = UUID.randomUUID();
        Task mockTask = new Task();
        mockTask.setId(taskId);

        Attachment attachment1 = Attachment.builder()
                .id(UUID.randomUUID())
                .fileName("file1.txt")
                .fileType("text/plain")
                .url("/api/tasks/" + taskId + "/attachments/file1.txt")
                .task(mockTask)
                .uploadedAt(OffsetDateTime.now())
                .build();
        Attachment attachment2 = Attachment.builder()
                .id(UUID.randomUUID())
                .fileName("file2.pdf")
                .fileType("application/pdf")
                .url("/api/tasks/" + taskId + "/attachments/file2.pdf")
                .task(mockTask)
                .uploadedAt(OffsetDateTime.now())
                .build();

        List<Attachment> mockAttachments = Arrays.asList(attachment1, attachment2);

        when(attachmentService.getAttachmentsForTask(taskId)).thenReturn(mockAttachments);

        mockMvc.perform(get("/api/tasks/{taskId}/attachments", taskId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].fileName").value("file1.txt"))
                .andExpect(jsonPath("$[1].fileName").value("file2.pdf"));
    }

    @Test
    void downloadAttachment_shouldReturnFile() throws Exception {
        UUID taskId = UUID.randomUUID();
        String fileName = "download.txt";
        Path filePath = Paths.get("test_uploads").resolve(fileName);
        Files.createDirectories(filePath.getParent());
        Files.write(filePath, "Downloadable content".getBytes());

        Resource mockResource = new UrlResource(filePath.toUri());

        when(attachmentService.loadFileAsResource(fileName)).thenReturn(filePath);

        mockMvc.perform(get("/api/tasks/{taskId}/attachments/{fileName}", taskId, fileName))
                .andExpect(status().isOk())
                .andExpect(header().string(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\""))
                .andExpect(content().string("Downloadable content"));

        Files.deleteIfExists(filePath);
    }

    @AfterAll
    static void cleanUp() throws IOException {
        Path path = Paths.get("test_uploads");
        if (Files.exists(path)) {
            Files.walk(path)
                    .map(Path::toFile)
                    .forEach(java.io.File::delete);
            Files.delete(path);
        }
    }
}
