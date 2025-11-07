import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTask } from '../services/taskService';
import { getProjects } from '../services/projectService';
import type { Task } from './TaskCard';
import CommentsSection from './CommentsSection';
import AttachmentsSection from './AttachmentsSection';
import { fetchCommentsForTask } from '../services/taskService';
import type { Comment, ProjectSummary } from '../types';

interface TaskDetailsModalProps {
    task: Task;
    onClose: () => void;
    token: string;
}

const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({ task, onClose, token }) => {
    const queryClient = useQueryClient();
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description);
    const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>(task.project?.id);
    const [projects, setProjects] = useState<ProjectSummary[]>([]);
    const [comments, setComments] = useState<Comment[]>([]);

    useEffect(() => {
        const loadCommentsAndProjects = async () => {
            try {
                const fetchedComments = await fetchCommentsForTask(task.id, token);
                setComments(fetchedComments);

                const fetchedProjects = await getProjects(token);
                setProjects(fetchedProjects);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        };
        loadCommentsAndProjects();
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
        mutation.mutate({ title, description, projectId: selectedProjectId === undefined ? undefined : selectedProjectId === '' ? null : selectedProjectId });
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
                    <div>
                        <label htmlFor="project">Project</label>
                        <select
                            id="project"
                            value={selectedProjectId || ''}
                            onChange={(e) => setSelectedProjectId(e.target.value || undefined)}
                        >
                            <option value="">-- No Project --</option>
                            {projects.map((project) => (
                                <option key={project.id} value={project.id}>
                                    {project.name}
                                </option>
                            ))}
                        </select>
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
