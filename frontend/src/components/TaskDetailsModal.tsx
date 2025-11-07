import React from "react";
import { TaskStatus } from "./TaskCard";
import type { Task } from "./TaskCard";
import CommentsSection from "./CommentsSection";
import AttachmentsSection from "./AttachmentsSection";
import { useTaskDetails } from "../hooks/useTasks";
import { useUsers } from "../hooks/useUsers";

interface TaskDetailsModalProps {
  task: Task;
  onClose: () => void;
}

const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({
  task,
  onClose,
}) => {
  const {
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

    projects,
    comments,

    // carregamento/mutações
    loadingAny,
    updateIsPending,
    deleteIsPending,

    // actions
    handleSubmit,
    handleDelete,
  } = useTaskDetails({ task, onClose });
  const { users: allUsers } = useUsers();
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Edit Task</h2>

        {loadingAny ? (
          <div>Loading...</div>
        ) : (
          <>
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="project">Project</label>
                <select
                  id="project"
                  value={selectedProjectId || ""}
                  onChange={(e) =>
                    setSelectedProjectId(e.target.value || undefined)
                  }
                >
                  <option value="">-- No Project --</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
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
                    <option key={s} value={s}>
                      {s.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="priority">Priority</label>
                <input
                  type="number"
                  id="priority"
                  value={priority}
                  onChange={(e) => setPriority(parseInt(e.target.value))}
                />
              </div>

              <div>
                <label htmlFor="dueDate">Due Date</label>
                <input
                  type="date"
                  id="dueDate"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="assignee">Assignee</label>
                <select
                  id="assignee"
                  value={selectedAssigneeId ?? ""} // usamos email como value
                  onChange={(e) =>
                    setSelectedAssigneeId(e.target.value || undefined)
                  }
                >
                  <option value="">-- No Assignee --</option>
                  {allUsers.map((user) => (
                    <option key={user.email} value={user.email}>
                      {user.email}
                    </option>
                  ))}
                </select>
              </div>

              <button type="submit" disabled={updateIsPending}>
                {updateIsPending ? "Saving..." : "Save"}
              </button>
              <button type="button" onClick={onClose}>
                Cancel
              </button>
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
              onCommentAdded={(newComment) =>
                // como os comentários vêm do react-query no hook, podemos atualizar
                // via setQueryData lá; aqui é só passar o callback se você quiser manter
                // igual antes – mas está funcional assim
                undefined
              }
            />

            <AttachmentsSection taskId={task.id} />
          </>
        )}
      </div>
    </div>
  );
};

export default TaskDetailsModal;
