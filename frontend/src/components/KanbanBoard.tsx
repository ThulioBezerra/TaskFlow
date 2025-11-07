// src/components/KanbanBoard.tsx
import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import KanbanColumn from './KanbanColumn';
import { getTasks, updateTaskStatus } from '../services/taskService';
import { getProjects } from '../services/projectService';
import type { Task, TaskStatus } from './TaskCard';
import type { ProjectSummary } from '../types';
import TaskDetailsModal from './TaskDetailsModal';

// Ajuda a normalizar qualquer formato que vier do backend
function normalizeProjects(resp: unknown): ProjectSummary[] {
  if (Array.isArray(resp)) return resp;
  // casos comuns: { content: [...] } ou { data: [...] }
  const anyResp = resp as any;
  if (Array.isArray(anyResp?.content)) return anyResp.content;
  if (Array.isArray(anyResp?.data)) return anyResp.data;
  return [];
}

interface KanbanBoardProps {
  projectsVersion?: number;
  tasksVersion?: number;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ projectsVersion, tasksVersion }) => {
  const queryClient = useQueryClient();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [filterProjectId, setFilterProjectId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchProjectsSafe = async () => {
      try {
        const fetched = await getProjects();
        const normalized = normalizeProjects(fetched);
        setProjects(normalized);
        if (!Array.isArray(fetched)) {
          console.warn('getProjects() não retornou array. Normalizado para []/content.', fetched);
        }
      } catch (err) {
        console.error('Error fetching projects:', err);
        setProjects([]); // evita quebrar o map
      }
    };
    fetchProjectsSafe();
  }, [projectsVersion]);

  const { data: tasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ['tasks', tasksVersion],
    queryFn: () => getTasks(),
  });

  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: TaskStatus }) =>
      updateTaskStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const activeTask = tasks.find((t) => t.id === active.id);
      if (activeTask) {
        mutation.mutate({ id: activeTask.id, status: over.id as TaskStatus });
      }
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const filteredTasks = filterProjectId
    ? tasks.filter((task) => task.project?.id === filterProjectId)
    : tasks;

  const columns = {
    TO_DO: filteredTasks.filter((t) => t.status === 'TO_DO'),
    IN_PROGRESS: filteredTasks.filter((t) => t.status === 'IN_PROGRESS'),
    DONE: filteredTasks.filter((t) => t.status === 'DONE'),
  };

  const projectOptions = Array.isArray(projects) ? projects : [];

  return (
    <>
      <div style={{ marginBottom: '10px', textAlign: 'center' }}>
        <label htmlFor="projectFilter">Filter by Project: </label>
        <select
          id="projectFilter"
          value={filterProjectId || ''}
          onChange={(e) => setFilterProjectId(e.target.value || undefined)}
        >
          <option value="">All Projects</option>
          {projectOptions.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <KanbanColumn
            id="TO_DO"
            title="To Do"
            tasks={columns.TO_DO}
            onTaskClick={setSelectedTask}
          />
          <KanbanColumn
            id="IN_PROGRESS"
            title="In Progress"
            tasks={columns.IN_PROGRESS}
            onTaskClick={setSelectedTask}
          />
          <KanbanColumn
            id="DONE"
            title="Done"
            tasks={columns.DONE}
            onTaskClick={setSelectedTask}
          />
        </div>
      </DndContext>

      {selectedTask && (
        <TaskDetailsModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          // se seu modal não usa mais token (axios com interceptor), remova essa prop do modal
          // token={...}
        />
      )}
    </>
  );
};

export default KanbanBoard;
