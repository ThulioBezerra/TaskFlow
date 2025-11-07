import React, { useMemo, useState } from "react";
import * as projectService from "../services/projectService";
// import { getUsersByName } from "../services/userService"; // Não é mais necessário
import toast from "react-hot-toast";
import "./CreateProjectModal.css";
import { useUsers } from "../hooks/useUsers";

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: () => void;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
  onCreateProject,
}) => {
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { users } = useUsers(); // Sua "lista constante" de usuários
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // Calcula os resultados da busca dinamicamente
  const searchResults = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    // Se não há termo, não mostre resultados
    if (!term) {
      return [];
    }

    // Filtra a lista 'users' local, remove os já selecionados
    return users
      .filter((u) => u.email?.toLowerCase().includes(term))
      .map((u) => u.email)
      .filter((email) => !selectedUsers.includes(email ?? "")); // Garante que email não é null/undefined na comparação
  }, [users, searchTerm, selectedUsers]); // Recalcula se qualquer um mudar

  const handleAddUser = (email: string) => {
    if (!selectedUsers.includes(email)) {
      setSelectedUsers((prev) => [...prev, email]);
    }
    setSearchTerm(""); // Limpar o termo já faz o useMemo retornar []
  };

  const handleRemoveUser = (email: string) => {
    setSelectedUsers((prev) => prev.filter((e) => e !== email));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) return;

    try {
      await projectService.createProject({
        name: projectName.trim(),
        description: projectDescription.trim(),
        memberEmails: selectedUsers,
      });

      toast.success("Project created successfully!");
      setProjectName("");
      setProjectDescription("");
      setSelectedUsers([]);
      setSearchTerm(""); // Limpar o termo já esvazia os resultados
      onClose();
      onCreateProject();
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Failed to create project.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Create New Project</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="projectName">Project Name:</label>

            <input
              type="text"
              id="projectName"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="projectDescription">Description (Optional):</label>

            <textarea
              id="projectDescription"
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="userSearch">Add Collaborators:</label>
            <input
              type="text"
              id="userSearch"
              placeholder="Search by email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoComplete="off"
            />

            {/* O JSX de renderização funciona exatamente como antes */}
            {searchResults.length > 0 && (
              <ul className="search-results">
                {searchResults.map((email) => (
                  <li key={email} onClick={() => handleAddUser(email)}>
                    {email}
                  </li>
                ))}
              </ul>
            )}

            <div className="selected-users">
              {selectedUsers.map((email) => (
                <span key={email} className="selected-user-tag">
                  {email}
                  <button type="button" onClick={() => handleRemoveUser(email)}>
                    x
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="modal-actions">
            <button type="submit" className="primary-button">
              Create Project
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

export default CreateProjectModal;
