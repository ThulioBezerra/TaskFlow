import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTask } from '../services/taskService';
import { Task } from './TaskCard';

interface TaskDetailsModalProps {
    task: Task;
    onClose: () => void;
    token: string;
}

const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({ task, onClose, token }) => {
    const queryClient = useQueryClient();
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description);
    // Add other fields here in a real app (priority, dueDate, assigneeId)

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
            </div>
        </div>
    );
};

export default TaskDetailsModal;
