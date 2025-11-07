import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { forgotPassword } from '../services/authService';
import toast from 'react-hot-toast';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword({ email });
      toast.success('If an account with that email exists, a reset link has been sent.');
    } catch (error) {
      toast.error('An error occurred. Please try again.');
      console.error('Forgot password failed', error);
    }
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h4" component="h1" gutterBottom>
        Forgot Password
      </Typography>
      <Typography variant="body1" color="textSecondary">
        Enter your email address and we will send you a link to reset your password.
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Box mt={2}>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Send Reset Link
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default ForgotPasswordPage;
