import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadAttachmentToTask, fetchAttachmentsForTask } from '../services/taskService';
import type { Attachment } from '../types';

interface AttachmentsSectionProps {
    taskId: string;
}

const AttachmentsSection: React.FC<AttachmentsSectionProps> = ({ taskId }) => {
    const queryClient = useQueryClient();
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const [isDragging, setIsDragging] = useState(false);

    // TODO: Fetch attachments on component mount
    useEffect(() => {
        const loadAttachments = async () => {
            try {
                const fetchedAttachments = await fetchAttachmentsForTask(taskId);
                setAttachments(fetchedAttachments);
            } catch (error) {
                console.error('Failed to fetch attachments:', error);
            }
        };
        loadAttachments();
    }, [taskId]);

    const uploadMutation = useMutation({
        mutationFn: ({ file, taskId }: { file: File; taskId: string }) =>
            uploadAttachmentToTask(taskId, file),
        onSuccess: (newAttachment) => {
            setAttachments((prevAttachments) => [...prevAttachments, newAttachment]);
            queryClient.invalidateQueries({ queryKey: ['attachments', taskId] });
        },
        onError: (error) => {
            console.error('Failed to upload attachment:', error);
            alert('Failed to upload attachment.');
        },
    });

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            uploadMutation.mutate({ file, taskId });
        }
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            uploadMutation.mutate({ file, taskId });
        }
    };

    return (
        <div className="attachments-section">
            <h3>Attachments</h3>
            <div
                className="drop-zone"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                style={{ border: isDragging ? '2px dashed #007bff' : '2px dashed #ccc' }}
            >
                {uploadMutation.isPending ? (
                    <p>Uploading...</p>
                ) : (
                    <p>Drag & drop files here, or click to upload</p>
                )}
                <input type="file" onChange={handleFileInputChange} style={{ opacity: 0, position: 'absolute', width: '100%', height: '100%', cursor: 'pointer' }} data-testid="file-input" />
            </div>
            <ul className="attachment-list">
                {attachments.length === 0 ? (
                    <p>No attachments yet.</p>
                ) : (
                    attachments.map((attachment) => (
                        <li key={attachment.id}>
                            <a href={attachment.url} target="_blank" rel="noopener noreferrer">
                                {attachment.fileName}
                            </a>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default AttachmentsSection;
