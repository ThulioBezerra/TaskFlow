import type { Task } from "../components/TaskCard";
import type { Comment } from "../types";

const API_URL = '/api/tasks';

export const getTasks = async (token: string) => {
    const response = await fetch(API_URL, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) {
        throw new Error('Failed to fetch tasks');
    }
    return response.json();
};

export const createTask = async (task: { title: string; description: string }, token: string) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(task)
    });

    if (!response.ok) {
        throw new Error('Failed to create task');
    }

    return response.json();
};

export const updateTask = async (id: string, task: Partial<Task>, token: string) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(task)
    });

    if (!response.ok) {
        throw new Error('Failed to update task');
    }

    return response.json();
};

export const updateTaskStatus = async (id: string, status: string, token: string) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
    });

    if (!response.ok) {
        throw new Error('Failed to update task status');
    }

    return response.json();
};

export const fetchCommentsForTask = async (taskId: string, token: string): Promise<Comment[]> => {
    const response = await fetch(`${API_URL}/${taskId}/comments`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) {
        throw new Error('Failed to fetch comments');
    }
    return response.json();
};

export const addCommentToTask = async (taskId: string, content: string, token: string): Promise<Comment> => {
    const response = await fetch(`${API_URL}/${taskId}/comments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content })
    });

    if (!response.ok) {
        throw new Error('Failed to add comment');
    }

    return response.json();
};
