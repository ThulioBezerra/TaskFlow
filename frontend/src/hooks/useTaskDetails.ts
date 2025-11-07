import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  updateTask,
  deleteTask,
  fetchCommentsForTask,
  type UpdateTaskRequest,
} from '../services/taskService';
import { getProjects } from '../services/projectService';
import { getUsers } from '../services/userService';
import type { Task } from '../components/TaskCard';
import { TaskStatus } from '../components/TaskCard';
import type { AllUsers, Comment, ProjectSummary } from '../types';

type UseTaskDetailsArgs = {
  task: Task;
  onClose: () => void;
};

export function useTaskDetails({ task, onClose }: UseTaskDetailsArgs) {
  const queryClient = useQueryClient();

  // ---- Form state
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [priority, setPriority] = useState(task.priority ?? 0);
  const [dueDate, setDueDate] = useState(
    task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
  );
  const [status, setStatus] = useState<TaskStatus>(task.status);

  // IMPORTANTE: seu select usa email como value
  const [selectedAssigneeId, setSelectedAssigneeId] = useState<string | undefined>(
    task.assignee?.email
  );
  const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>(
    task.project?.id
  );

  // ---- Queries
  const { data: allUsers = [], isLoading: loadingUsers } = useQuery<AllUsers[]>({
    queryKey: ['users'],
    queryFn: getUsers,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const { data: projects = [], isLoading: loadingProjects } = useQuery<ProjectSummary[]>({
    queryKey: ['projects'],
    queryFn: getProjects,
    staleTime: 5 * 60 * 1000,
  });

  const { data: comments = [], isLoading: loadingComments } = useQuery<Comment[]>({
    queryKey: ['task-comments', task.id],
    queryFn: () => fetchCommentsForTask(task.id),
    enabled: Boolean(task.id),
    staleTime: 60 * 1000,
  });

  // ---- Mutations
  const updateMutation = useMutation({
    mutationFn: (payload: UpdateTaskRequest) => updateTask(task.id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      onClose();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteTask(task.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      onClose();
    },
  });

  // ---- Handlers
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Semântica:
    // undefined → não altera
    // ''       → null (desassocia)
    // string   → id/email (conforme seu backend)
    const assigneeId =
      selectedAssigneeId === undefined
        ? undefined
        : selectedAssigneeId === ''
        ? null
        : selectedAssigneeId;

    const projectId =
      selectedProjectId === undefined
        ? undefined
        : selectedProjectId === ''
        ? null
        : selectedProjectId;

    const payload: UpdateTaskRequest = {
      title,
      description,
      priority,
      dueDate: dueDate || null,
      status,
      assigneeId,
      projectId,
    };

    updateMutation.mutate(payload);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteMutation.mutate();
    }
  };

  const loadingAny = loadingUsers || loadingProjects || loadingComments;

  return {
    // estado
    title,
    setTitle,
    description,
    setDescription,
    priority,
    setPriority,
    dueDate,
    setDueDate,
    status,
    setStatus,
    selectedAssigneeId,
    setSelectedAssigneeId,
    selectedProjectId,
    setSelectedProjectId,

    // dados
    allUsers,
    projects,
    comments,

    // carregamento/mutações
    loadingAny,
    updateIsPending: updateMutation.isPending,
    deleteIsPending: deleteMutation.isPending,

    // actions
    handleSubmit,
    handleDelete,
  };
}
