import React from 'react';
import { useBadges } from '../../hooks/useBadges';
import { List, ListItem, ListItemText, Typography } from '@mui/material';

const ProfilePage: React.FC = () => {
    const badges = useBadges();

    return (
        <div>
            <Typography variant="h4">My Badges</Typography>
            <List>
                {badges.map((badge) => (
                    <ListItem key={badge.id}>
                        <ListItemText primary={badge.name} secondary={badge.description} />
                    </ListItem>
                ))}
            </List>
        </div>
    );
};

export default ProfilePage;
