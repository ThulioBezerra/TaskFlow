// src/pages/ForgotPasswordPage.tsx
import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  GlobalStyles,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { forgotPassword } from '../services/authService';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await forgotPassword({ email });
      toast.success(
        'If an account with that email exists, a reset link has been sent.'
      );
    } catch (error) {
      toast.error('An error occurred. Please try again.');
      console.error('Forgot password failed', error);
    }
  };

  return (
    <>
      {/* BG global igual ao do login */}
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

      {/* Wrapper centralizado absoluto (independe do layout pai) */}
      <Box
        component="main"
        sx={{
          position: 'fixed',
          inset: 0,
          display: 'grid',
          placeItems: 'center',
          p: 2,
          width: '100vw',
          height: '100dvh',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth={false} disableGutters sx={{ display: 'flex', justifyContent: 'center' }}>
          <Paper
            elevation={8}
            sx={{
              p: { xs: 3, sm: 4 },
              borderRadius: 3,
              width: '100%',
              maxWidth: 520,
              color: '#e9eef7',
              backdropFilter: 'blur(6px)',
              background:
                'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.03) 100%)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <Typography
              variant="h4"
              fontWeight={800}
              sx={{ textAlign: 'center', mb: 0.5, letterSpacing: 0.5 }}
            >
              Esqueceu sua senha?
            </Typography>

            <Typography
              variant="body2"
              sx={{ textAlign: 'center', opacity: 0.85, mb: 3 }}
            >
              Insira seu e-mail e enviaremos um link para redefinir sua senha.
            </Typography>

            <Box component="form" onSubmit={handleSubmit} noValidate>
              {/* Label visível e acima do campo */}
              <Typography variant="caption" sx={{ mb: 0.5, display: 'block', opacity: 0.9 }}>
                Email
              </Typography>
              <TextField
                fullWidth
                placeholder="seu.email@exemplo.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                variant="outlined"
                size="medium"
                required
                sx={{
                  mb: 2.5,
                  input: { color: '#e9eef7' },
                  '& .MuiOutlinedInput-root fieldset': { borderColor: 'rgba(255,255,255,0.15)' },
                  '& .MuiOutlinedInput-root:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                }}
              />

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
                SEND RESET LINK
              </Button>

              {/* Divider sutil */}
              <Box sx={{ my: 2.5, opacity: 0.35, borderTop: '1px solid rgba(255,255,255,0.2)' }} />

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
                  '&:hover': { borderColor: 'rgba(255,255,255,0.6)', background: 'rgba(255,255,255,0.06)' },
                }}
              >
                VOLTAR PARA O LOGIN
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>
    </>
  );
};

export default ForgotPasswordPage;
