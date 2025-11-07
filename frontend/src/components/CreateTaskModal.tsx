// src/components/CreateTaskModal.tsx
import React, { useState, useEffect } from 'react';
import { createTask } from '../services/taskService';
import { getProjects } from '../services/projectService';
import { ProjectSummary } from '../types';

interface CreateTaskModalProps {
  onClose: () => void;
  token: string;
  onTaskCreated?: () => void; // 👉 nova prop opcional
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ onClose, token, onTaskCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>(undefined);
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const fetchedProjects = await getProjects();
        setProjects(fetchedProjects);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects.');
      }
    };
    fetchProjects();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title) {
      setError('Title is required');
      return;
    }

    try {
      await createTask({ title, description, projectId: selectedProjectId });

      // avisa o pai que criou
      if (onTaskCreated) {
        onTaskCreated();
      }

      // fecha modal
      onClose();
    } catch (err) {
      console.error('Error creating task:', err);
      setError('Failed to create task. Please try again.');
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Create New Task</h2>
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
              value={selectedProjectId || ''}
              onChange={(e) => setSelectedProjectId(e.target.value || undefined)}
            >
              <option value="">-- No Project --</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit">Create Task</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal;
