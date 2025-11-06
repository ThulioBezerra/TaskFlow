/// <reference types="vitest/globals" />
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import AttachmentsSection from '../AttachmentsSection';
import * as taskService from '../../services/taskService';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock the taskService
vi.mock('../../services/taskService', () => ({
    uploadAttachmentToTask: vi.fn(),
    fetchAttachmentsForTask: vi.fn(),
}));

// Create a QueryClient for tests
const queryClient = new QueryClient();

// Helper to render with QueryClientProvider
const renderWithClient = (ui: React.ReactElement) => {
    return render(
        <QueryClientProvider client={queryClient}>
            {ui}
        </QueryClientProvider>
    );
};

// Clean up the DOM after each test
afterEach(() => {
    cleanup();
    queryClient.clear(); // Clear query cache after each test
});

beforeEach(() => {
    vi.clearAllMocks();
    (taskService.fetchAttachmentsForTask as vi.Mock).mockResolvedValue([]); // Default to no attachments
});

const mockAttachments = [
    {
        id: 'att1',
        fileName: 'document.pdf',
        fileType: 'application/pdf',
        url: '/api/tasks/task123/attachments/document.pdf',
        taskId: 'task123',
        uploadedAt: new Date().toISOString(),
    },
    {
        id: 'att2',
        fileName: 'image.png',
        fileType: 'image/png',
        url: '/api/tasks/task123/attachments/image.png',
        taskId: 'task123',
        uploadedAt: new Date().toISOString(),
    },
];

describe('AttachmentsSection', () => {
    it('renders "No attachments yet." when there are no attachments', async () => {
        renderWithClient(
            <AttachmentsSection
                taskId="task123"
                token="test-token"
            />
        );

        await waitFor(() => expect(taskService.fetchAttachmentsForTask).toHaveBeenCalledWith('task123', 'test-token'));
        expect(screen.getByText('No attachments yet.')).toBeInTheDocument();
    });

    it('renders existing attachments correctly', async () => {
        (taskService.fetchAttachmentsForTask as vi.Mock).mockResolvedValue(mockAttachments);

        renderWithClient(
            <AttachmentsSection
                taskId="task123"
                token="test-token"
            />
        );

        await waitFor(() => expect(taskService.fetchAttachmentsForTask).toHaveBeenCalledWith('task123', 'test-token'));
        expect(screen.getByText('document.pdf')).toBeInTheDocument();
        expect(screen.getByText('image.png')).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'document.pdf' })).toHaveAttribute('href', '/api/tasks/task123/attachments/document.pdf');
    });

    it('handles file drop and uploads attachment', async () => {
        const mockFile = new File(['content'], 'new-file.txt', { type: 'text/plain' });
        const mockUploadedAttachment = {
            id: 'att3',
            fileName: 'new-file.txt',
            fileType: 'text/plain',
            url: '/api/tasks/task123/attachments/new-file.txt',
            taskId: 'task123',
            uploadedAt: new Date().toISOString(),
        };

        (taskService.uploadAttachmentToTask as vi.Mock).mockResolvedValue(mockUploadedAttachment);
        (taskService.fetchAttachmentsForTask as vi.Mock).mockResolvedValueOnce([]).mockResolvedValueOnce([...mockAttachments, mockUploadedAttachment]);

        renderWithClient(
            <AttachmentsSection
                taskId="task123"
                token="test-token"
            />
        );

        const dropZone = screen.getByText(/Drag & drop files here/i);
        fireEvent.drop(dropZone, { dataTransfer: { files: [mockFile] } });

        await waitFor(() => expect(taskService.uploadAttachmentToTask).toHaveBeenCalledWith(
            'task123',
            mockFile,
            'test-token'
        ));

        await waitFor(() => expect(screen.getByText('new-file.txt')).toBeInTheDocument());
    });

    it('handles file input change and uploads attachment', async () => {
        const mockFile = new File(['content'], 'input-file.txt', { type: 'text/plain' });
        const mockUploadedAttachment = {
            id: 'att4',
            fileName: 'input-file.txt',
            fileType: 'text/plain',
            url: '/api/tasks/task123/attachments/input-file.txt',
            taskId: 'task123',
            uploadedAt: new Date().toISOString(),
        };

        (taskService.uploadAttachmentToTask as vi.Mock).mockResolvedValue(mockUploadedAttachment);
        (taskService.fetchAttachmentsForTask as vi.Mock).mockResolvedValueOnce([]).mockResolvedValueOnce([...mockAttachments, mockUploadedAttachment]);

        renderWithClient(
            <AttachmentsSection
                taskId="task123"
                token="test-token"
            />
        );

        const fileInput = screen.getByTestId('file-input');
        fireEvent.change(fileInput, { target: { files: [mockFile] } });

        await waitFor(() => expect(taskService.uploadAttachmentToTask).toHaveBeenCalledWith(
            'task123',
            mockFile,
            'test-token'
        ));

        await waitFor(() => expect(screen.getByText('input-file.txt')).toBeInTheDocument());
    });

    it('displays uploading state', async () => {
        (taskService.uploadAttachmentToTask as vi.Mock).mockReturnValue(new Promise(() => {})); // Never resolve to keep it pending

        renderWithClient(
            <AttachmentsSection
                taskId="task123"
                token="test-token"
            />
        );

        const mockFile = new File(['content'], 'pending.txt', { type: 'text/plain' });
        const dropZone = screen.getByText(/Drag & drop files here/i);
        fireEvent.drop(dropZone, { dataTransfer: { files: [mockFile] } });

        await waitFor(() => expect(screen.getByText('Uploading...')).toBeInTheDocument());
    });
});
