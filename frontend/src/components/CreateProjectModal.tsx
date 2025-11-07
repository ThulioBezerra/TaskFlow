import React, { useState } from 'react';
import * as projectService from '../services/projectService';
import toast from 'react-hot-toast';
import './CreateProjectModal.css';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: () => void; // No longer passes project data, as it's handled internally
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ isOpen, onClose, onCreateProject }) => {
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<{ id: string; name: string }[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<{ id: string; name: string }[]>([]);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term.trim()) {
      try {
        const users = await projectService.searchUsers(term);
        setSearchResults(users.filter(user => !selectedUsers.some(selected => selected.id === user.id)));
      } catch (error) {
        toast.error('Failed to search users.');
        console.error('Error searching users:', error);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleAddUser = (user: { id: string; name: string }) => {
    setSelectedUsers((prev) => [...prev, user]);
    setSearchTerm('');
    setSearchResults([]);
  };

  const handleRemoveUser = (userId: string) => {
    setSelectedUsers((prev) => prev.filter((user) => user.id !== userId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (projectName.trim()) {
      try {
        // Assuming a current user ID for managerId. In a real app, this would come from auth context.
        const managerId = '1'; // Placeholder for current user ID
        await projectService.createProject({
          name: projectName,
          description: projectDescription,
          managerId: managerId,
          memberIds: selectedUsers.map(user => user.id),
        });
        toast.success('Project created successfully!');
        setProjectName('');
        setProjectDescription('');
        setSelectedUsers([]);
        onClose(); // Close modal on success
        onCreateProject(); // Notify parent component of project creation
      } catch (error) {
        toast.error('Failed to create project.');
        console.error('Error creating project:', error);
      }
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
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="userSearch">Add Collaborators:</label>
            <input
              type="text"
              id="userSearch"
              placeholder="Search users..."
              value={searchTerm}
              onChange={handleSearch}
            />
            {searchResults.length > 0 && (
              <ul className="search-results">
                {searchResults.map((user) => (
                  <li key={user.id} onClick={() => handleAddUser(user)}>
                    {user.name}
                  </li>
                ))}
              </ul>
            )}
            <div className="selected-users">
              {selectedUsers.map((user) => (
                <span key={user.id} className="selected-user-tag">
                  {user.name}
                  <button type="button" onClick={() => handleRemoveUser(user.id)}>x</button>
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
