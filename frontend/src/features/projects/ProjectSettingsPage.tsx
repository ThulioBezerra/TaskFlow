import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import * as projectService from '../../services/projectService';
import toast from 'react-hot-toast';
import './ProjectSettingsPage.css';

interface Project {
  id: string;
  name: string;
  description: string;
  manager: { id: string; username: string; email: string };
  members: { id: string; username: string; email: string }[];
}

const ProjectSettingsPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedDescription, setEditedDescription] = useState('');

  useEffect(() => {
    const fetchProject = async () => {
      if (projectId) {
        try {
          const fetchedProject = await projectService.getProjectById(projectId);
          setProject(fetchedProject);
          setEditedName(fetchedProject.name);
          setEditedDescription(fetchedProject.description);
        } catch (error) {
          toast.error('Failed to fetch project details.');
          console.error('Error fetching project:', error);
        }
      }
    };
    fetchProject();
  }, [projectId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (project && projectId) {
      try {
        const updatedProject = await projectService.updateProject(projectId, {
          name: editedName,
          description: editedDescription,
        });
        toast.success('Project updated successfully!');
        setProject(updatedProject);
        setEditMode(false);
      } catch (error) {
        toast.error('Failed to update project.');
        console.error('Error updating project:', error);
      }
    }
  };

  if (!project) {
    return <div className="project-settings-container">Loading project...</div>;
  }

  return (
    <div className="project-settings-container">
      <h2>Project Settings: {project.name}</h2>

      <div className="project-details">
        {editMode ? (
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label htmlFor="projectName">Project Name:</label>
              <input
                type="text"
                id="projectName"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="projectDescription">Description:</label>
              <textarea
                id="projectDescription"
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
              ></textarea>
            </div>
            <div className="settings-actions">
              <button type="submit" className="primary-button">Save</button>
              <button type="button" onClick={() => setEditMode(false)} className="secondary-button">Cancel</button>
            </div>
          </form>
        ) : (
          <>
            <p><strong>Name:</strong> {project.name}</p>
            <p><strong>Description:</strong> {project.description || 'No description provided.'}</p>
            <button onClick={() => setEditMode(true)} className="primary-button">Edit Project</button>
          </>
        )}
      </div>

      <h3>Project Members</h3>
      <ul className="member-list">
        {project.members.map((member) => (
          <li key={member.id}>
            {member.username}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectSettingsPage;
