import React, { useState, useMemo, useEffect } from "react";
import { createTask } from "../services/taskService";
import { useProjectsByUser } from "../hooks/useProjectsByUser";
import { useUsers } from "../hooks/useUsers";
import toast from "react-hot-toast";
import "./CreateProjectModal.css"; // Importe o CSS para usar as classes

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskCreated?: () => void;
}

interface ProjectSummary {
  id: string;
  name: string;
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  isOpen,
  onClose,
  onTaskCreated,
}) => {
  const { projects: fetchedProjects } = useProjectsByUser();
  const projects = useMemo(() => {
    if (Array.isArray(fetchedProjects))
      return fetchedProjects as ProjectSummary[];
    return [];
  }, [fetchedProjects]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState<
    string | undefined
  >(undefined);
  const [error, setError] = useState<string | null>(null);
  const { users } = useUsers();
  console.log("DADOS DE USUÁRIOS (Task Modal):", users);
  const [assigneeSearchTerm, setAssigneeSearchTerm] = useState("");
  const [selectedAssignee, setSelectedAssignee] = useState<string | null>(null);
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("MEDIUM");

  // Limpa o formulário quando o modal é reaberto ou fechado
  useEffect(() => {
    if (!isOpen) {
      setTitle("");
      setDescription("");
      setSelectedProjectId(undefined);
      setError(null);
      setAssigneeSearchTerm("");
      setSelectedAssignee(null);
      setDueDate("");
      setPriority("MEDIUM");
    }
  }, [isOpen]);

  const assigneeSearchResults = useMemo(() => {
    const term = assigneeSearchTerm.trim().toLowerCase();
    if (!term) return [];
    return users
      .filter((u) => u.email?.toLowerCase().includes(term))
      .map((u) => u.email)
      .filter((email) => email !== selectedAssignee);
  }, [users, assigneeSearchTerm, selectedAssignee]);

  const handleSelectAssignee = (email: string) => {
    setSelectedAssignee(email);
    setAssigneeSearchTerm("");
  };

  const handleRemoveAssignee = () => {
    setSelectedAssignee(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title) {
      setError("Title is required");
      return;
    }
    if (!selectedProjectId) {
      setError("Project is required");
      return;
    }

    try {
      await createTask({
        title,
        description,
        projectId: selectedProjectId,
        assigneeEmail: selectedAssignee,
        dueDate: dueDate || null,
        priority,
      });

      toast.success("Task created successfully!");
      if (onTaskCreated) {
        onTaskCreated();
      }
      onClose();
    } catch (err) {
      console.error("Error creating task:", err);
      toast.error("Failed to create task.");
      setError("Failed to create task. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Create New Task</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="project">Project *</label>
            <select
              id="project"
              value={selectedProjectId || ""}
              onChange={(e) =>
                setSelectedProjectId(e.target.value || undefined)
              }
              required
            >
              <option value="" disabled>
                -- Select a Project --
              </option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          {/* --- CAMPO DE ASSIGNEE CORRIGIDO --- */}
          <div className="form-group">
            <label htmlFor="assigneeSearch">Assignee (Optional)</label>
            {!selectedAssignee ? (
              <>
                <input
                  type="text"
                  id="assigneeSearch"
                  placeholder="Search by email..."
                  value={assigneeSearchTerm}
                  onChange={(e) => setAssigneeSearchTerm(e.target.value)}
                  autoComplete="off"
                />
                {assigneeSearchResults.length > 0 && (
                  <ul className="search-results">
                    {assigneeSearchResults.map((email) => (
                      <li
                        key={email}
                        onClick={() => handleSelectAssignee(email)}
                      >
                        {email}
                      </li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              <div className="selected-users">
                <span className="selected-user-tag">
                  {selectedAssignee}
                  <button type="button" onClick={handleRemoveAssignee}>
                    x
                  </button>
                </span>
              </div>
            )}
          </div>

          {/* Prioridade */}
          <div className="form-group">
            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>

          {/* Data de Entrega */}
          <div className="form-group">
            <label htmlFor="dueDate">Due Date (Optional)</label>
            <input
              type="date"
              id="dueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          {error && (
            <p className="error" style={{ color: "red" }}>
              {error}
            </p>
          )}

          <div className="modal-actions">
            <button type="submit" className="primary-button">
              Create Task
            </button>
            <button
              type="button"
              onClick={onClose}
              className="secondary-button"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal;
