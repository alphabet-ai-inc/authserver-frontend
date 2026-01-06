// src/components/apps/__tests__/DynamicField.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DynamicField from '../DynamicField.jsx';

// Mock document event listeners
const mockAddEventListener = vi.fn();
const mockRemoveEventListener = vi.fn();

beforeEach(() => {
  Object.defineProperty(document, 'addEventListener', {
    value: mockAddEventListener,
    writable: true
  });
  Object.defineProperty(document, 'removeEventListener', {
    value: mockRemoveEventListener,
    writable: true
  });
  vi.clearAllMocks();
});

describe('DynamicField Component', () => {
  const defaultProps = {
    name: 'testField',
    label: 'Test Field',
    value: '',
    onChange: vi.fn()
  };

  describe('Basic Rendering', () => {
    it('should render without crashing', () => {
      render(<DynamicField {...defaultProps} />);
      expect(screen.getByText('Test Field')).toBeInTheDocument();
    });

    it('should render label correctly', () => {
      render(<DynamicField {...defaultProps} />);
      expect(screen.getByLabelText('Test Field')).toBeInTheDocument();
    });

    it('should show required indicator when required is true', () => {
      render(<DynamicField {...defaultProps} required={true} />);
      expect(screen.getByText('*')).toBeInTheDocument();
    });
  });

  describe('Text Input Type', () => {
    it('should render text input by default', () => {
      render(<DynamicField {...defaultProps} />);
      const input = screen.getByLabelText('Test Field');
      expect(input).toHaveAttribute('type', 'text');
    });

    it('should display initial value', () => {
      render(<DynamicField {...defaultProps} value="initial value" />);
      const input = screen.getByLabelText('Test Field');
      expect(input).toHaveValue('initial value');
    });

    it('should handle text input change', () => {
      render(<DynamicField {...defaultProps} />);

      const input = screen.getByLabelText('Test Field');
      fireEvent.change(input, { target: { value: 'new value' } });

      expect(input).toHaveValue('new value');
    });
  });

  describe('Number Input Type', () => {
    it('should render number input', () => {
      render(<DynamicField {...defaultProps} type="number" />);
      const input = screen.getByLabelText('Test Field');
      expect(input).toHaveAttribute('type', 'number');
    });

    it('should handle number input change', () => {
      render(<DynamicField {...defaultProps} type="number" />);

      const input = screen.getByLabelText('Test Field');
      fireEvent.change(input, { target: { value: '42' } });

      expect(input).toHaveValue(42);
    });
  });

  describe('Textarea Type', () => {
    it('should render textarea', () => {
      render(<DynamicField {...defaultProps} type="textarea" />);
      const textarea = screen.getByLabelText('Test Field');
      expect(textarea.tagName).toBe('TEXTAREA');
    });

    it('should display textarea value', () => {
      render(<DynamicField {...defaultProps} type="textarea" value="text content" />);
      const textarea = screen.getByLabelText('Test Field');
      expect(textarea).toHaveValue('text content');
    });
  });

  describe('Array Type', () => {
    it('should render textarea for array type', () => {
      render(<DynamicField {...defaultProps} type="array" />);
      const textarea = screen.getByLabelText('Test Field');
      expect(textarea.tagName).toBe('TEXTAREA');
    });

    it('should display array as newline-separated string', () => {
      const arrayValue = ['item1', 'item2', 'item3'];
      render(<DynamicField {...defaultProps} type="array" value={arrayValue} />);

      const textarea = screen.getByLabelText('Test Field');
      expect(textarea).toHaveValue('item1\nitem2\nitem3');
    });
  });

  describe('Checkbox Type', () => {
    it('should render checkbox', () => {
      render(<DynamicField {...defaultProps} type="checkbox" />);
      const checkbox = screen.getByLabelText('Test Field');
      expect(checkbox).toHaveAttribute('type', 'checkbox');
    });

    it('should display checkbox checked state', () => {
      render(<DynamicField {...defaultProps} type="checkbox" value={true} />);
      const checkbox = screen.getByLabelText('Test Field');
      expect(checkbox).toBeChecked();
    });

    it('should handle checkbox change', () => {
      render(<DynamicField {...defaultProps} type="checkbox" value={false} />);

      const checkbox = screen.getByLabelText('Test Field');
      fireEvent.click(checkbox);

      expect(checkbox).toBeChecked();
    });
  });

  describe('Select Type (Single)', () => {
    const selectOptions = [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3' }
    ];

    it('should render select dropdown', () => {
      render(<DynamicField {...defaultProps} type="select" options={selectOptions} />);
      const select = screen.getByLabelText('Test Field');
      expect(select.tagName).toBe('SELECT');
    });

    it('should display selected value', () => {
      render(<DynamicField {...defaultProps} type="select" value="option2" options={selectOptions} />);
      const select = screen.getByLabelText('Test Field');
      expect(select).toHaveValue('option2');
    });

    it('should render all options', () => {
      render(<DynamicField {...defaultProps} type="select" options={selectOptions} />);

      expect(screen.getByText('Choose Test Field...')).toBeInTheDocument();
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
      expect(screen.getByText('Option 3')).toBeInTheDocument();
    });
  });

  describe('Select Type (Multiple - Custom React Multi-Select)', () => {
    const multiSelectOptions = [
      { value: 'opt1', label: 'Option 1' },
      { value: 'opt2', label: 'Option 2' },
      { value: 'opt3', label: 'Option 3' }
    ];

    it('should render custom multi-select component when multiple=true', () => {
      render(
        <DynamicField
          {...defaultProps}
          type="select"
          multiple={true}
          options={multiSelectOptions}
        />
      );

      expect(screen.getByText('Select Test Field...')).toBeInTheDocument();
    });

    it('should display placeholder when no values selected', () => {
      render(
        <DynamicField
          {...defaultProps}
          type="select"
          multiple={true}
          options={multiSelectOptions}
          placeholder="Choose items..."
        />
      );

      expect(screen.getByText('Choose items...')).toBeInTheDocument();
    });

    it('should display selected values as badges', () => {
      render(
        <DynamicField
          {...defaultProps}
          type="select"
          multiple={true}
          options={multiSelectOptions}
          value={['opt1', 'opt2']}
        />
      );

      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
    });

    it('should open dropdown when clicked', () => {
      render(
        <DynamicField
          {...defaultProps}
          type="select"
          multiple={true}
          options={multiSelectOptions}
        />
      );

      const toggle = screen.getByText('Select Test Field...');
      fireEvent.click(toggle);

      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
      expect(screen.getByText('Option 3')).toBeInTheDocument();
    });
  });

  describe('Checkbox Group Type', () => {
    const checkboxOptions = [
      { value: 'check1', label: 'Checkbox 1' },
      { value: 'check2', label: 'Checkbox 2' },
      { value: 'check3', label: 'Checkbox 3' }
    ];

    it('should render checkbox group', () => {
      render(<DynamicField {...defaultProps} type="checkbox-group" options={checkboxOptions} />);

      // Get all checkboxes and verify count
      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes).toHaveLength(3);

      // Verify labels are present
      expect(screen.getByText('Checkbox 1')).toBeInTheDocument();
      expect(screen.getByText('Checkbox 2')).toBeInTheDocument();
      expect(screen.getByText('Checkbox 3')).toBeInTheDocument();
    });

    it('should display checked checkboxes', () => {
      render(
        <DynamicField
          {...defaultProps}
          type="checkbox-group"
          value={['check1', 'check3']}
          options={checkboxOptions}
        />
      );

      // Get all checkboxes and check by value attribute
      const checkboxes = screen.getAllByRole('checkbox');

      // Find checkboxes by their value attribute
      const checkbox1 = checkboxes.find(cb => cb.value === 'check1');
      const checkbox2 = checkboxes.find(cb => cb.value === 'check2');
      const checkbox3 = checkboxes.find(cb => cb.value === 'check3');

      expect(checkbox1).toBeChecked();
      expect(checkbox2).not.toBeChecked();
      expect(checkbox3).toBeChecked();
    });
  });

  describe('Error Handling', () => {
    it('should display error message when error prop is provided', () => {
      render(<DynamicField {...defaultProps} error="This field is required" />);

      expect(screen.getByText('This field is required')).toBeInTheDocument();
      const input = screen.getByLabelText('Test Field');
      expect(input).toHaveClass('is-invalid');
    });

    it('should not display error when no error prop', () => {
      render(<DynamicField {...defaultProps} />);

      expect(screen.queryByText('This field is required')).not.toBeInTheDocument();
    });
  });

  describe('Layout Classes', () => {
    it('should have form-control class on inputs', () => {
      render(<DynamicField {...defaultProps} />);
      const input = screen.getByLabelText('Test Field');
      expect(input).toHaveClass('form-control');
    });

    it('should have form-label class on label', () => {
      render(<DynamicField {...defaultProps} />);
      const label = screen.getByText('Test Field');
      expect(label).toHaveClass('form-label');
    });
  });

  describe('Placeholder', () => {
    it('should apply placeholder to input', () => {
      render(<DynamicField {...defaultProps} placeholder="Enter text here" />);

      const input = screen.getByLabelText('Test Field');
      expect(input).toHaveAttribute('placeholder', 'Enter text here');
    });
  });

  describe('File Type', () => {
    it('should render file input', () => {
      render(<DynamicField {...defaultProps} type="file" />);
      const input = screen.getByLabelText('Test Field');
      expect(input).toHaveAttribute('type', 'file');
    });
  });
});