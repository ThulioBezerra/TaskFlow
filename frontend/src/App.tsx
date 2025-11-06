import './App.css';
import KanbanBoard from './components/KanbanBoard';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import ProfilePage from './features/profile/ProfilePage';
import CreateProjectModal from './components/CreateProjectModal'; // Import the new modal component
import ProjectSettingsPage from './features/projects/ProjectSettingsPage'; // Import the new project settings page

const queryClient = new QueryClient();

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateProject = () => {
    // This function can be used to refresh a list of projects if needed
    // For now, it just closes the modal, as creation is handled internally.
    setIsModalOpen(false); 
  };
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div>
          <Toaster />
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/profile">Profile</Link>
              </li>
              <li>
                <button onClick={() => setIsModalOpen(true)} className="create-project-button">
                  Create Project
                </button>
              </li>
            </ul>
          </nav>

          <hr />

          <CreateProjectModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onCreateProject={handleCreateProject}
          />

          <Routes>
            <Route path="/" element={<KanbanBoard />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/projects/:projectId/settings" element={<ProjectSettingsPage />} />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  )
}

export default App
