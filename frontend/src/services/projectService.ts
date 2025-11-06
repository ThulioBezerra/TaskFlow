import axios from 'axios';

const API_URL = '/api/projects';

interface Project {
  id: string;
  name: string;
  description: string;
  manager: { id: string; username: string; email: string };
  members: { id: string; username: string; email: string }[];
}

interface CreateProjectPayload {
  name: string;
  description: string;
  managerId: string; // Assuming managerId is a string on frontend for now
  memberIds: string[];
}

interface UpdateProjectPayload {
  name: string;
  description: string;
}

const projectService = {
  createProject: async (projectData: CreateProjectPayload): Promise<Project> => {
    const response = await axios.post<Project>(API_URL, projectData);
    return response.data;
  },

  getProjectById: async (id: string): Promise<Project> => {
    const response = await axios.get<Project>(`${API_URL}/${id}`);
    return response.data;
  },

  getAllProjects: async (): Promise<Project[]> => {
    const response = await axios.get<Project[]>(API_URL);
    return response.data;
  },

  updateProject: async (id: string, projectData: UpdateProjectPayload): Promise<Project> => {
    const response = await axios.put<Project>(`${API_URL}/${id}`, projectData);
    return response.data;
  },

  // Mock user search for now, will integrate with a real user service later
  searchUsers: async (searchTerm: string): Promise<{ id: string; name: string }[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUsers = [
          { id: '1', name: 'Alice Smith' },
          { id: '2', name: 'Bob Johnson' },
          { id: '3', name: 'Charlie Brown' },
          { id: '4', name: 'Diana Prince' },
        ];
        resolve(mockUsers.filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase())));
      }, 300);
    });
  },
};

export default projectService;
