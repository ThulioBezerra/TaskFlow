/// <reference types="vitest/globals" />
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import CommentsSection from '../CommentsSection';
import * as taskService from '../../services/taskService';

// Mock the taskService
vi.mock('../../services/taskService', () => ({
    addCommentToTask: vi.fn(),
}));

// Clean up the DOM after each test
afterEach(cleanup);

beforeEach(() => {
    vi.clearAllMocks();
});

const mockComments = [
    {
        id: '1',
        author: { id: 'user1', username: 'Alice' },
        content: 'First comment',
        timestamp: new Date().toISOString(),
    },
    {
        id: '2',
        author: { id: 'user2', username: 'Bob' },
        content: 'Second comment',
        timestamp: new Date().toISOString(),
    },
];

describe('CommentsSection', () => {
    it('renders comments correctly', () => {
        render(
            <CommentsSection
                taskId="task123"
                comments={mockComments}
                token="test-token"
                onCommentAdded={vi.fn()}
            />
        );

        expect(screen.getByText('Comments')).toBeInTheDocument();
        expect(screen.getByText('Alice')).toBeInTheDocument();
        expect(screen.getByText('First comment')).toBeInTheDocument();
        expect(screen.getByText('Bob')).toBeInTheDocument();
        expect(screen.getByText('Second comment')).toBeInTheDocument();
    });

    it('displays "No comments yet." when there are no comments', () => {
        render(
            <CommentsSection
                taskId="task123"
                comments={[]}
                token="test-token"
                onCommentAdded={vi.fn()}
            />
        );

        expect(screen.getByText('No comments yet.')).toBeInTheDocument();
    });

    it('allows a user to add a new comment', async () => {
        const onCommentAddedMock = vi.fn();
        const newCommentContent = 'New test comment';
        const mockAddedComment = {
            id: '3',
            author: { id: 'user3', username: 'CurrentUser' },
            content: newCommentContent,
            timestamp: new Date().toISOString(),
        };

        (taskService.addCommentToTask as vi.Mock).mockResolvedValue(mockAddedComment);

        render(
            <CommentsSection
                taskId="task123"
                comments={[]}
                token="test-token"
                onCommentAdded={onCommentAddedMock}
            />
        );

        const textarea = screen.getByPlaceholderText('Add a comment...');
        fireEvent.change(textarea, { target: { value: newCommentContent } });
        expect(textarea).toHaveValue(newCommentContent);

        const addButton = screen.getByRole('button', { name: /add comment/i });
        await fireEvent.click(addButton);

        expect(taskService.addCommentToTask).toHaveBeenCalledWith(
            'task123',
            newCommentContent,
            'test-token'
        );
        expect(onCommentAddedMock).toHaveBeenCalledWith(mockAddedComment);
        await waitFor(() => expect(textarea).toHaveValue('')); // Input should be cleared after submission
    });

    it('does not add an empty comment', async () => {
        const onCommentAddedMock = vi.fn();
        render(
            <CommentsSection
                taskId="task123"
                comments={[]}
                token="test-token"
                onCommentAdded={onCommentAddedMock}
            />
        );

        const addButton = screen.getByRole('button', { name: /add comment/i });
        fireEvent.click(addButton);

        expect(taskService.addCommentToTask).not.toHaveBeenCalled();
        expect(onCommentAddedMock).not.toHaveBeenCalled();
    });
});
