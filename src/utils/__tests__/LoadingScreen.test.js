import { render, screen } from '@testing-library/react';
import { LoadingScreen } from '../LoadingScreen';

describe('LoadingScreen', () => {
  test('renders loading message', () => {
    render(<LoadingScreen />);
    expect(screen.getByText(/loading session/i)).toBeInTheDocument();
  });

  test('renders with correct style', () => {
    render(<LoadingScreen />);
    const div = screen.getByText(/loading session/i).parentElement;
    expect(div).toHaveStyle({ padding: '2rem', textAlign: 'center' });
  });
});