import type { Task, TaskStatus } from "../components/TaskCard";
import type { Comment, Attachment } from "../types";

const API_URL = '/api/tasks';

export type UpdateTaskRequest = {
  title?: string;
  description?: string;
  priority?: number | null;
  dueDate?: string | null;
  status?: TaskStatus;
  assigneeId?: string | null; // id do responsável (null = desassociar)
  projectId?: string | null;  // id do projeto (null = desassociar)
};

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

export const createTask = async (task: { title: string; description: string; projectId?: string }, token: string) => {
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

export const updateTask = (id: string, data: UpdateTaskRequest, token: string) => {
  const body: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(data)) if (v !== undefined) body[k] = v;

  return fetch(`/api/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  }).then(r => {
    if (!r.ok) throw new Error('Failed to update task');
    return r.json();
  });
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

export const deleteTask = async (id: string, token: string): Promise<void> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete task');
  }
};

export const deleteCommentFromTask = async (taskId: string, commentId: string, token: string): Promise<void> => {
  const res = await fetch(`${API_URL}/${taskId}/comments/${commentId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to delete comment');
};

export const deleteAttachmentFromTask = async (taskId: string, attachmentId: string, token: string): Promise<void> => {
  const res = await fetch(`${API_URL}/${taskId}/attachments/${attachmentId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to delete attachment');
};



export const uploadAttachmentToTask = async (taskId: string, file: File, token: string): Promise<Attachment> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_URL}/${taskId}/attachments`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        body: formData,
    });

    if (!response.ok) {
        throw new Error('Failed to upload attachment');
    }

    return response.json();
};

export const fetchAttachmentsForTask = async (taskId: string, token: string): Promise<Attachment[]> => {
    const response = await fetch(`${API_URL}/${taskId}/attachments`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch attachments');
    }

    return response.json();
};
