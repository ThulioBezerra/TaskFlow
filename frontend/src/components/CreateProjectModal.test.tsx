import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CreateProjectModal from './CreateProjectModal';
import projectService from '../services/projectService';
import '@testing-library/jest-dom';
import toast from 'react-hot-toast';

// Mock the projectService and toast
vi.mock('../services/projectService');
vi.mock('react-hot-toast');

describe('CreateProjectModal', () => {
  const mockOnClose = vi.fn();
  const mockOnCreateProject = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock searchUsers to return some users
    (projectService.searchUsers as any).mockResolvedValue([
      { id: '1', name: 'Alice Smith' },
      { id: '2', name: 'Bob Johnson' },
    ]);
    // Mock createProject to succeed
    (projectService.createProject as any).mockResolvedValue({});
  });

  it('does not render when isOpen is false', () => {
    render(
      <CreateProjectModal
        isOpen={false}
        onClose={mockOnClose}
        onCreateProject={mockOnCreateProject}
      />
    );
    expect(screen.queryByText('Create New Project')).not.toBeInTheDocument();
  });

  it('renders when isOpen is true', () => {
    render(
      <CreateProjectModal
        isOpen={true}
        onClose={mockOnClose}
        onCreateProject={mockOnCreateProject}
      />
    );
    expect(screen.getByText('Create New Project')).toBeInTheDocument();
  });

  it('allows entering project name and description', () => {
    render(
      <CreateProjectModal
        isOpen={true}
        onClose={mockOnClose}
        onCreateProject={mockOnCreateProject}
      />
    );
    fireEvent.change(screen.getByLabelText(/Project Name:/i), { target: { value: 'Test Project' } });
    fireEvent.change(screen.getByLabelText(/Description \(Optional\):/i), { target: { value: 'Project Description' } });

    expect(screen.getByLabelText(/Project Name:/i)).toHaveValue('Test Project');
    expect(screen.getByLabelText(/Description \(Optional\):/i)).toHaveValue('Project Description');
  });

  it('allows searching and adding collaborators', async () => {
    render(
      <CreateProjectModal
        isOpen={true}
        onClose={mockOnClose}
        onCreateProject={mockOnCreateProject}
      />
    );

    fireEvent.change(screen.getByPlaceholderText(/Search users.../i), { target: { value: 'alice' } });
    expect(projectService.searchUsers).toHaveBeenCalledWith('alice');

    // Wait for search results to appear
    const aliceUser = await screen.findByText('Alice Smith');
    fireEvent.click(aliceUser);

    expect(screen.getByText('Alice Smith')).toBeInTheDocument(); // As a selected tag
    expect(screen.queryByText('Alice Smith', { selector: 'li' })).not.toBeInTheDocument(); // Not in search results
  });

  it('allows removing selected collaborators', async () => {
    render(
      <CreateProjectModal
        isOpen={true}
        onClose={mockOnClose}
        onCreateProject={mockOnCreateProject}
      />
    );

    fireEvent.change(screen.getByPlaceholderText(/Search users.../i), { target: { value: 'alice' } });
    const aliceUser = await screen.findByText('Alice Smith');
    fireEvent.click(aliceUser);

    const removeButton = screen.getByRole('button', { name: 'x' });
    fireEvent.click(removeButton);

    expect(screen.queryByText('Alice Smith')).not.toBeInTheDocument(); // Removed from selected tags
  });

  it('calls onCreateProject and closes modal on successful project creation', async () => {
    render(
      <CreateProjectModal
        isOpen={true}
        onClose={mockOnClose}
        onCreateProject={mockOnCreateProject}
      />
    );

    fireEvent.change(screen.getByLabelText(/Project Name:/i), { target: { value: 'New Project' } });
    fireEvent.click(screen.getByRole('button', { name: /Create Project/i }));

    expect(projectService.createProject).toHaveBeenCalledWith({
      name: 'New Project',
      description: '',
      managerId: '1',
      memberIds: [],
    });
    await waitFor(() =>
      expect(toast.success).toHaveBeenCalledWith('Project created successfully!')
    );
    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(mockOnCreateProject).toHaveBeenCalledTimes(1);
  });

  it('shows error toast on failed project creation', async () => {
    (projectService.createProject as any).mockRejectedValue(new Error('API Error'));

    render(
      <CreateProjectModal
        isOpen={true}
        onClose={mockOnClose}
        onCreateProject={mockOnCreateProject}
      />
    );

    fireEvent.change(screen.getByLabelText(/Project Name:/i), { target: { value: 'Failing Project' } });
    fireEvent.click(screen.getByRole('button', { name: /Create Project/i }));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith('Failed to create project.')
    );
    expect(mockOnClose).not.toHaveBeenCalled();
    expect(mockOnCreateProject).not.toHaveBeenCalled();

  });
});
