import { render, screen, fireEvent } from '@testing-library/react';
import { CheckBox } from './Checkbox';

describe('CheckBox', () => {
  test('renders with correct label and checked state', () => {
    render(
      <CheckBox
        name="testCheck"
        value="1"
        checked={true}
        onChange={() => {}}
        title="Accept Terms"
      />
    );
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toBeChecked();
    expect(screen.getByLabelText('Accept Terms')).toBeInTheDocument();
  });

  test('calls onChange when clicked', () => {
    const handleChange = jest.fn();
    render(
      <CheckBox
        name="testCheck"
        value="1"
        checked={false}
        onChange={handleChange}
        title="Accept Terms"
      />
    );
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(handleChange).toHaveBeenCalled();
  });
});