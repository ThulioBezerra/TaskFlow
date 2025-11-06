import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProjectSettingsPage from './ProjectSettingsPage';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import projectService from '../../services/projectService';
import toast from 'react-hot-toast';
import '@testing-library/jest-dom';

// Mock projectService and toast
vi.mock('../../services/projectService');
vi.mock('react-hot-toast');

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
    vi.clearAllMocks();
    (projectService.getProjectById as any).mockResolvedValue(mockProject);
    (projectService.updateProject as any).mockResolvedValue({
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
    (projectService.getProjectById as any).mockReturnValue(new Promise(() => {})); // Never resolve
    renderWithRouter();
    expect(screen.getByText(/Loading project.../i)).toBeInTheDocument();
  });

  it('fetches and displays project details', async () => {
    renderWithRouter();

    await waitFor(() => {
      expect(projectService.getProjectById).toHaveBeenCalledWith('123');
      expect(
        screen.getByText((content, element) => 
          element?.textContent === 'Name: Initial Project Name'
        )
      ).toBeInTheDocument();
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
      expect(screen.getAllByText(/Updated Project Name/i).length).toBeGreaterThan(0);
    });

  });

  it('shows error toast on failed project fetch', async () => {
    (projectService.getProjectById as any).mockRejectedValue(new Error('Fetch Error'));
    renderWithRouter();

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to fetch project details.');
      expect(screen.getByText(/Loading project.../i)).toBeInTheDocument(); // Still showing loading if fetch fails
    });
  });

  it('shows error toast on failed project update', async () => {
    (projectService.updateProject as any).mockRejectedValue(new Error('Update Error'));
    renderWithRouter();

    await waitFor(() => expect(screen.getByText(/Edit Project/i)).toBeInTheDocument());

    fireEvent.click(screen.getByText(/Edit Project/i));
    fireEvent.change(screen.getByLabelText(/Project Name:/i), { target: { value: 'Failing Update' } });
    fireEvent.click(screen.getByRole('button', { name: /Save/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to update project.');
      expect(screen.getByDisplayValue(/Failing Update/i)).toBeInTheDocument(); // Still in edit mode

    });
  });
});
