import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import toast from 'react-hot-toast';
import { resetPassword } from '../services/authService';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validatePassword = (pass) => {
    if (pass.length < 8) {
      return 'Password must be at least 8 characters long.';
    }
    if (!/(?=.*[a-z])/.test(pass)) {
      return 'Password must contain at least one lowercase letter.';
    }
    if (!/(?=.*[A-Z])/.test(pass)) {
      return 'Password must contain at least one uppercase letter.';
    }
    if (!/(?=.*\d)/.test(pass)) {
      return 'Password must contain at least one number.';
    }
    if (!/(?=.*[!@#$%^&*])/.test(pass)) {
      return 'Password must contain at least one special character (!@#$%^&*).';
    }
    return '';
  };

  useEffect(() => {
    if (password) {
      setPasswordError(validatePassword(password));
    } else {
      setPasswordError('');
    }
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validatePassword(password);
    if (validationError) {
      setPasswordError(validationError);
      toast.error(validationError);
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    try {
      await resetPassword({ token, newPassword: password });
      toast.success('Password has been reset successfully.');
      navigate('/login');
    } catch (error) {
      toast.error('Failed to reset password. The link may be invalid or expired.');
      console.error('Reset password failed', error);
    }
  };

  const isSubmitDisabled = !!passwordError || password !== confirmPassword || !password;

  return (
    <Container maxWidth="xs">
      <Typography variant="h4" component="h1" gutterBottom>
        Reset Password
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="New Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          error={!!passwordError}
          helperText={passwordError || "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."}
        />
        <TextField
          label="Confirm New Password"
          type="password"
          fullWidth
          margin="normal"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          error={confirmPassword ? password !== confirmPassword : false}
          helperText={confirmPassword && password !== confirmPassword ? "Passwords do not match." : ""}
        />
        <Box mt={2}>
          <Button type="submit" variant="contained" color="primary" fullWidth disabled={isSubmitDisabled}>
            Reset Password
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default ResetPasswordPage;
