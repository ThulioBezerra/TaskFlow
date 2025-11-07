import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as projectService from '../services/projectService';
import { getUsers, getUsersByName } from '../services/userService';
import toast from 'react-hot-toast';
import './CreateProjectModal.css';
import type { AllUsers } from '../types';
import { useQuery } from '@tanstack/react-query';

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
  const { data: allUsers = [] } = useQuery<AllUsers[]>({
    queryKey: ['users'],
    queryFn: getUsers,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Agora são só strings (emails)
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // guarda o timeout sem causar re-render
  const timerRef = useRef<number | null>(null);

  // filtro local por email usando cache
  const locallyFiltered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return [];
    return allUsers
      .filter((u) => u.email?.toLowerCase().includes(term))
      .map((u) => u.email);
  }, [allUsers, searchTerm]);

    useEffect(() => {
    // limpa timeout anterior
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    const term = searchTerm.trim();
    if (!term) {
      // zera resultados se campo vazio
      setSearchResults((prev) => (prev.length ? [] : prev));
      return;
    }

    timerRef.current = window.setTimeout(async () => {
      try {
        // 1) filtro local pelo cache (allUsers)
        const lower = term.toLowerCase();
        let candidates = allUsers
          .filter((u) => u.email?.toLowerCase().includes(lower))
          .map((u) => u.email);

        // 2) fallback no servidor se nada no cache
        if (candidates.length === 0) {
          const serverUsers = await getUsersByName(term);
          candidates = serverUsers.map((u: { email: string }) => u.email);
        }

        // 3) remove já selecionados
        candidates = candidates.filter((email) => !selectedUsers.includes(email));

        // 4) evita setState redundante (prev == candidates)
        setSearchResults((prev) => {
          if (prev.length === candidates.length &&
              prev.every((v, i) => v === candidates[i])) {
            return prev;
          }
          return candidates;
        });
      } catch (err) {
        console.error('Error searching users:', err);
        toast.error('Failed to search users.');
      }
    }, 300);

    // cleanup
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [searchTerm, allUsers, selectedUsers]);

  const handleAddUser = (email: string) => {
    if (!selectedUsers.includes(email)) {
      setSelectedUsers((prev) => [...prev, email]);
    }
    setSearchTerm('');
    setSearchResults([]);
  };

  const handleRemoveUser = (email: string) => {
    setSelectedUsers((prev) => prev.filter((e) => e !== email));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) return;

    try {
      // IMPORTANTE: envie memberEmails (não memberIds)
      await projectService.createProject({
        name: projectName.trim(),
        description: projectDescription.trim(),
        memberEmails: selectedUsers, // <<< aqui vai a lista de emails
      });

      toast.success('Project created successfully!');
      setProjectName('');
      setProjectDescription('');
      setSelectedUsers([]);
      setSearchTerm('');
      setSearchResults([]);
      onClose();
      onCreateProject();
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('Failed to create project.');
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
                  <button type="button" onClick={() => handleRemoveUser(email)}>x</button>
                </span>
              ))}
            </div>
          </div>

          <div className="modal-actions">
            <button type="submit" className="primary-button">Create Project</button>
            <button type="button" onClick={onClose} className="secondary-button">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectModal;
