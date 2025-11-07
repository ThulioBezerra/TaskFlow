  import React, { useState, useMemo, useEffect } from "react";
  import { createTask } from "../services/taskService";
  import { useProjectsByUser } from "../hooks/useProjectsByUser";
  import toast from "react-hot-toast";
  import "./CreateProjectModal.css";

  interface MemberLite { id: string; email: string }
  interface ProjectWithPeople {
    id: string;
    name: string;
    description?: string;
    manager?: MemberLite;
    members?: MemberLite[];
  }

  interface CreateTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onTaskCreated?: () => void;
  }

  const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
    isOpen,
    onClose,
    onTaskCreated,
  }) => {
    // Projetos do usuário (precisam vir com manager + members)
    const { projects: fetchedProjects } = useProjectsByUser();

    const projects = useMemo<ProjectWithPeople[]>(() => {
      return Array.isArray(fetchedProjects) ? (fetchedProjects as ProjectWithPeople[]) : [];
    }, [fetchedProjects]);

    // Form
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>(undefined);
    const [dueDate, setDueDate] = useState("");
    const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH">("MEDIUM");
    const [error, setError] = useState<string | null>(null);

    // Assignee (apenas membros do projeto)
    const [assigneeSearchTerm, setAssigneeSearchTerm] = useState("");
    const [selectedAssignee, setSelectedAssignee] = useState<string | null>(null);

    // Reseta tudo quando fechar/abrir
    useEffect(() => {
      if (!isOpen) {
        setTitle("");
        setDescription("");
        setSelectedProjectId(undefined);
        setDueDate("");
        setPriority("MEDIUM");
        setAssigneeSearchTerm("");
        setSelectedAssignee(null);
        setError(null);
      }
    }, [isOpen]);

    // Projeto selecionado
    const selectedProject = useMemo(
      () => projects.find((p) => p.id === selectedProjectId),
      [projects, selectedProjectId]
    );

    // E-mails permitidos (manager + members) do projeto atual
    const allowedAssignees = useMemo<string[]>(() => {
      if (!selectedProject) return [];
      const emails = [
        selectedProject.manager?.email,
        ...(selectedProject.members?.map((m) => m.email) ?? []),
      ].filter(Boolean) as string[];
      // dedup
      return Array.from(new Set(emails));
    }, [selectedProject]);

    // Se trocar de projeto e o assignee atual não pertence, limpa
    useEffect(() => {
      if (selectedAssignee && !allowedAssignees.includes(selectedAssignee)) {
        setSelectedAssignee(null);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedProjectId, allowedAssignees.join("|")]);

    // Busca apenas dentro de allowedAssignees
    const assigneeSearchResults = useMemo(() => {
      const term = assigneeSearchTerm.trim().toLowerCase();
      if (!term || !selectedProjectId) return [];
      return allowedAssignees
        .filter((email) => email.toLowerCase().includes(term))
        .filter((email) => email !== selectedAssignee);
    }, [assigneeSearchTerm, allowedAssignees, selectedAssignee, selectedProjectId]);

    const handleSelectAssignee = (email: string) => {
      setSelectedAssignee(email);
      setAssigneeSearchTerm("");
    };

    const handleRemoveAssignee = () => setSelectedAssignee(null);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      if (!title.trim()) {
        setError("Title is required");
        return;
      }
      if (!selectedProjectId) {
        setError("Project is required");
        return;
      }
      // Segurança extra: se tiver assignee, valide que está nos allowed
      if (selectedAssignee && !allowedAssignees.includes(selectedAssignee)) {
        setError("Selected assignee is not part of this project");
        return;
      }

      try {
        await createTask({
          title: title.trim(),
          description: description.trim(),
          projectId: selectedProjectId,
          assigneeEmail: selectedAssignee ?? null,
          dueDate: dueDate || null,
          priority,
        });

        toast.success("Task created successfully!");
        onTaskCreated?.();
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
            {/* Title */}
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

            {/* Description */}
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Project */}
            <div className="form-group">
              <label htmlFor="project">Project *</label>
              <select
                id="project"
                value={selectedProjectId || ""}
                onChange={(e) => setSelectedProjectId(e.target.value || undefined)}
                required
              >
                <option value="" disabled>
                  -- Select a Project --
                </option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Assignee (só gente do projeto) */}
            <div className="form-group">
              <label htmlFor="assigneeSearch">Assignee (Optional)</label>

              {!selectedProjectId ? (
                <small style={{ opacity: 0.8 }}>
                  Select a project to choose an assignee.
                </small>
              ) : !selectedAssignee ? (
                <>
                  <input
                    type="text"
                    id="assigneeSearch"
                    placeholder="Search by email (project members only)..."
                    value={assigneeSearchTerm}
                    onChange={(e) => setAssigneeSearchTerm(e.target.value)}
                    autoComplete="off"
                    disabled={!selectedProjectId}
                  />
                  {assigneeSearchResults.length > 0 && (
                    <ul className="search-results">
                      {assigneeSearchResults.map((email) => (
                        <li key={email} onClick={() => handleSelectAssignee(email)}>
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
                    <button type="button" onClick={handleRemoveAssignee}>x</button>
                  </span>
                </div>
              )}
            </div>

            {/* Priority */}
            <div className="form-group">
              <label htmlFor="priority">Priority</label>
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as typeof priority)}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>

            {/* Due date */}
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

            {error && <p className="error" style={{ color: "red" }}>{error}</p>}

            <div className="modal-actions">
              <button type="submit" className="primary-button">Create Task</button>
              <button type="button" onClick={onClose} className="secondary-button">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  export default CreateTaskModal;
