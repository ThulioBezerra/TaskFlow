import { useState, useEffect } from 'react';
import { getMyBadges } from '../services/api';
import { Badge } from '../types';
import toast from 'react-hot-toast';

export const useBadges = () => {
    const [badges, setBadges] = useState<Badge[]>([]);

    useEffect(() => {
        const fetchBadges = async () => {
            try {
                const fetchedBadges = await getMyBadges();
                const newBadges = fetchedBadges.filter(b => !badges.some(b2 => b2.id === b.id));
                if (newBadges.length > 0) {
                    newBadges.forEach(b => toast.success(`You earned a new badge: ${b.name}!`));
                }
                setBadges(fetchedBadges);
            } catch (error) {
                console.error('Error fetching badges:', error);
            }
        };

        const interval = setInterval(fetchBadges, 5000); // Poll for new badges every 5 seconds

        return () => clearInterval(interval);
    }, [badges]);

    return badges;
};
