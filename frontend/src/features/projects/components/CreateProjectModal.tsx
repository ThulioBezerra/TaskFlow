import React, { useState } from 'react';
import {
    Button,
    Modal,
    Box,
    Typography,
    TextField,
    CircularProgress,
} from '@mui/material';

interface CreateProjectModalProps {
    open: boolean;
    onClose: () => void;
    onCreate: (name: string, description: string) => Promise<void>;
}

const style = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
    open,
    onClose,
    onCreate,
}) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if (!name) {
            setError('Project name is required');
            return;
        }
        setLoading(true);
        setError('');
        try {
            await onCreate(name, description);
            onClose();
        } catch (_err: unknown) { // eslint-disable-line @typescript-eslint/no-unused-vars
            setError('Failed to create project');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="create-project-modal-title"
        >
            <Box sx={style}>
                <Typography id="create-project-modal-title" variant="h6" component="h2">
                    Create New Project
                </Typography>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Project Name"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    error={!!error}
                    helperText={error}
                />
                <TextField
                    margin="dense"
                    label="Description"
                    type="text"
                    fullWidth
                    multiline
                    rows={4}
                    variant="standard"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button onClick={onClose} sx={{ mr: 1 }}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained" disabled={loading}>
                        {loading ? <CircularProgress size={24} /> : 'Create'}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};
