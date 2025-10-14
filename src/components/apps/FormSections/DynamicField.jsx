import PropTypes from 'prop-types';
import { toDateTimeLocalValue } from '../../../utils/toDateTimeLocal.js';
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

  const renderInput = () => {
    switch (type) {
      case 'select':
        return (
          <select
            className={`form-select ${error ? 'is-invalid' : ''}`}
            name={name}
            value={value || ''}
            onChange={onChange}
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
            value={value || ''}
            onChange={onChange}
            {...props}
          />
        );
      case 'date':
        return (
          <input
            type="datetime-local"
            className={`form-control ${error ? 'is-invalid' : ''}`}
            name={name}
            value={toDateTimeLocalValue(value) || ''}
            onChange={onChange}
            {...props}
          />
        );
      default:
        return (
          <input
            type={type}
            className={`form-control ${error ? 'is-invalid' : ''}`}
            name={name}
            value={value || ''}
            onChange={onChange}
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
