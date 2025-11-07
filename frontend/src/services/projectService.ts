// src/services/projectService.ts
import type { ProjectSummary } from '../types';

export interface ProjectDetails {
  id: string;
  name: string;
  description: string;
  manager: { id: string; username: string; email: string };
  members: { id: string; username: string; email: string }[];
  webhookUrl: string;
  notificationEvents: string[];
}

const API_BASE_URL = 'http://localhost:8080/api';

function getAuthToken(override?: string) {
  return override ?? localStorage.getItem('token') ?? '';
}

async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  tokenOverride?: string
): Promise<T> {
  const token = getAuthToken(tokenOverride);

  const resp = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!resp.ok) {
    // tenta parsear JSON; se não der, usa texto simples
    let message = `HTTP ${resp.status}`;
    try {
      const data = await resp.json();
      message = data?.message || message;
    } catch {
      try {
        const text = await resp.text();
        if (text) message = text;
      } catch {
        /* ignore */
      }
    }
    throw new Error(message);
  }

  // algumas respostas podem vir sem body
  try {
    return (await resp.json()) as T;
  } catch {
    return undefined as unknown as T;
  }
}

export async function getProjects(tokenOverride?: string): Promise<ProjectSummary[]> {
  return apiFetch<ProjectSummary[]>('/projects', { method: 'GET' }, tokenOverride);
}

export async function getProjectById(
  id: string,
  tokenOverride?: string
): Promise<ProjectDetails> { // ✅ era ProjectSummary
  return apiFetch<ProjectDetails>(`/projects/${id}`, { method: 'GET' }, tokenOverride);
}

export async function createProject(
  project: { name: string; description: string; managerId: string; memberIds: string[] },
  tokenOverride?: string
): Promise<ProjectDetails> { // ✅ se o backend retorna o objeto completo
  return apiFetch<ProjectDetails>(
    '/projects',
    { method: 'POST', body: JSON.stringify(project) },
    tokenOverride
  );
}

export async function updateProject(
  id: string,
  project: { name: string; description: string; managerId?: string; memberIds?: string[]; webhookUrl?: string; notificationEvents?: string[] },
  tokenOverride?: string
): Promise<ProjectDetails> { // ✅ objeto completo
  return apiFetch<ProjectDetails>(
    `/projects/${id}`,
    { method: 'PUT', body: JSON.stringify(project) },
    tokenOverride
  );
}
