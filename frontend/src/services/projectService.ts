// src/services/projectService.ts
import type { ProjectSummary } from '../types';
import { api } from './api';

export interface ProjectDetails {
  id: string;
  name: string;
  description: string;
  manager: { id: string; username: string; email: string };
  members: { id: string; username: string; email: string }[];
  webhookUrl: string;
  notificationEvents: string[];
}

export async function getProjects(): Promise<ProjectSummary[]> {
  return await api.get('/projects');
}

export async function getProjectById(
  id: string,
  tokenOverride?: string
): Promise<ProjectDetails> { // ✅ era ProjectSummary
  return await api.get(`/projects/${id}`);
}

export async function createProject(
  project: { name: string; description: string; memberEmails: string[] },
  tokenOverride?: string
): Promise<ProjectDetails> { // ✅ se o backend retorna o objeto completo
  return await api.post(
    '/projects',
    JSON.stringify(project),
  );
}

export async function updateProject(
  id: string,
  project: { name: string; description: string; managerId?: string; memberIds?: string[]; webhookUrl?: string; notificationEvents?: string[] }
): Promise<ProjectDetails> { // ✅ objeto completo
  return await api.put(
    `/projects/${id}`,
    JSON.stringify(project)
  );
}
