package com.taskflow.controller;

import com.taskflow.dto.AttachmentDTO;
import com.taskflow.model.Attachment;
import com.taskflow.service.AttachmentService;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tasks")
public class AttachmentController {

    private final AttachmentService attachmentService;

    public AttachmentController(AttachmentService attachmentService) {
        this.attachmentService = attachmentService;
    }

    @PostMapping("/{taskId}/attachments")
    public ResponseEntity<AttachmentDTO> uploadAttachment(
            @PathVariable UUID taskId,
            @RequestParam("file") MultipartFile file) throws IOException {
        Attachment attachment = attachmentService.saveAttachment(taskId, file);
        return ResponseEntity.ok(convertToDto(attachment));
    }

    @GetMapping("/{taskId}/attachments")
    public ResponseEntity<List<AttachmentDTO>> getAttachmentsForTask(@PathVariable UUID taskId) {
        List<Attachment> attachments = attachmentService.getAttachmentsForTask(taskId);
        List<AttachmentDTO> attachmentDTOs = attachments.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(attachmentDTOs);
    }

    @GetMapping("/{taskId}/attachments/{fileName:.+}")
    public ResponseEntity<Resource> downloadAttachment(
            @PathVariable UUID taskId,
            @PathVariable String fileName) throws MalformedURLException {
        Path filePath = attachmentService.loadFileAsResource(fileName);
        Resource resource = new UrlResource(filePath.toUri());

        if (resource.exists()) {
            String contentType = "application/octet-stream"; // Default content type
            try {
                contentType = Files.probeContentType(filePath);
            } catch (IOException e) {
                // Fallback to default
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    private AttachmentDTO convertToDto(Attachment attachment) {
        return AttachmentDTO.builder()
                .id(attachment.getId())
                .fileName(attachment.getFileName())
                .fileType(attachment.getFileType())
                .url(attachment.getUrl())
                .taskId(attachment.getTask().getId())
                .uploadedAt(attachment.getUploadedAt())
                .build();
    }
}
