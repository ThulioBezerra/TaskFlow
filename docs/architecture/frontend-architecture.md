# Frontend Architecture

## Component Architecture

### Component Organization
The frontend will follow a feature-based directory structure.

```text
frontend/
└── src/
    ├── assets/
    ├── components/
    │   ├── common/       # Reusable components (Button, Input, Modal)
    │   └── layout/       # Layout components (Navbar, Sidebar)
    ├── features/
    │   ├── auth/         # Login, Register components and hooks
    │   ├── projects/     # Project list, creation, settings
    │   └── tasks/        # Kanban board, columns, cards, task details
    ├── hooks/            # Global custom hooks
    ├── services/         # API client services
    ├── stores/           # Zustand state stores
    ├── styles/
    └── App.tsx
```

### Component Template
A typical component will be a function component with TypeScript props.
```typescript
import React from 'react';

interface MyComponentProps {
  title: string;
}

const MyComponent: React.FC<MyComponentProps> = ({ title }) => {
  return (
    <div>
      <h1>{title}</h1>
    </div>
  );
};

export default MyComponent;
```

## State Management Architecture

### State Structure
A Zustand store will be created for global state like the authenticated user. Feature-specific state will be managed locally or in feature-specific stores.
```typescript
import { create } from 'zustand';
import { User } from '../types'; // Assuming shared types

interface AuthState {
  user: User | null;
  token: string | null;
  setUser: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  setUser: (user, token) => set({ user, token }),
  logout: () => set({ user: null, token: null }),
}));
```

### State Management Patterns
- **Global State:** Use Zustand for user authentication state.
- **Local State:** Use React's `useState` and `useReducer` for component-level state.
- **Server Cache State:** Use a library like `TanStack Query (React Query)` to manage server state, caching, and real-time updates.

## Routing Architecture

### Route Organization
Routing will be managed using `react-router-dom`.
```text
/login
/register
/dashboard (protected)
/project/{projectId} (protected)
/task/{taskId} (protected)
/profile (protected)
```

### Protected Route Pattern
A wrapper component will protect routes that require authentication.
```typescript
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

const ProtectedRoute = () => {
  const { token } = useAuthStore();
  return token ? <Outlet /> : <Navigate to="/login" />;
};

// Usage in App.tsx
<Route element={<ProtectedRoute />}>
  <Route path="/dashboard" element={<Dashboard />} />
</Route>
```

## Frontend Services Layer

### API Client Setup
An Axios instance will be configured to handle API requests, including adding the JWT to headers.
```typescript
import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api',
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
```

### Service Example
Services will encapsulate API calls for different features.
```typescript
import apiClient from './apiClient';
import { Task } from '../types';

export const taskService = {
  getTasksForProject: (projectId: string): Promise<Task[]> => {
    return apiClient.get(`/projects/${projectId}/tasks`).then(res => res.data);
  },
  updateTask: (taskId: string, data: Partial<Task>): Promise<Task> => {
    return apiClient.put(`/tasks/${taskId}`, data).then(res => res.data);
  },
};
```
