package com.taskflow.service;

import com.taskflow.model.Attachment;
import com.taskflow.model.Task;
import com.taskflow.repository.AttachmentRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
public class AttachmentService {

    private final String uploadDir;

    private final AttachmentRepository attachmentRepository;
    private final TaskService taskService;

    public AttachmentService(AttachmentRepository attachmentRepository, TaskService taskService, @Value("${app.upload.dir:uploads}") String uploadDir) {
        this.attachmentRepository = attachmentRepository;
        this.taskService = taskService;
        this.uploadDir = uploadDir;
        try {
            Files.createDirectories(Paths.get(uploadDir));
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory!", e);
        }
    }

    public Attachment saveAttachment(UUID taskId, MultipartFile file) throws IOException {
        Task task = taskService.getTaskById(taskId);
        if (task == null) {
            throw new RuntimeException("Task not found with ID: " + taskId);
        }

        String fileName = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
        Path targetLocation = Paths.get(uploadDir).resolve(fileName);
        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

        Attachment attachment = Attachment.builder()
                .fileName(fileName)
                .fileType(file.getContentType())
                .filePath(targetLocation.toString())
                .url("/api/tasks/" + taskId + "/attachments/" + fileName) // Placeholder URL
                .task(task)
                .build();

        return attachmentRepository.save(attachment);
    }

    public List<Attachment> getAttachmentsForTask(UUID taskId) {
        return attachmentRepository.findByTaskId(taskId);
    }

    public Path loadFileAsResource(String fileName) {
        return Paths.get(uploadDir).resolve(fileName).normalize();
    }
}
