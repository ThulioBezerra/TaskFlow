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

export const updateTask = async (id: number, task: Partial<Task>, token: string) => {
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

export const updateTaskStatus = async (id: number, status: string, token: string) => {
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
