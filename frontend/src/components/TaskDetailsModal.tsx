import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTask } from '../services/taskService';
import type { Task } from './TaskCard';
import CommentsSection from './CommentsSection';
import AttachmentsSection from './AttachmentsSection';
import { fetchCommentsForTask } from '../services/taskService';

interface Comment {
    id: string;
    author: {
        id: string;
        username: string;
    };
    content: string;
    timestamp: string; // ISO 8601 string
}

interface TaskDetailsModalProps {
    task: Task;
    onClose: () => void;
    token: string;
}

const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({ task, onClose, token }) => {
    const queryClient = useQueryClient();
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description);
    const [comments, setComments] = useState<Comment[]>([]);

    useEffect(() => {
        const loadComments = async () => {
            try {
                const fetchedComments = await fetchCommentsForTask(task.id, token);
                setComments(fetchedComments);
            } catch (error) {
                console.error('Failed to fetch comments:', error);
            }
        };
        loadComments();
    }, [task.id, token]);

    const mutation = useMutation({
        mutationFn: (updatedTask: Partial<Task>) => updateTask(task.id, updatedTask, token),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            onClose();
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate({ title, description });
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Edit Task</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="title">Title</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    {/* Add other form fields here */}
                    <button type="submit">Save</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </form>
                <CommentsSection
                    taskId={task.id}
                    comments={comments}
                    token={token}
                    onCommentAdded={(newComment) => setComments((prevComments) => [...prevComments, newComment])}
                />
                <AttachmentsSection taskId={task.id} token={token} />
            </div>
        </div>
    );
};

export default TaskDetailsModal;
