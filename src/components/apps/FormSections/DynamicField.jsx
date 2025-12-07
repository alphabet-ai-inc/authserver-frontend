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
  id,
  ...props
}) => {
  const fieldId = id || name;
  const [fieldError, setFieldError] = useState(null);
  const [internalValue, setInternalValue] = useState(value);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Update internal value when prop changes
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isDropdownOpen]);

  // Handle change - INTERNAL ONLY
  const handleChange = (e) => {
    try {
      setFieldError(null);
      const { value: rawValue, type: inputType, checked } = e.target;

      let finalValue;

      if (inputType === 'checkbox') {
        finalValue = checked;
      } else if (type === 'number') {
        finalValue = rawValue === '' ? null : Number(rawValue);
      } else {
        finalValue = rawValue;
      }

      setInternalValue(finalValue);

      // ONLY call parent's onChange for file fields
      if (onChange && type === 'file') {
        onChange(e); // Pass the original event for file handling
      }
    } catch (error) {
      console.error(`Error handling change for field ${name}:`, error);
      setFieldError(`Error processing input`);
    }
  };

  // Handle multi-select changes
  const handleMultiSelectChange = (optionValue) => {
    try {
      setFieldError(null);
      const currentValues = Array.isArray(internalValue) ? [...internalValue] : [];

      const newValues = currentValues.includes(optionValue)
        ? currentValues.filter(v => v !== optionValue)
        : [...currentValues, optionValue];

      setInternalValue(newValues);
    } catch (error) {
      console.error(`Error handling multi-select for field ${name}:`, error);
      setFieldError(`Error processing selection`);
    }
  };

  // Handle blur for array fields
  const handleBlur = (e) => {
    if (type === 'array') {
      try {
        const arrayValue = internalValue
          ? internalValue.split('\n')
              .map(item => item.trim())
              .filter(item => item.length > 0)
          : [];

        setInternalValue(arrayValue);
      } catch (error) {
        console.error(`Error converting array on blur for field ${name}:`, error);
        setFieldError(`Error processing array input`);
      }
    }
  };

  // Handle checkbox group changes
  const handleArrayChange = (e) => {
    try {
      setFieldError(null);
      const { value: optionValue, checked } = e.target;
      const newValue = Array.isArray(internalValue) ? [...internalValue] : [];

      if (checked) {
        newValue.push(optionValue);
      } else {
        const index = newValue.indexOf(optionValue);
        if (index > -1) newValue.splice(index, 1);
      }

      setInternalValue(newValue);
    } catch (error) {
      console.error(`Error handling array change for field ${name}:`, error);
      setFieldError(`Error processing selection`);
    }
  };

  // Format value for display
  const getDisplayValue = () => {
    if (type === 'array' && Array.isArray(internalValue)) {
      return internalValue.join('\n');
    }
    return internalValue === null || internalValue === undefined ? '' : String(internalValue);
  };

  // Safe options processing
  const safeOptions = useMemo(() => {
    if (!options || !Array.isArray(options)) return [];
    return options.map(opt => ({
      value: opt.value ?? '',
      label: opt.label ?? String(opt.value ?? '')
    }));
  }, [options]);

  // **Custom React Multi-Select Component**
  const ReactMultiSelect = () => {
    const displayError = fieldError || error;
    const selectedValues = Array.isArray(internalValue) ? internalValue : [];

    const getSelectedLabels = () => {
      return selectedValues.map(val => {
        const option = safeOptions.find(opt => opt.value === val);
        return option ? option.label : val;
      });
    };

    return (
      <div className="react-multi-select position-relative">
        {/* Hidden inputs for form submission */}
        {selectedValues.map((val, index) => (
          <input
            key={index}
            type="hidden"
            name={name}
            value={val}
          />
        ))}

        {/* Custom dropdown toggle */}
        <div
          className={`form-control multi-select-toggle ${displayError ? 'is-invalid' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            setIsDropdownOpen(!isDropdownOpen);
          }}
          style={{ cursor: 'pointer', minHeight: '38px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <div className="selected-tags-container flex-grow-1">
            {selectedValues.length === 0 ? (
              <span className="text-muted">{placeholder || `Select ${label}...`}</span>
            ) : (
              <div className="selected-tags">
                {getSelectedLabels().map((label, index) => (
                  <span key={index} className="badge bg-primary me-1 mb-1 d-inline-flex align-items-center">
                    {label}
                    <button
                      type="button"
                      className="btn-close btn-close-white ms-1"
                      style={{ fontSize: '0.7em' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMultiSelectChange(selectedValues[index]);
                      }}
                    />
                  </span>
                ))}
              </div>
            )}
          </div>
          <span className="dropdown-arrow">▼</span>
        </div>

        {/* Dropdown menu */}
        {isDropdownOpen && (
          <div
            className="border rounded mt-1 bg-white shadow-sm position-absolute w-100"
            style={{
              zIndex: 1000,
              maxHeight: '200px',
              overflowY: 'auto',
              top: '100%',
              left: 0
            }}
          >
            {safeOptions.map((opt) => (
              <div
                key={opt.value}
                className={`dropdown-item ${selectedValues.includes(opt.value) ? 'bg-light' : ''}`}
                style={{ cursor: 'pointer', padding: '8px 12px' }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleMultiSelectChange(opt.value);
                }}
              >
                <div className="form-check mb-0">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={selectedValues.includes(opt.value)}
                    onChange={() => {}} // Handled by parent click
                    readOnly
                  />
                  <label className="form-check-label w-100 mb-0">
                    {opt.label}
                  </label>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Enhanced input renderer
  const renderInput = () => {
    const displayError = fieldError || error;
    const inputClassName = `form-control ${displayError ? 'is-invalid' : ''}`;
    const selectClassName = `form-select ${displayError ? 'is-invalid' : ''}`;
    const checkboxClassName = `form-check-input ${displayError ? 'is-invalid' : ''}`;

    const displayValue = getDisplayValue();

    const commonProps = {
      id: fieldId,
      name,
      onChange: handleChange,
      onBlur: handleBlur,
      placeholder,
      ...props
    };

    switch (type) {
      case 'array':
        return (
          <textarea
            {...commonProps}
            value={displayValue}
            rows={4}
            className={inputClassName}
          />
        );

      case 'select':
        if (multiple) {
          return <ReactMultiSelect />; // Use our custom React multi-select
        }
        return (
          <select
            {...commonProps}
            value={displayValue}
            className={selectClassName}
          >
            <option value="">Choose {label}...</option>
            {safeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
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
                      id={`${fieldId}-${opt.value}`}
                      name={name}
                      value={opt.value}
                      checked={Array.isArray(internalValue) && internalValue.includes(opt.value)}
                      onChange={handleArrayChange}
                    />
                    <label className="form-check-label">{opt.label}</label>
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
            value={displayValue}
            rows={4}
            className={inputClassName}
          />
        );

      case 'checkbox':
        return (
          <div className="form-check form-switch">
            <input
              className={checkboxClassName}
              type="checkbox"
              name={name}
              checked={Boolean(internalValue)}
              onChange={handleChange}
              value="on"
              {...commonProps}
            />
            <label className="form-check-label">{placeholder || label}</label>
          </div>
        );

      case 'number':
        return (
          <input
            type="number"
            {...commonProps}
            value={displayValue}
            className={inputClassName}
            step="any"
          />
        );

      case 'file':
        return (
          <input
            type="file"
            {...commonProps}
            className={inputClassName}
            onChange={handleChange} // Special handling for files
          />
        );

      default:
        return (
          <input
            type={type}
            {...commonProps}
            value={displayValue}
            className={inputClassName}
          />
        );
    }
  };

  return (

    <div className={`col-md-${colWidth} mb-4`}>
      <label htmlFor={fieldId} className="form-label fw-semibold"> {/* Add htmlFor */}
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
  options: PropTypes.array,
  error: PropTypes.string,
  required: PropTypes.bool,
  colWidth: PropTypes.number,
  multiple: PropTypes.bool,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
};

export default DynamicField;