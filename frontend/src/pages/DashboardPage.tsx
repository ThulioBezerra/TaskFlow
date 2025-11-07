import React from 'react';
import { Container, Typography, Button } from '@mui/material';
import useAuthStore from '../store/authStore';

const DashboardPage = () => {
  const { logout } = useAuthStore();

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      <Button variant="contained" color="secondary" onClick={logout}>
        Logout
      </Button>
    </Container>
  );
};

export default DashboardPage;
