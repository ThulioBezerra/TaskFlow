import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProjectSettingsPage from './ProjectSettingsPage';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import projectService from '../../services/projectService';
import toast from 'react-hot-toast';

// Mock projectService and toast
jest.mock('../../services/projectService');
jest.mock('react-hot-toast');

const mockProject = {
  id: '123',
  name: 'Initial Project Name',
  description: 'Initial project description.',
  manager: { id: 'mgr1', username: 'Manager User', email: 'mgr@example.com' },
  members: [
    { id: 'mem1', username: 'Member One', email: 'mem1@example.com' },
    { id: 'mem2', username: 'Member Two', email: 'mem2@example.com' },
  ],
};

describe('ProjectSettingsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (projectService.getProjectById as jest.Mock).mockResolvedValue(mockProject);
    (projectService.updateProject as jest.Mock).mockResolvedValue({
      ...mockProject, // Return updated project details but keep original members since member update not implemented yet
      name: 'Updated Project Name',
      description: 'Updated description.',
    });
  });

  const renderWithRouter = (projectId: string = '123') => {
    return render(
      <MemoryRouter initialEntries={[`/projects/${projectId}/settings`]}>
        <Routes>
          <Route path="/projects/:projectId/settings" element={<ProjectSettingsPage />} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('renders loading state initially', () => {
    (projectService.getProjectById as jest.Mock).mockReturnValue(new Promise(() => {})); // Never resolve
    renderWithRouter();
    expect(screen.getByText(/Loading project.../i)).toBeInTheDocument();
  });

  it('fetches and displays project details', async () => {
    renderWithRouter();

    await waitFor(() => {
      expect(projectService.getProjectById).toHaveBeenCalledWith('123');
      expect(screen.getByText(`Project Settings: ${mockProject.name}`)).toBeInTheDocument();
      expect(screen.getByText(`Name: ${mockProject.name}`)).toBeInTheDocument();
      expect(screen.getByText(`Description: ${mockProject.description}`)).toBeInTheDocument();
      expect(screen.getByText('Member One')).toBeInTheDocument();
    });
  });

  it('allows editing project details', async () => {
    renderWithRouter();

    await waitFor(() => expect(screen.getByText(/Edit Project/i)).toBeInTheDocument());
    fireEvent.click(screen.getByText(/Edit Project/i));

    const nameInput = screen.getByLabelText(/Project Name:/i);
    const descTextarea = screen.getByLabelText(/Description:/i);

    expect(nameInput).toHaveValue(mockProject.name);
    expect(descTextarea).toHaveValue(mockProject.description);

    fireEvent.change(nameInput, { target: { value: 'New Project Name' } });
    fireEvent.change(descTextarea, { target: { value: 'New Project Description' } });

    fireEvent.click(screen.getByRole('button', { name: /Save/i }));

    expect(projectService.updateProject).toHaveBeenCalledWith('123', {
      name: 'New Project Name',
      description: 'New Project Description',
    });

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Project updated successfully!');
      expect(screen.getByText(`Name: Updated Project Name`)).toBeInTheDocument();
    });
  });

  it('shows error toast on failed project fetch', async () => {
    (projectService.getProjectById as jest.Mock).mockRejectedValue(new Error('Fetch Error'));
    renderWithRouter();

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to fetch project details.');
      expect(screen.getByText(/Loading project.../i)).toBeInTheDocument(); // Still showing loading if fetch fails
    });
  });

  it('shows error toast on failed project update', async () => {
    (projectService.updateProject as jest.Mock).mockRejectedValue(new Error('Update Error'));
    renderWithRouter();

    await waitFor(() => expect(screen.getByText(/Edit Project/i)).toBeInTheDocument());

    fireEvent.click(screen.getByText(/Edit Project/i));
    fireEvent.change(screen.getByLabelText(/Project Name:/i), { target: { value: 'Failing Update' } });
    fireEvent.click(screen.getByRole('button', { name: /Save/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to update project.');
      expect(screen.getByText(/Failing Update/i)).toBeInTheDocument(); // Still in edit mode
    });
  });
});
