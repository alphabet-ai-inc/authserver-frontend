import PropTypes from 'prop-types';

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
  const convertValue = (rawValue, fieldType) => {
    if (rawValue === '' || rawValue === null || rawValue === undefined) {
      return '';
    }

    switch (fieldType) {
      case 'number':
      case 'range':
        return rawValue === '' ? '' : Number(rawValue);
      case 'checkbox':
        return Boolean(rawValue);
      case 'date':
        // Extract date part from datetime-local or return as-is for date input
        if (typeof rawValue === 'string' && rawValue.includes('T')) {
          return rawValue.split('T')[0]; // Return only the date part
        }
        return rawValue;
      case 'datetime-local':
        // Return full datetime string
        return rawValue;
      default:
        return rawValue;
    }
  };

  const handleChange = (e) => {
    const { value: rawValue, type: inputType, checked } = e.target;

    let finalValue;
    if (inputType === 'checkbox') {
      finalValue = checked;
    } else {
      finalValue = convertValue(rawValue, type);
    }

    onChange({
      target: {
        name,
        value: finalValue,
        type: inputType
      },
    });
  };

  const handleArrayChange = (e) => {
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
  };

  const formatValueForInput = (val, fieldType) => {
    if (val === null || val === undefined) return '';

    switch (fieldType) {
      case 'number':
      case 'range':
        return val.toString();
      case 'date':
        // If it's a datetime string, extract date part
        if (typeof val === 'string' && val.includes('T')) {
          return val.split('T')[0];
        }
        // If it's a timestamp, convert to date string
        if (typeof val === 'number' && val > 0) {
          const date = new Date(val * 1000); // Convert seconds to milliseconds
          return date.toISOString().split('T')[0];
        }
        return val;
      case 'datetime-local':
        // Convert timestamp to datetime-local format
        if (typeof val === 'number' && val > 0) {
          const date = new Date(val * 1000);
          return date.toISOString().slice(0, 16);
        }
        return val;
      default:
        return val;
    }
  };

  const renderInput = () => {
    switch (type) {
      case 'select':
        return (
          <select
            className={`form-select ${error ? 'is-invalid' : ''}`}
            name={name}
            value={formatValueForInput(value, type) || ''}
            onChange={handleChange}
            multiple={multiple}
          >
            {!multiple && <option value="">Select {label}</option>}
            {options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );

      case 'checkbox-group':
        return (
          <div className="d-flex gap-3">
            {options?.map((opt) => (
              <div key={opt.value} className="form-check">
                <input
                  className="form-check-input"
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
            ))}
          </div>
        );

      case 'textarea':
        return (
          <textarea
            className={`form-control ${error ? 'is-invalid' : ''}`}
            name={name}
            value={formatValueForInput(value, type) || ''}
            onChange={handleChange}
            {...props}
          />
        );

      case 'date':
        return (
          <input
            type="date"
            className={`form-control ${error ? 'is-invalid' : ''}`}
            name={name}
            value={formatValueForInput(value, type) || ''}
            onChange={handleChange}
            {...props}
          />
        );

      case 'datetime-local':
        return (
          <input
            type="datetime-local"
            className={`form-control ${error ? 'is-invalid' : ''}`}
            name={name}
            value={formatValueForInput(value, type) || ''}
            onChange={handleChange}
            {...props}
          />
        );

      case 'number':
      case 'range':
        return (
          <input
            type={type}
            className={`form-control ${error ? 'is-invalid' : ''}`}
            name={name}
            value={formatValueForInput(value, type) || ''}
            onChange={handleChange}
            {...props}
          />
        );

      default:
        return (
          <input
            type={type}
            className={`form-control ${error ? 'is-invalid' : ''}`}
            name={name}
            value={formatValueForInput(value, type) || ''}
            onChange={handleChange}
            {...props}
          />
        );
    }
  };

  return (
    <div className={`col-md-${colWidth} mb-3`}>
      <label htmlFor={name} className="form-label">
        {label}
        {required && <span className="text-danger ms-1">*</span>}
      </label>

      {renderInput()}

      {error && <div className="invalid-feedback">{error}</div>}
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
};

export default DynamicField;