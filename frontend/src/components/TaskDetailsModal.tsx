import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTask, deleteTask, fetchCommentsForTask, UpdateTaskRequest } from '../services/taskService';
import { getProjects } from '../services/projectService';
import { getUsers } from '../services/userService';
import type { Task, Assignee } from './TaskCard';
import { TaskStatus } from './TaskCard';
import CommentsSection from './CommentsSection';
import AttachmentsSection from './AttachmentsSection';
import type { Comment, ProjectSummary, UserSummary } from '../types';

interface TaskDetailsModalProps {
    task: Task;
    onClose: () => void;
    token: string;
}

const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({ task, onClose, token }) => {
    const queryClient = useQueryClient();
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description);
    const [priority, setPriority] = useState(task.priority || 0);
    const [dueDate, setDueDate] = useState(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
    const [status, setStatus] = useState<TaskStatus>(task.status);
    const [selectedAssigneeId, setSelectedAssigneeId] =
        useState<string | undefined>(task.assignee?.id);
    const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>(task.project?.id);
    const [projects, setProjects] = useState<ProjectSummary[]>([]);
    const [users, setUsers] = useState<UserSummary[]>([]);
    const [comments, setComments] = useState<Comment[]>([]);

    useEffect(() => {
        const loadCommentsProjectsAndUsers = async () => {
            try {
                const fetchedComments = await fetchCommentsForTask(task.id, token);
                setComments(fetchedComments);

                const fetchedProjects = await getProjects(token);
                setProjects(fetchedProjects);

                const fetchedUsers = await getUsers(token);
                setUsers(fetchedUsers);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        };
        loadCommentsProjectsAndUsers();
    }, [task.id, token]);

    const updateMutation = useMutation({
        mutationFn: (payload: UpdateTaskRequest) => updateTask(task.id, payload, token),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            onClose();
        },
    });

    const deleteMutation = useMutation({
        mutationFn: () => deleteTask(task.id, token),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            onClose();
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateMutation.mutate({
            title,
            description,
            priority,
            dueDate: dueDate || null,
            status,
            // undefined = não altera; '' => null (desassocia)
            assigneeId:
            selectedAssigneeId === undefined
                ? undefined
                : selectedAssigneeId === ''
                ? null
                : selectedAssigneeId,
            projectId:
            selectedProjectId === undefined
                ? undefined
                : selectedProjectId === ''
                ? null
                : selectedProjectId,
        });
    };


    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            deleteMutation.mutate();
        }
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
                    <div>
                        <label htmlFor="status">Status</label>
                        <select
                            id="status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value as TaskStatus)}
                        >
                            {Object.values(TaskStatus).map((s) => (
                                <option key={s} value={s}>
                                    {s.replace(/_/g, ' ')}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="priority">Priority</label>
                        <input
                            type="number"
                            id="priority"
                            value={priority}
                            onChange={(e) => setPriority(parseInt(e.target.value))}
                        />
                    </div>
                    <div>
                        <label htmlFor="dueDate">Due Date</label>
                        <input
                            type="date"
                            id="dueDate"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="assignee">Assignee</label>
                        <select
                        id="assignee"
                        value={selectedAssigneeId ?? ''}                 // string | ''
                        onChange={(e) => setSelectedAssigneeId(e.target.value || undefined)}
                        >
                        <option value="">-- No Assignee --</option>
                        {users.map((user) => (
                            <option key={user.id} value={user.id}>
                            {user.email}
                            </option>
                        ))}
                        </select>

                    </div>
                    <button type="submit">Save</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                    <button type="button" onClick={handleDelete} style={{ backgroundColor: 'red', color: 'white' }}>Delete</button>
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
