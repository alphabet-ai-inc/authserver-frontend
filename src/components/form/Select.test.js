import { render, screen, fireEvent } from '@testing-library/react';
import { Select } from './Select';

const options = [
  { id: 'A', value: 'Option A' },
  { id: 'B', value: 'Option B' },
];

describe('Select', () => {
  test('renders with label and options', () => {
    render(
      <Select
        label="Test Select"
        name="testSelect"
        title="Test Select"
        id="testSelect"
        className="custom-class"
        value=""
        onChange={() => {}}
        options={options}
        placeHolder="Choose..."
        errorDiv="error-div"
        errorMsg=""
      />
    );
    expect(screen.getByLabelText('Test Select')).toBeInTheDocument();
    expect(screen.getByText('Choose...')).toBeInTheDocument();
    expect(screen.getByText('Option A')).toBeInTheDocument();
    expect(screen.getByText('Option B')).toBeInTheDocument();
  });

  test('calls onChange when selection changes', () => {
    const handleChange = jest.fn();
    render(
      <Select
        label="Test Select"
        name="testSelect"
        title="Test Select"
        id="testSelect"
        className="custom-class"
        value=""
        onChange={handleChange}
        options={options}
        placeHolder="Choose..."
        errorDiv="error-div"
        errorMsg=""
      />
    );
    fireEvent.change(screen.getByLabelText('Test Select'), { target: { value: 'B' } });
    expect(handleChange).toHaveBeenCalled();
  });

  test('shows error message', () => {
    render(
      <Select
        name="testSelect"
        title="Test Select"
        id="testSelect"
        className="custom-class"
        value=""
        onChange={() => {}}
        options={options}
        placeHolder="Choose..."
        errorDiv="error-div"
        errorMsg="Selection is required"
      />
    );
    expect(screen.getByText('Selection is required')).toBeInTheDocument();
  });
});