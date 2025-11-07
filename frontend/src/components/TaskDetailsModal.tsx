// src/components/TaskDetailsModal.tsx
import React from "react";
import { TaskStatus, type Task } from "./TaskCard";
import useTaskDetails from "../hooks/useTasks"; // 👈 IMPORTA O HOOK (default)
import { useUsers } from "../hooks/useUsers";
import { useProjectsByUser } from "../hooks/useProjectsByUser";
import CommentsSection from "./CommentsSection";
import AttachmentsSection from "./AttachmentsSection";
import { useQueryClient } from "@tanstack/react-query";

interface TaskDetailsModalProps {
  task: Task;
  onClose: () => void;
}

const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({ task, onClose }) => {
  const qc = useQueryClient();

  // 👇 AQUI usamos o hook DENTRO do componente
  const {
    title, setTitle,
    description, setDescription,
    priority, setPriority,
    dueDate, setDueDate,
    status, setStatus,
    selectedAssigneeId, setSelectedAssigneeId,
    selectedProjectId, setSelectedProjectId,
    comments,
    loadingAny, updateIsPending, deleteIsPending,
    handleSubmit, handleDelete,
  } = useTaskDetails({ task, onClose });

  // fontes para selects (se quiser)
  const { users = [] } = useUsers();
  const { projects = [] } = useProjectsByUser();

  return (
    <div className="modal" onClick={(e) => e.stopPropagation()}>
      <div className="modal-content" style={{ position: "relative", overflow: "visible", zIndex: 5 }}>
        <h2>Edit Task</h2>

        {loadingAny ? (
          <div>Loading...</div>
        ) : (
          <>
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="title">Title</label>
                <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>

              <div>
                <label htmlFor="description">Description</label>
                <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>

              <div>
                <label htmlFor="project">Project</label>
                <select
                  id="project"
                  value={selectedProjectId || ""}
                  onChange={(e) => setSelectedProjectId(e.target.value || undefined)}
                >
                  <option value="">-- No Project --</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as TaskStatus)}
                >
                  {Object.values(TaskStatus).map((s) => (
                    <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="priority">Priority</label>
                <input
                  id="priority"
                  type="number"
                  value={priority}
                  onChange={(e) => setPriority(Number(e.target.value))}
                />
              </div>

              <div>
                <label htmlFor="dueDate">Due Date</label>
                <input
                  id="dueDate"
                  type="date"
                  value={dueDate ?? ""}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="assignee">Assignee</label>
                <select
                  id="assignee"
                  value={selectedAssigneeId ?? ""}  // email
                  onChange={(e) => setSelectedAssigneeId(e.target.value || undefined)}
                >
                  <option value="">-- No Assignee --</option>
                  {users.map((u) => (
                    <option key={u.email} value={u.email}>{u.email}</option>
                  ))}
                </select>
              </div>

              <button type="submit" disabled={updateIsPending}>
                {updateIsPending ? "Saving..." : "Save"}
              </button>
              <button type="button" onClick={onClose}>Cancel</button>
              <button
                type="button"
                onClick={handleDelete}
                style={{ backgroundColor: "red", color: "white" }}
                disabled={deleteIsPending}
              >
                {deleteIsPending ? "Deleting..." : "Delete"}
              </button>
            </form>

            <CommentsSection
              taskId={task.id}
              comments={comments}
              onCommentAdded={(newComment) => {
                // atualiza cache dos comentários se quiser
                qc.setQueryData<any[]>(["task-comments", task.id], (prev = []) => [...prev, newComment]);
              }}
            />

            <AttachmentsSection taskId={task.id} />
          </>
        )}
      </div>
    </div>
  );
};

export default TaskDetailsModal;
