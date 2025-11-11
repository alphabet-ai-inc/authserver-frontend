import PropTypes from 'prop-types';
import { useState, useMemo, useEffect } from 'react';

const DynamicField = ({
  type = 'text',
  name,
  label,
  value,
  options,
  error,
  required,
  colWidth = 12,
  multiple,
  onChange,
  placeholder,
  ...props
}) => {
  const [fieldError, setFieldError] = useState(null);
  const [displayValue, setDisplayValue] = useState('');

  // Convert bullet list string back to array (for array type fields)
  const convertBulletListToArray = (displayValue) => {
    try {
      if (!displayValue) return [];
      if (Array.isArray(displayValue)) return displayValue;

      return displayValue
        .split('\n')
        .map(item => item.trim())
        .filter(item => item.length > 0);
    } catch (error) {
      console.warn(`Error converting bullet list to array for field ${name}:`, error);
      return [];
    }
  };

  // Update display value when the prop value changes
  useEffect(() => {
      // Convert array to bullet list string (for array type fields)
    const convertArrayToBulletList = (arrayValue) => {
      try {
        if (!arrayValue) return '';
        if (Array.isArray(arrayValue)) {
          return arrayValue.join('\n');
        }
        return String(arrayValue || '');
      } catch (error) {
        console.warn(`Error converting array to bullet list for field ${name}:`, error);
        return '';
      }
    };

    if (type === 'array') {
      setDisplayValue(convertArrayToBulletList(value));
    } else {
      setDisplayValue(value || '');
    }
  }, [name, value, type]);

  // Safe value conversion with error handling
  const convertValue = (rawValue, fieldType) => {
    try {
      if (rawValue === '' || rawValue === null || rawValue === undefined) {
        return fieldType === 'array' ? [] : '';
      }

      switch (fieldType) {
        case 'array':
          return rawValue;
        case 'number':
        case 'range':
          if (rawValue === '') return '';
          const num = Number(rawValue);
          return isNaN(num) ? '' : num;
        case 'checkbox':
          return Boolean(rawValue);
        case 'date':
          if (typeof rawValue === 'string' && rawValue.includes('T')) {
            return rawValue.split('T')[0];
          }
          return rawValue;
        case 'datetime-local':
          return rawValue;
        default:
          return rawValue;
      }
    } catch (error) {
      console.warn(`Error converting value for field ${name}:`, error);
      setFieldError(`Invalid value format`);
      return fieldType === 'array' ? [] : '';
    }
  };

  // Safe value formatting for display
  const formatValueForInput = (val, fieldType) => {
    try {
      if (val === null || val === undefined) {
        return '';
      }

      switch (fieldType) {
        case 'array':
          return displayValue;
        case 'number':
        case 'range':
          const num = Number(val);
          return isNaN(num) ? '' : val.toString();
        case 'date':
          if (typeof val === 'string' && val.includes('T')) {
            return val.split('T')[0];
          }
          if (typeof val === 'number' && val > 0) {
            try {
              const date = new Date(val * 1000);
              return date.toISOString().split('T')[0];
            } catch {
              return val;
            }
          }
          return val;
        case 'datetime-local':
          if (typeof val === 'number' && val > 0) {
            try {
              const date = new Date(val * 1000);
              return date.toISOString().slice(0, 16);
            } catch {
              return val;
            }
          }
          return val;
        default:
          return val === null || val === undefined ? '' : String(val);
      }
    } catch (error) {
      console.warn(`Error formatting value for field ${name}:`, error);
      setFieldError(`Formatting error`);
      return '';
    }
  };

  // Safe options processing
  const safeOptions = useMemo(() => {
    try {
      if (!options || !Array.isArray(options)) return [];

      return options.map(opt => {
        if (!opt || typeof opt !== 'object') {
          console.warn(`Invalid option in field ${name}:`, opt);
          return { value: '', label: 'Invalid option' };
        }
        return {
          value: opt.value ?? '',
          label: opt.label ?? String(opt.value ?? '')
        };
      });
    } catch (error) {
      console.warn(`Error processing options for field ${name}:`, error);
      setFieldError(`Invalid options configuration`);
      return [];
    }
  }, [options, name]);

  // Handle change for array fields
  const handleChange = (e) => {
    try {
      setFieldError(null);

      const { value: rawValue, type: inputType, checked } = e.target;

      let finalValue;

      if (inputType === 'checkbox') {
        finalValue = checked;
      } else if (type === 'array') {
        // For array type, update display value but don't convert yet
        setDisplayValue(rawValue);
        finalValue = rawValue;
      } else {
        finalValue = convertValue(rawValue, type);
      }

      // For non-array fields, trigger onChange immediately
      if (type !== 'array') {
        onChange({
          target: {
            name,
            value: finalValue,
            type: inputType
          },
        });
      }
    } catch (error) {
      console.error(`Error handling change for field ${name}:`, error);
      setFieldError(`Error processing input`);
    }
  };

  // Handle blur event for array fields to convert to array format
  const handleBlur = (e) => {
    if (type === 'array') {
      try {
        const arrayValue = convertBulletListToArray(displayValue);
        onChange({
          target: {
            name,
            value: arrayValue,
            type: 'array'
          },
        });
      } catch (error) {
        console.error(`Error converting array on blur for field ${name}:`, error);
        setFieldError(`Error processing array input`);
      }
    }
  };

  const handleArrayChange = (e) => {
    try {
      setFieldError(null);

      const { value: optionValue, checked } = e.target;
      const newValue = Array.isArray(value) ? [...value] : [];

      if (checked) {
        newValue.push(optionValue);
      } else {
        const index = newValue.indexOf(optionValue);
        if (index > -1) newValue.splice(index, 1);
      }

      onChange({
        target: { name, value: newValue },
      });
    } catch (error) {
      console.error(`Error handling array change for field ${name}:`, error);
      setFieldError(`Error processing selection`);
    }
  };

  // Preview component for array fields
  const ArrayPreview = ({ items }) => {
    if (!items || !Array.isArray(items) || items.length === 0) {
      return (
        <div className="text-muted small">
          No items added yet. Enter one item per line above.
        </div>
      );
    }

    return (
      <div className="mt-2">
        <small className="text-muted d-block mb-1">Preview:</small>
        <ul className="list-unstyled small bg-light rounded p-2">
          {items.map((item, index) => (
            <li key={index} className="d-flex align-items-start mb-1">
              <span className="text-primary me-2">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  // Safe input renderer with error boundaries for each field type
  const renderInput = () => {
    try {
      const displayError = fieldError || error;
      const inputClassName = `form-control ${displayError ? 'is-invalid' : ''}`;
      const selectClassName = `form-select ${displayError ? 'is-invalid' : ''}`;
      const checkboxClassName = `form-check-input ${displayError ? 'is-invalid' : ''}`;

      const commonProps = {
        name,
        onChange: handleChange,
        onBlur: handleBlur,
        className: type === 'select' ? selectClassName : inputClassName,
        ...props
      };

      switch (type) {
        case 'array':
          return (
            <div>
              <textarea
                {...commonProps}
                value={displayValue}
                placeholder={placeholder || "Enter one item per line"}
                rows={4}
                className={`${inputClassName} resize-vertical`}
              />
              <div className="form-text">
                <i className="bi bi-info-circle me-1"></i>
                Enter one item per line. They will be displayed as a bullet list.
              </div>
              <ArrayPreview items={Array.isArray(value) ? value : []} />
            </div>
          );

        case 'select':
          return (
            <select
              {...commonProps}
              value={formatValueForInput(value, type) || ''}
              multiple={multiple}
            >
              {!multiple && <option value="">Choose {label}...</option>}
              {safeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          );

        case 'checkbox-group':
          return (
            <div className="border rounded p-3 bg-light">
              <div className="row">
                {safeOptions.map((opt) => (
                  <div key={opt.value} className="col-md-6 mb-2">
                    <div className="form-check">
                      <input
                        className={checkboxClassName}
                        type="checkbox"
                        id={`${name}-${opt.value}`}
                        value={opt.value}
                        checked={Array.isArray(value) && value.includes(opt.value)}
                        onChange={handleArrayChange}
                      />
                      <label className="form-check-label" htmlFor={`${name}-${opt.value}`}>
                        {opt.label}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );

        case 'textarea':
          return (
            <textarea
              {...commonProps}
              value={formatValueForInput(value, type) || ''}
              rows={4}
              placeholder={placeholder}
            />
          );

        case 'date':
          return (
            <input
              type="date"
              {...commonProps}
              value={formatValueForInput(value, type) || ''}
              placeholder={placeholder}
            />
          );

        case 'datetime-local':
          return (
            <input
              type="datetime-local"
              {...commonProps}
              value={formatValueForInput(value, type) || ''}
              placeholder={placeholder}
            />
          );

        case 'number':
          return (
            <input
              type="number"
              {...commonProps}
              value={formatValueForInput(value, type) || ''}
              placeholder={placeholder}
              step="any"
            />
          );

        case 'range':
          return (
            <div>
              <input
                type="range"
                {...commonProps}
                value={formatValueForInput(value, type) || ''}
                className="form-range"
              />
              <div className="form-text text-center">
                Current value: {formatValueForInput(value, type) || '0'}
              </div>
            </div>
          );

        case 'checkbox':
          return (
            <div className="form-check form-switch">
              <input
                className={`form-check-input ${displayError ? 'is-invalid' : ''}`}
                type="checkbox"
                checked={Boolean(value)}
                onChange={handleChange}
                id={name}
              />
              <label className="form-check-label" htmlFor={name}>
                {placeholder || label}
              </label>
            </div>
          );

        default:
          return (
            <input
              type={type}
              {...commonProps}
              value={formatValueForInput(value, type) || ''}
              placeholder={placeholder}
            />
          );
      }
    } catch (error) {
      console.error(`Critical error rendering field ${name}:`, error);

      return (
        <div className="alert alert-warning p-3">
          <div className="d-flex align-items-center">
            <i className="bi bi-exclamation-triangle-fill text-warning me-2"></i>
            <small>Unable to render "{label}" field</small>
          </div>
          <input
            type="text"
            className="form-control mt-2"
            placeholder="Field temporarily unavailable"
            disabled
          />
        </div>
      );
    }
  };

  // If there's a critical error in the entire component, show fallback
  if (fieldError && fieldError.includes('Critical')) {
    return (
      <div className={`col-md-${colWidth} mb-3`}>
        <label className="form-label text-danger">
          <i className="bi bi-x-circle me-1"></i>
          {label} (Unavailable)
        </label>
        <div className="alert alert-warning py-2">
          <small>
            <i className="bi bi-exclamation-triangle me-1"></i>
            This field is temporarily unavailable due to configuration issues.
          </small>
        </div>
      </div>
    );
  }

  return (
    <div className={`col-md-${colWidth} mb-4`}>
      <label htmlFor={name} className="form-label fw-semibold">
        {label}
        {required && <span className="text-danger ms-1">*</span>}
      </label>

      {renderInput()}

      {(fieldError || error) && (
        <div className="invalid-feedback d-flex align-items-center mt-1">
          <i className="bi bi-exclamation-circle me-2"></i>
          {fieldError || error}
        </div>
      )}
    </div>
  );
};

DynamicField.propTypes = {
  type: PropTypes.string,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.any,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.any,
      label: PropTypes.string,
    })
  ),
  error: PropTypes.string,
  required: PropTypes.bool,
  colWidth: PropTypes.number,
  multiple: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

export default DynamicField;