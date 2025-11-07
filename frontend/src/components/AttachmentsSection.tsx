// src/components/AttachmentsSection.tsx
import React, { useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  uploadAttachmentToTask,
  fetchAttachmentsForTask,
} from '../services/taskService';
import type { Attachment } from '../types';

interface AttachmentsSectionProps {
  taskId: string;
}

const AttachmentsSection: React.FC<AttachmentsSectionProps> = ({ taskId }) => {
  const qc = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // 1) Agora temos um useQuery com a MESMA queryKey que você invalida
  const {
    data: attachments = [],
    isFetching,
    refetch,
  } = useQuery<Attachment[]>({
    queryKey: ['attachments', taskId],
    queryFn: () => fetchAttachmentsForTask(taskId),
    enabled: !!taskId,
    staleTime: 60_000,
  });

  // 2) Upload (suporta múltiplos)
  const uploadMutation = useMutation({
    mutationFn: async (payload: { files: File[]; taskId: string }) => {
      const created: Attachment[] = [];
      for (const f of payload.files) {
        const a = await uploadAttachmentToTask(payload.taskId, f);
        created.push(a);
      }
      return created;
    },
    onSuccess: (newOnes) => {
      // atualiza cache sem esperar refetch
      qc.setQueryData<Attachment[]>(['attachments', taskId], (prev = []) => [
        ...prev,
        ...newOnes,
      ]);
    },
    onError: (err) => {
      console.error('Failed to upload attachment:', err);
      alert('Failed to upload attachment.');
    },
  });

  // helpers
  const startUpload = (filesList: FileList | null) => {
    if (!filesList || filesList.length === 0) return;
    const files = Array.from(filesList);
    uploadMutation.mutate({ files, taskId });
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    startUpload(e.dataTransfer.files);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    startUpload(e.target.files);
    // opcional: limpar para permitir re-upload do mesmo arquivo
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const openPicker = () => fileInputRef.current?.click();

  return (
    <div className="attachments-section">
      <h3>Attachments</h3>

      <div
        className="drop-zone"
        onClick={openPicker}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          position: 'relative',            // <— necessário para o input absolute
          border: `2px dashed ${isDragging ? '#0ea5e9' : '#ccc'}`,
          borderRadius: 8,
          padding: 16,
          textAlign: 'center',
          cursor: 'pointer',
          minHeight: 72,
        }}
      >
        {uploadMutation.isPending ? (
          <p>Uploading...</p>
        ) : (
          <p>Drag & drop files here, or click to upload</p>
        )}

        {/* input escondido mas clicável via onClick no container */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileInputChange}
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0,
            cursor: 'pointer',
          }}
          aria-label="Upload attachments"
        />
      </div>

      <div style={{ marginTop: 12 }}>
        {isFetching ? (
          <p>Loading attachments...</p>
        ) : attachments.length === 0 ? (
          <p>No attachments yet.</p>
        ) : (
          <ul className="attachment-list" style={{ listStyle: 'none', padding: 0 }}>
            {attachments.map((a) => (
              <li key={a.id} style={{ marginBottom: 6 }}>
                <a
                  href={a.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  download={a.fileName}
                >
                  {a.fileName}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* botão manual para refazer o fetch, se quiser */}
      {/* <button onClick={() => refetch()} disabled={isFetching}>Refresh</button> */}
    </div>
  );
};

export default AttachmentsSection;
