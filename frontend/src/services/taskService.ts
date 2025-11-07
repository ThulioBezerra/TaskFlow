// src/services/taskService.ts
import { api } from './api'; // <- sua instância axios com interceptors
import type { Task, TaskStatus } from '../components/TaskCard';
import type { Comment, Attachment } from '../types';

export type UpdateTaskRequest = {
  title?: string;
  description?: string;
  priority?: number | null;
  dueDate?: string | null;
  status?: TaskStatus;
  assigneeId?: string | null; // null = desassociar; undefined = não alterar
  projectId?: string | null;  // null = desassociar; undefined = não alterar
};

const BASE = '/tasks';

/** Lista tarefas */
export const getTasks = async (): Promise<Task[]> => {
  const { data } = await api.get<Task[]>(BASE);
  return data;
};

/** Cria tarefa */
export const createTask = async (
  task: { title: string; description: string; projectId?: string }
): Promise<Task> => {
  const { data } = await api.post<Task>(BASE, task);
  return data;
};

/** Atualiza tarefa (parcial) */
export const updateTask = async (
  id: string,
  patch: UpdateTaskRequest
): Promise<Task> => {
  // remove chaves undefined para não sobrescrever nada por engano
  const body: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(patch)) {
    if (v !== undefined) body[k] = v;
  }
  const { data } = await api.put<Task>(`${BASE}/${id}`, body);
  return data;
};

/** Atualiza apenas o status */
export const updateTaskStatus = async (
  id: string,
  status: TaskStatus
): Promise<Task> => {
  const { data } = await api.put<Task>(`${BASE}/${id}`, { status });
  return data;
};

/** Comentários */
export const fetchCommentsForTask = async (taskId: string): Promise<Comment[]> => {
  const { data } = await api.get<Comment[]>(`${BASE}/${taskId}/comments`);
  return data;
};

export const addCommentToTask = async (
  taskId: string,
  content: string
): Promise<Comment> => {
  const { data } = await api.post<Comment>(`${BASE}/${taskId}/comments`, { content });
  return data;
};

export const deleteCommentFromTask = async (
  taskId: string,
  commentId: string
): Promise<void> => {
  await api.delete(`${BASE}/${taskId}/comments/${commentId}`);
};

/** Anexos */
export const uploadAttachmentToTask = async (
  taskId: string,
  file: File
): Promise<Attachment> => {
  const formData = new FormData();
  formData.append('file', file);

  // Não setar Content-Type manualmente; o browser define o boundary
  const { data } = await api.post<Attachment>(`${BASE}/${taskId}/attachments`, formData);
  return data;
};

export const fetchAttachmentsForTask = async (
  taskId: string
): Promise<Attachment[]> => {
  const { data } = await api.get<Attachment[]>(`${BASE}/${taskId}/attachments`);
  return data;
};

export const deleteAttachmentFromTask = async (
  taskId: string,
  attachmentId: string
): Promise<void> => {
  await api.delete(`${BASE}/${taskId}/attachments/${attachmentId}`);
};

/** Exclusão da tarefa */
export const deleteTask = async (id: string): Promise<void> => {
  await api.delete(`${BASE}/${id}`);
};
