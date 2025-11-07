import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/authService';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Paper,
} from '@mui/material';

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register({ email, password });
      navigate('/login');
    } catch (error) {
      console.error('Signup failed', error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // se já tiver bg global, pode tirar esse gradient
        background: 'radial-gradient(circle at top, #2d3748 0, #111827 55%)',
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 3,
            bgcolor: '#1f2933', // card mais claro que o fundo
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            align="center"
            gutterBottom
            sx={{
              fontWeight: 600,
              color: '#e5e7eb',
              mb: 3,
            }}
          >
            Sign Up
          </Typography>

          <Typography
            variant="body2"
            align="center"
            sx={{ color: '#9ca3af', mb: 3 }}
          >
            Crie sua conta para começar a organizar suas tarefas ✨
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="outlined"
              InputLabelProps={{
                sx: {
                  color: '#9ca3af',
                  '&.Mui-focused': {
                    color: '#60a5fa',
                  },
                },
              }}
              InputProps={{
                sx: {
                  color: '#e5e7eb',
                  bgcolor: '#111827',
                  borderRadius: 2,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#4b5563',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#9ca3af',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#60a5fa',
                  },
                },
              }}
            />

            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              variant="outlined"
              InputLabelProps={{
                sx: {
                  color: '#9ca3af',
                  '&.Mui-focused': {
                    color: '#60a5fa',
                  },
                },
              }}
              InputProps={{
                sx: {
                  color: '#e5e7eb',
                  bgcolor: '#111827',
                  borderRadius: 2,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#4b5563',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#9ca3af',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#60a5fa',
                  },
                },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 3,
                py: 1.2,
                fontWeight: 600,
                borderRadius: 2,
                bgcolor: '#2563eb',
                '&:hover': {
                  bgcolor: '#1d4ed8',
                },
              }}
            >
              Sign Up
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default SignupPage;
