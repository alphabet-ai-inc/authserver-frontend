import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from './Input';

describe('Input', () => {
  test('renders with label and value', () => {
    render(
      <Input
        name="username"
        title="Username"
        type="text"
        className="form-control"
        id="username"
        data-testid="username-input"
        value="testuser"
        onChange={() => {}}
        errorDiv="error-div"
        errorMsg=""
      />
    );
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByTestId('username-input')).toHaveValue('testuser');
  });

  test('calls onChange when input changes', () => {
    const handleChange = jest.fn();
    render(
      <Input
        name="email"
        title="Email"
        type="email"
        className="form-control"
        id="email"
        data-testid="email-input"
        value=""
        onChange={handleChange}
        errorDiv="error-div"
        errorMsg=""
      />
    );
    const input = screen.getByTestId('email-input');
    fireEvent.change(input, { target: { value: 'test@example.com' } });
    expect(handleChange).toHaveBeenCalled();
  });

  test('renders error message', () => {
    render(
      <Input
        name="password"
        title="Password"
        type="password"
        className="form-control"
        id="password"
        data-testid="password-input"
        value=""
        onChange={() => {}}
        errorDiv="error-div"
        errorMsg="Password is required"
      />
    );
    expect(screen.getByText('Password is required')).toBeInTheDocument();
  });
});