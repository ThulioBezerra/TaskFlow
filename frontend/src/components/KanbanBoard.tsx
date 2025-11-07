// src/components/KanbanBoard.tsx
import React, { useState, useMemo } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import KanbanColumn from "./KanbanColumn";
import { getTasks, updateTaskStatus } from "../services/taskService";
import { useProjectsByUser } from "../hooks/useProjectsByUser";
import type { Task, TaskStatus } from "./TaskCard";
import type { ProjectSummary } from "../types";
import TaskDetailsModal from "./TaskDetailsModal";


function normPriority(p: unknown): "LOW" | "MEDIUM" | "HIGH" | null {
  if (p == null) return null;
  const s = String(p).trim().toUpperCase();
  if (s === "LOW" || s === "MEDIUM" || s === "HIGH") return s;
  const n = Number(p);
  if (!Number.isNaN(n)) {
    if (n <= 1) return "LOW";
    if (n === 2) return "MEDIUM";
    if (n >= 3) return "HIGH";
  }
  return null;
}

function normalizeProjects(resp: unknown): ProjectSummary[] {
  if (Array.isArray(resp)) return resp;
  const anyResp = resp as any;
  if (Array.isArray(anyResp?.content)) return anyResp.content;
  if (Array.isArray(anyResp?.data)) return anyResp.data;
  return [];
}

const KanbanBoard: React.FC = () => {
  const queryClient = useQueryClient();

  // dados
  const { data: tasks = [], isLoading: loadingTasks } = useQuery<Task[]>({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });
  const { projects: fetchedProjects } = useProjectsByUser();

  // estado UI
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [filterProjectId, setFilterProjectId] = useState<string | undefined>(undefined);
  const [filterStatus, setFilterStatus] = useState<"ALL" | TaskStatus>("ALL");
  const [filterAssignee, setFilterAssignee] = useState<"ALL" | string>("ALL");
  const [filterPriority, setFilterPriority] =
    useState<"ALL" | "LOW" | "MEDIUM" | "HIGH">("ALL");

  // normaliza projetos
  const projects = useMemo(() => normalizeProjects(fetchedProjects), [fetchedProjects]);

  // opções de assignee (emails vindos de projetos e tasks)
  const assigneeOptions = useMemo(() => {
    const emails = new Set<string>();
    (projects ?? []).forEach(p => p?.members?.forEach(m => m?.email && emails.add(m.email.toLowerCase())));
    (tasks ?? []).forEach(t => t.assignee?.email && emails.add(t.assignee.email.toLowerCase()));
    return Array.from(emails).sort((a, b) => a.localeCompare(b));
  }, [projects, tasks]);


  // mutation de mover
  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: TaskStatus }) =>
      updateTaskStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const t = tasks.find(tt => tt.id === active.id);
    if (t) mutation.mutate({ id: t.id, status: over.id as TaskStatus });
  };

  const filteredTasks = useMemo(() => {
    const filterAssigneeLower =
      filterAssignee !== "ALL" ? filterAssignee.toLowerCase() : "ALL";

    return (tasks ?? []).filter((task) => {
      if (filterProjectId && task.project?.id !== filterProjectId) return false;
      if (filterStatus !== "ALL" && task.status !== filterStatus) return false;

      if (filterAssigneeLower !== "ALL") {
        const email = (task.assignee?.email ?? "").toLowerCase();
        if (email !== filterAssigneeLower) return false;
      }

      if (filterPriority !== "ALL" && normPriority(task.priority) !== filterPriority) return false;
      return true;
    });
  }, [tasks, filterProjectId, filterStatus, filterAssignee, filterPriority]);

  const columns = useMemo(() => ({
    TO_DO:       filteredTasks.filter(t => t.status === "TO_DO"),
    IN_PROGRESS: filteredTasks.filter(t => t.status === "IN_PROGRESS"),
    DONE:        filteredTasks.filter(t => t.status === "DONE"),
  }), [filteredTasks]);

  if (loadingTasks) return <div style={{ color: "#fff", textAlign: "center" }}>Loading…</div>;

  console.table((tasks ?? []).map(t => ({
  id: t.id,
  title: t.title,
  assignee: t.assignee?.email ?? null
  })));

  return (
    <>
      {/* Barra única de filtros */}
      <div style={{ margin: "16px auto 24px", display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
        <label style={{ color: "#ccc" }}>
          <span style={{ marginRight: 6 }}>Project:</span>
          <select value={filterProjectId ?? ""} onChange={(e) => setFilterProjectId(e.target.value || undefined)}>
            <option value="">All Projects</option>
            {(projects ?? []).map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </label>

        <label style={{ color: "#ccc" }}>
          <span style={{ marginRight: 6 }}>Status:</span>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as any)}>
            <option value="ALL">All</option>
            <option value="TO_DO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
        </label>

        <label style={{ color: "#ccc" }}>
          <span style={{ marginRight: 6 }}>Assignee:</span>
          <select
            value={filterAssignee}
            onChange={(e) => setFilterAssignee(e.target.value as any)}
          >
            <option value="ALL">All</option>
            {assigneeOptions.map(email => (
              <option key={email} value={email.toLowerCase()}>{email}</option>
            ))}
          </select>

        </label>

        <label style={{ color: "#ccc" }}>
          <span style={{ marginRight: 6 }}>Priority:</span>
          <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value as any)}>
            <option value="ALL">All</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </label>
      </div>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <KanbanColumn id="TO_DO"        title="To Do"        tasks={columns.TO_DO}        onTaskClick={setSelectedTask} />
          <KanbanColumn id="IN_PROGRESS"  title="In Progress"  tasks={columns.IN_PROGRESS}  onTaskClick={setSelectedTask} />
          <KanbanColumn id="DONE"         title="Done"         tasks={columns.DONE}         onTaskClick={setSelectedTask} />
        </div>
      </DndContext>

      {selectedTask && (
        <TaskDetailsModal 
        task={selectedTask} 
        onClose={() => setSelectedTask(null)} 
        />
      )}
    </>
  );
};

export default KanbanBoard;
