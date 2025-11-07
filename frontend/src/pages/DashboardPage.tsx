// src/pages/DashboardPage.tsx
import React, { useState } from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import useAuthStore from '../store/authStore';
import KanbanBoard from '../components/KanbanBoard';
import CreateProjectModal from '../components/CreateProjectModal';
import CreateTaskModal from '../components/CreateTaskModal';

const DashboardPage: React.FC = () => {
  const { logout } = useAuthStore();

  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [projectsVersion, setProjectsVersion] = useState(0);

  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [tasksVersion, setTasksVersion] = useState(0);

  const token = localStorage.getItem('token') ?? '';

  // PROJECT MODAL
  const handleOpenProjectModal = () => setIsCreateProjectOpen(true);
  const handleCloseProjectModal = () => setIsCreateProjectOpen(false);

  const handleProjectCreated = () => {
    setIsCreateProjectOpen(false);
    setProjectsVersion((prev) => prev + 1);
  };

  // TASK MODAL
  const handleOpenTaskModal = () => setIsCreateTaskOpen(true);
  const handleCloseTaskModal = () => setIsCreateTaskOpen(false);

  const handleTaskCreated = () => {
    setIsCreateTaskOpen(false);
    setTasksVersion((prev) => prev + 1);
  };

  return (
    <Container sx={{ py: 4 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1">
          Dashboard
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenProjectModal}
          >
            Criar novo projeto
          </Button>

          <Button
            variant="outlined"
            color="primary"
            onClick={handleOpenTaskModal}
          >
            Criar nova task
          </Button>

          <Button
            variant="outlined"
            color="secondary"
            onClick={logout}
          >
            Logout
          </Button>
        </Box>
      </Box>

      {/* Kanban recebe os "gatilhos" de reload */}
      <KanbanBoard
        projectsVersion={projectsVersion}
        tasksVersion={tasksVersion}
      />

      {/* Modal de Projeto */}
      <CreateProjectModal
        isOpen={isCreateProjectOpen}
        onClose={handleCloseProjectModal}
        onCreateProject={handleProjectCreated}
      />

      {/* Modal de Task */}
      {isCreateTaskOpen && (
        <CreateTaskModal
          onClose={handleCloseTaskModal}
          token={token}
          onTaskCreated={handleTaskCreated}
        />
      )}
    </Container>
  );
};

export default DashboardPage;
