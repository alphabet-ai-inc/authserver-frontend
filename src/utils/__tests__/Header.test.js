import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from '../Header';

describe('Header', () => {
  test('renders nothing if jwtToken is present', () => {
    const { container } = render(<Header jwtToken="abc" handleLogin={jest.fn()} />);
    expect(container).toBeEmptyDOMElement();
  });

  test('renders login button if jwtToken is not present', () => {
    render(<Header jwtToken={null} handleLogin={jest.fn()} />);
    const button = screen.getByRole('button', { name: /login/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('btn btn-success');
  });

  test('calls handleLogin when login button is clicked', () => {
    const handleLogin = jest.fn();
    render(<Header jwtToken={null} handleLogin={handleLogin} />);
    const button = screen.getByRole('button', { name: /login/i });
    fireEvent.click(button);
    expect(handleLogin).toHaveBeenCalled();
  });
});