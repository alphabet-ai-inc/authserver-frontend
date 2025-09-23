import { render, screen, fireEvent } from '@testing-library/react';
import { TextArea } from './TextArea';

describe('TextArea', () => {
  test('renders with value only', () => {
    render(
      <TextArea
        label="Description"
        id="description"
        name="description"
        title="Description"
        className="custom-class"
        rows={4}
        placeholder="Enter description"
        value="Initial text"
        onChange={() => {}}
        errorDiv="error-div"
        errorMsg=""
      />
    );
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter description')).toHaveValue('Initial text');
  });

  test('calls onChange when text changes', () => {
    const handleChange = jest.fn();
    render(
      <TextArea
        name="description"
        title="Description"
        id="description"
        className="custom-class"
        value=""
        onChange={handleChange}
        rows={4}
        placeholder="Enter description"
        errorDiv="error-div"
        errorMsg=""
      />
    );
    const textarea = screen.getByPlaceholderText('Enter description');
    fireEvent.change(textarea, { target: { value: 'New text' } });
    expect(handleChange).toHaveBeenCalled();
  });

  test('shows error message', () => {
    render(
      <TextArea
        name="description"
        title="Description"
        id="description"
        className="custom-class"
        value=""
        onChange={() => {}}
        rows={4}
        placeholder="Enter description"
        errorDiv="error-div"
        errorMsg="Description is required"
      />
    );
    expect(screen.getByText('Description is required')).toBeInTheDocument();
  });
});