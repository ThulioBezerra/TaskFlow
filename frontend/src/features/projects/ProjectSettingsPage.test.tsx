import { render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProjectSettingsPage from './ProjectSettingsPage';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import * as projectService from '../../services/projectService';
import toast from 'react-hot-toast';
import '@testing-library/jest-dom';

vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({
    token: 'test-token',
    user: { id: 'u1', email: 'u1@example.com' },
  }),
}));

vi.mock('../../services/projectService', () => ({
  __esModule: true,
  getProjectById: vi.fn(),
  updateProject: vi.fn(),
  searchUsers: vi.fn(),
  getProjects: vi.fn(),
}));

vi.mock('react-hot-toast', () => ({
  default: { success: vi.fn(), error: vi.fn() },
}));

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

const renderWithRouter = (projectId = '123') =>
  render(
    <MemoryRouter initialEntries={[`/projects/${projectId}/settings`]}>
      <Routes>
        <Route path="/projects/:projectId/settings" element={<ProjectSettingsPage />} />
      </Routes>
    </MemoryRouter>
  );

describe('ProjectSettingsPage', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
    // se seu componente também lê do localStorage, mantenha isso:
    localStorage.setItem('authToken', 'test-token'); // <— CONFIRA O NOME DA CHAVE!
    (projectService.getProjectById as any).mockResolvedValue(mockProject);
    (projectService.updateProject as any).mockResolvedValue({
      ...mockProject,
      name: 'Updated Project Name',
      description: 'Updated description.',
      webhookUrl: '', 
      notificationEvents: []
    });
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('fetches and displays project details', async () => {
    renderWithRouter();

    // garante que o service foi chamado (se não foi, é provider/token)
    await waitFor(() => {
      expect(projectService.getProjectById).toHaveBeenCalledWith('123');
    });

    // título carregado
    const heading = await screen.findByRole('heading', {
      name: /project settings:\s*initial project name/i,
    });
    expect(heading).toBeInTheDocument();

    // “Name: Initial Project Name” pode estar quebrado em <strong> + texto
    expect(
      screen.getByText((_, el) => el?.textContent === 'Name: Initial Project Name')
    ).toBeInTheDocument();
  });

  it('allows editing project details', async () => {
    renderWithRouter();

    // já que agora carrega, o botão aparece
    const editBtn = await screen.findByRole('button', { name: /edit project/i });
    await user.click(editBtn);

    const nameInput = await screen.findByLabelText(/project name:?/i);
    const descTextarea = await screen.findByLabelText(/description:?/i);

    await user.clear(nameInput);
    await user.type(nameInput, 'New Project Name');
    await user.clear(descTextarea);
    await user.type(descTextarea, 'New Project Description');

    await user.click(screen.getByRole('button', { name: /save/i }));

    expect(projectService.updateProject).toHaveBeenCalledWith(
      '123',
      { name: 'New Project Name', description: 'New Project Description', webhookUrl: '', notificationEvents: [] },
    );


    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Project updated successfully!');
    });

    expect(screen.getAllByText(/updated project name/i).length).toBeGreaterThan(0);
  });

  it('shows error toast on failed project update', async () => {
    (projectService.getProjectById as any).mockResolvedValue({
      id: '123',
      name: 'Initial Project Name',
      description: 'Initial project description.',
      members: ['Member One', 'Member Two'],
      webhookUrl: '', 
      notificationEvents: []
    });
    (projectService.updateProject as any).mockRejectedValue(new Error('Update Error'));

    renderWithRouter();

    const editBtn = await screen.findByRole('button', { name: /edit project/i });
    await user.click(editBtn);

    const nameInput = await screen.findByLabelText(/project name:?/i);
    await user.clear(nameInput);
    await user.type(nameInput, 'Failing Update');

    await user.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to update project.');
    });

    expect(screen.getByDisplayValue(/failing update/i)).toBeInTheDocument();
  });

  it('shows error toast on failed project fetch', async () => {
    (projectService.getProjectById as any).mockRejectedValue(new Error('Fetch Error'));

    renderWithRouter();

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to fetch project details.');
    });

    // pode ser “Loading…” ou estado de erro, ajuste ao seu JSX
    expect(screen.getByText(/loading project/i)).toBeInTheDocument();
  });
});