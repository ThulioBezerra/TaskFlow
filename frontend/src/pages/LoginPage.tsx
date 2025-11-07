// src/pages/LoginPage.tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Button,
  Checkbox,
  Container,
  IconButton,
  InputAdornment,
  Paper,
  Typography,
  TextField,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import useAuthStore from '../store/authStore';
import { login } from '../services/authService';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(true);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const { login: loginUser } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // validação simples
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
    } else {
      setPasswordError(null);
    }
    if (hasError) return;

    try {
      setSubmitting(true);
      const response = await login({ email, password }); // { data: { token } } ou { token }
      const token = (response as any).data?.token ?? (response as any).token;
      loginUser(token);
      if (remember) localStorage.setItem('token', token);
      navigate('/');
    } catch (err) {
      setPasswordError('Credenciais inválidas');
      console.error('Login failed', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        bgcolor: 'linear-gradient(180deg, #0b1220 0%, #081019 60%, #07150f 100%)',
        background:
          'radial-gradient(1200px 600px at 50% -20%, rgba(46,91,255,.22) 0%, rgba(46,91,255,0) 60%), radial-gradient(900px 500px at 50% 110%, rgba(20,220,160,.18) 0%, rgba(20,220,160,0) 60%), linear-gradient(180deg, #0b1220 0%, #081019 60%, #07150f 100%)',
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={8}
          sx={{
            mx: 'auto',
            p: { xs: 3, sm: 4 },
            borderRadius: 3,
            width: '100%',
            maxWidth: 520,
            backdropFilter: 'blur(6px)',
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.03) 100%)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <Typography
            variant="h3"
            align="center"
            sx={{ color: '#E6E9EF', fontWeight: 800, mb: 0.5, letterSpacing: 0.5 }}
          >
            Login
          </Typography>
          <Typography
            variant="body2"
            align="center"
            sx={{ color: 'rgba(230,233,239,.75)', mb: 3 }}
          >
            Bem-vindo de volta! Acesse sua conta para continuar.
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate>
            {/* Label fixa + campo – mais visível e acima do input */}
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  color: '#C8D3F5',
                  fontWeight: 700,
                  letterSpacing: 0.4,
                  mb: 0.75,
                }}
              >
                Email
              </Typography>
              <TextField
                placeholder="voce@exemplo.com"
                type="email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!emailError}
                helperText={emailError || ' '}
                size="medium"
                variant="outlined"
                InputProps={{
                  sx: {
                    color: '#E6E9EF',
                    bgcolor: 'rgba(255,255,255,0.04)',
                    '& input::placeholder': { color: 'rgba(230,233,239,.55)' },
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.18)' },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.32)' },
                    '&.Mui-focused fieldset': { borderColor: '#6EA8FF' },
                  },
                }}
              />
            </Box>

            <Box sx={{ mb: 1.5 }}>
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  color: '#C8D3F5',
                  fontWeight: 700,
                  letterSpacing: 0.4,
                  mb: 0.75,
                }}
              >
                Password
              </Typography>
              <TextField
                placeholder="••••••••"
                type={showPwd ? 'text' : 'password'}
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={!!passwordError}
                helperText={passwordError || ' '}
                size="medium"
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="mostrar senha"
                        onClick={() => setShowPwd((s) => !s)}
                        edge="end"
                        sx={{ color: 'rgba(230,233,239,.8)' }}
                      >
                        {showPwd ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: {
                    color: '#E6E9EF',
                    bgcolor: 'rgba(255,255,255,0.04)',
                    '& input::placeholder': { color: 'rgba(230,233,239,.55)' },
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.18)' },
                    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.32)' },
                    '&.Mui-focused fieldset': { borderColor: '#6EA8FF' },
                  },
                }}
              />
            </Box>

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
                  size="small"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  sx={{ color: 'rgba(230,233,239,.7)' }}
                />
                <Typography variant="body2" sx={{ color: 'rgba(230,233,239,.9)' }}>
                  Remember me
                </Typography>
              </Box>
              <Link to="/forgot-password" style={{ textDecoration: 'none' }}>
                <Typography
                  variant="body2"
                  sx={{ color: '#7FB3FF', '&:hover': { textDecoration: 'underline' } }}
                >
                  Forgot Password?
                </Typography>
              </Link>
            </Box>

            <Button
              type="submit"
              fullWidth
              disabled={submitting}
              sx={{
                py: 1.25,
                borderRadius: 2,
                fontWeight: 800,
                letterSpacing: 1,
                color: '#0B1220',
                background:
                  'linear-gradient(90deg, #3D7EFF 0%, #22D3A6 100%)',
                boxShadow: '0 8px 24px rgba(34,211,166,.25)',
                '&:hover': {
                  background:
                    'linear-gradient(90deg, #4B89FF 0%, #2BE6B6 100%)',
                },
              }}
            >
              {submitting ? 'Entrando...' : 'LOGIN'}
            </Button>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: 'rgba(230,233,239,.75)' }}>
                Não tem uma conta?
              </Typography>
              <Button
                component={Link}
                to="/signup"
                fullWidth
                variant="outlined"
                sx={{
                  mt: 1,
                  py: 1.1,
                  borderRadius: 2,
                  borderColor: 'rgba(255,255,255,0.25)',
                  color: '#E6E9EF',
                  '&:hover': { borderColor: '#6EA8FF', bgcolor: 'rgba(110,168,255,.08)' },
                }}
              >
                CRIAR CONTA
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;
