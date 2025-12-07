import { render, screen, fireEvent } from '@testing-library/react';
import { Home } from '../Home';

// Mock dependencies
jest.mock('../../images/switch1.jpeg', () => 'mock-image.jpg');
jest.mock('../../utils/Alert', () => ({
    Alert: ({ message, className }) => <div data-testid="alert" className={className}>{message}</div>
}));
/**
 * Mock useNavigate from react-router-dom
 * to test navigation without actual routing.
 */
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));

// Create a mock state object
const mockAuthSession = {
    jwtToken: '',
    sessionChecked: true,
    setIsLoggedInExplicitly: jest.fn(),
    toggleRefresh: jest.fn(),
};

// Mock useAuthSession hook
jest.mock('../../hooks/useAuthSession', () => ({
    useAuthSession: () => mockAuthSession,
}));

describe('Home', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Reset to default state before each test
        mockAuthSession.jwtToken = '';
        mockAuthSession.sessionChecked = true;
    });

    test('shows loading when session is not checked', () => {
        mockAuthSession.sessionChecked = false;
        render(<Home />);
        expect(screen.getByText(/loading session/i)).toBeInTheDocument();
    });

    test('renders login prompt when not logged in', () => {
        render(<Home />);
        expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
        expect(screen.getByAltText(/security/i)).toBeInTheDocument();
    });

    test('calls login handlers and navigates on login', () => {
        render(<Home />);
        const button = screen.getByRole('button', { name: /login/i });
        fireEvent.click(button);
        expect(mockAuthSession.setIsLoggedInExplicitly).toHaveBeenCalledWith(true);
        expect(mockAuthSession.toggleRefresh).toHaveBeenCalledWith(true);
        expect(mockNavigate).toHaveBeenCalledWith('/login');
    });

    test('renders welcome back if jwtToken exists', () => {
        mockAuthSession.jwtToken = 'sometoken';
        render(<Home />);
        expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
    });
});