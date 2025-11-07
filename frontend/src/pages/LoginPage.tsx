// src/pages/LoginPage.tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Button,
  Checkbox,
  Container,
  GlobalStyles,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import useAuthStore from '../store/authStore';
import { login } from '../services/authService';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login: loginUser } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await login({ email, password }); // token vai para cookie
      loginUser(); // marca isAuthenticated = true
      navigate('/');

    } catch (err) {
      console.error('Login failed', err);
    }
  };

  return (
    <>
      {/* 1) BG no body, cobrindo a tela toda */}
      <GlobalStyles
        styles={{
          'html, body, #root': { height: '100%', margin: 0, padding: 0 },
          body: {
            backgroundColor: '#0b1220',
            backgroundImage: `
              radial-gradient(1200px 600px at 50% -20%, rgba(46,91,255,0.22) 0%, rgba(46,91,255,0) 60%),
              radial-gradient(900px 500px at 50% 110%, rgba(20,220,160,0.18) 0%, rgba(20,220,160,0) 60%),
              linear-gradient(180deg, #0b1220 0%, #081019 60%, #07150f 100%)
            `,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            overflowX: 'hidden'
          }
        }}
      />

      {/* 2) Wrapper centralizado – nada de position maluco */}
      <Box
          component="main"
          sx={{
            position: 'fixed',
            inset: 0,                 // top/right/bottom/left: 0
            display: 'grid',
            placeItems: 'center',     // centraliza X e Y
            p: 2,
            width: '100vw',
            height: '100dvh',         // considera barra de endereço mobile
            overflow: 'hidden',
            zIndex: 0,
          }}
        >
          <Paper
            elevation={8}
            sx={{
              p: { xs: 3, sm: 4 },
              borderRadius: 3,
              width: '100%',
              maxWidth: 520,
              color: '#e9eef7',
              backdropFilter: 'blur(6px)',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.03) 100%)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <Typography
              variant="h4"
              fontWeight={800}
              sx={{ textAlign: 'center', mb: 0.5, letterSpacing: 0.5 }}
            >
              Task Flow
            </Typography>
            <Typography
              variant='h5'
            >
              Entrar
            </Typography>
            <Typography
              variant="body2"
              sx={{ textAlign: 'center', opacity: 0.8, mb: 3 }}
            >
              Bem-vindo de volta! Acesse sua conta para continuar.
            </Typography>

            <Box component="form" onSubmit={handleSubmit} noValidate>
              {/* Label visível e acima */}
              <Typography variant="caption" sx={{ mb: 0.5, display: 'block', opacity: 0.9 }}>
                Email
              </Typography>
              <TextField
                fullWidth
                placeholder="seu.email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                variant="outlined"
                size="medium"
                sx={{
                  mb: 2.5,
                  input: { color: '#e9eef7' },
                  '& .MuiOutlinedInput-root fieldset': { borderColor: 'rgba(255,255,255,0.15)' },
                  '& .MuiOutlinedInput-root:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                }}
              />

              <Typography variant="caption" sx={{ mb: 0.5, display: 'block', opacity: 0.9 }}>
                Password
              </Typography>
              <TextField
                fullWidth
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                variant="outlined"
                size="medium"
                sx={{
                  mb: 1.5,
                  input: { color: '#e9eef7' },
                  '& .MuiOutlinedInput-root fieldset': { borderColor: 'rgba(255,255,255,0.15)' },
                  '& .MuiOutlinedInput-root:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPw((v) => !v)}
                        edge="end"
                        aria-label={showPw ? 'Hide password' : 'Show password'}
                        sx={{ color: 'rgba(255,255,255,0.7)' }}
                      >
                        {showPw ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 2.5,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Checkbox
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    sx={{ color: 'rgba(255,255,255,0.7)' }}
                  />
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Remember me
                  </Typography>
                </Box>

                <Link to="/forgot-password" style={{ textDecoration: 'none' }}>
                  <Typography variant="body2" sx={{ color: '#73d6ff' }}>
                    Forgot Password?
                  </Typography>
                </Link>
              </Box>

              <Button
                type="submit"
                fullWidth
                size="large"
                sx={{
                  py: 1.2,
                  fontWeight: 700,
                  letterSpacing: 1,
                  borderRadius: 2,
                  background:
                    'linear-gradient(90deg, rgba(46,91,255,0.95) 0%, rgba(20,220,160,0.95) 100%)',
                  color: '#0b1220',
                  '&:hover': {
                    filter: 'brightness(1.05)',
                    transform: 'translateY(-1px)',
                  },
                  transition: 'all .15s ease',
                }}
              >
                LOGIN
              </Button>

              <Box sx={{ textAlign: 'center', mt: 2.5, mb: 1, opacity: 0.8 }}>
                <Typography variant="body2">Não tem uma conta?</Typography>
              </Box>

              <Button
                component={Link}
                to="/signup"
                fullWidth
                size="large"
                variant="outlined"
                sx={{
                  py: 1.1,
                  borderRadius: 2,
                  color: '#e9eef7',
                  borderColor: 'rgba(255,255,255,0.35)',
                  '&:hover': { borderColor: 'rgba(255,255,255,0.6)', background: 'rgba(255,255,255,0.06)' },
                }}
              >
                CRIAR CONTA
              </Button>
            </Box>
          </Paper>
      </Box>
    </>
  );
};

export default LoginPage;
