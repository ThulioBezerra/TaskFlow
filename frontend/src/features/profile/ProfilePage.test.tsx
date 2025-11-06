import { render, screen } from '@testing-library/react';
import ProfilePage from './ProfilePage';
import { useBadges } from '../../hooks/useBadges';

vi.mock('../../hooks/useBadges');

describe('ProfilePage', () => {
    it('renders the badges returned by the useBadges hook', () => {
        const mockBadges = [
            { id: '1', name: 'Test Badge 1', description: 'Test Description 1', icon: 'test-icon-1' },
            { id: '2', name: 'Test Badge 2', description: 'Test Description 2', icon: 'test-icon-2' },
        ];

        (useBadges as jest.Mock).mockReturnValue(mockBadges);

        render(<ProfilePage />);

        expect(screen.getByText('Test Badge 1')).toBeInTheDocument();
        expect(screen.getByText('Test Badge 2')).toBeInTheDocument();
    });
});
