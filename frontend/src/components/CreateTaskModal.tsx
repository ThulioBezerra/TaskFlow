import React, { useState } from 'react';
import { createTask } from '../services/taskService';

interface CreateTaskModalProps {
    onClose: () => void;
    token: string;
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ onClose, token }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!title) {
            setError('Title is required');
            return;
        }

        try {
            await createTask({ title, description }, token);
            onClose();
        } catch (err) {
            console.error('Error creating task:', err);
            setError('Failed to create task. Please try again.');
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Create New Task</h2>
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
                    {error && <p className="error">{error}</p>}
                    <button type="submit">Create Task</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default CreateTaskModal;
