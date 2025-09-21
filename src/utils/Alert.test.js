import { render, screen } from '@testing-library/react';
import { Alert } from './Alert';

describe('Alert', () => {
  test('renders nothing when className is "d-none"', () => {
    const { container } = render(<Alert message="Hidden" className="d-none" />);
    expect(container).toBeEmptyDOMElement();
  });

  test('renders alert with message and className', () => {
    render(<Alert message="Test alert!" className="alert-danger" />);
    const alertDiv = screen.getByRole('alert');
    expect(alertDiv).toBeInTheDocument();
    expect(alertDiv).toHaveClass('alert alert-danger');
    expect(alertDiv).toHaveTextContent('Test alert!');
  });
});