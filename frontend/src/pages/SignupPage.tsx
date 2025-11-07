// src/pages/SignupPage.tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  GlobalStyles,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { register } from '../services/authService';

const SignupPage: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let hasError = false;

    if (!email.trim()) {
      setEmailError('Informe seu e-mail');
      hasError = true;
    } else {
      setEmailError(null);
    }

    if (!password) {
      setPasswordError('Informe sua senha');
      hasError = true;
    } else if (password.length < 6) {
      setPasswordError('A senha deve ter pelo menos 6 caracteres');
      hasError = true;
    } else {
      setPasswordError(null);
    }

    if (hasError) return;

    try {
      setSubmitting(true);
      await register({ email, password, role:'COLLABORATOR'});
      navigate('/login');
    } catch (err) {
      console.error('Signup failed', err);
      setPasswordError('Não foi possível criar a conta. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Mesmo BG ocupando a tela inteira */}
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
            overflowX: 'hidden',
          },
        }}
      />

      {/* Card centralizado, igual Login */}
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
            {/* Título do app */}
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
              Cadastre se!
            </Typography>
            <Typography
              variant="body2"
              sx={{ textAlign: 'center', opacity: 0.8, mb: 3 }}
            >
              Crie sua conta para começar a organizar suas tarefas ✨
            </Typography>

            <Box component="form" onSubmit={handleSubmit} noValidate>
              {/* Email */}
              <Typography
                variant="caption"
                sx={{ mb: 0.5, display: 'block', opacity: 0.9 }}
              >
                Email
              </Typography>
              <TextField
                fullWidth
                placeholder="seu.email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                variant="outlined"
                size="medium"
                error={!!emailError}
                helperText={emailError || ' '}
                sx={{
                  mb: 2.5,
                  input: { color: '#e9eef7' },
                  '& .MuiOutlinedInput-root fieldset': {
                    borderColor: 'rgba(255,255,255,0.15)',
                  },
                  '& .MuiOutlinedInput-root:hover fieldset': {
                    borderColor: 'rgba(255,255,255,0.3)',
                  },
                }}
              />

              {/* Password */}
              <Typography
                variant="caption"
                sx={{ mb: 0.5, display: 'block', opacity: 0.9 }}
              >
                Password
              </Typography>
              <TextField
                fullWidth
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                variant="outlined"
                size="medium"
                error={!!passwordError}
                helperText={passwordError || ' '}
                sx={{
                  mb: 2,
                  input: { color: '#e9eef7' },
                  '& .MuiOutlinedInput-root fieldset': {
                    borderColor: 'rgba(255,255,255,0.15)',
                  },
                  '& .MuiOutlinedInput-root:hover fieldset': {
                    borderColor: 'rgba(255,255,255,0.3)',
                  },
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

              {/* Botão principal */}
              <Button
                type="submit"
                fullWidth
                size="large"
                disabled={submitting}
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
                {submitting ? 'CRIANDO CONTA...' : 'CRIAR CONTA'}
              </Button>

              {/* Link para login */}
              <Box sx={{ textAlign: 'center', mt: 2.5, mb: 1, opacity: 0.8 }}>
                <Typography variant="body2">
                  Já tem uma conta?
                </Typography>
              </Box>

              <Button
                component={Link}
                to="/login"
                fullWidth
                size="large"
                variant="outlined"
                sx={{
                  py: 1.1,
                  borderRadius: 2,
                  color: '#e9eef7',
                  borderColor: 'rgba(255,255,255,0.35)',
                  '&:hover': {
                    borderColor: 'rgba(255,255,255,0.6)',
                    background: 'rgba(255,255,255,0.06)',
                  },
                }}
              >
                FAZER LOGIN
              </Button>
            </Box>
          </Paper>
      </Box>
    </>
  );
};

export default SignupPage;
