// src/components/apps/FormSections/__tests__/DevelopmentStack.test.js
import { render, screen } from '@testing-library/react';
import { DevelopmentStack } from '../DevelopmentStack';

// Mock DynamicField component
jest.mock('../DynamicField', () => {
  return function MockDynamicField({
    name,
    label,
    value,
    error,
    type,
    placeholder,
    colWidth,
    rows,
    min,
    max,
    step
  }) {
    return (
      <div data-testid="dynamic-field" data-fieldname={name} data-colwidth={colWidth}>
        <label data-testid="field-label">{label}</label>
        <div data-testid="field-type">Type: {type}</div>
        <div data-testid="field-value">
          Value: {
            (() => {
              if (Array.isArray(value)) {
                return value.length > 0 ? value.join(', ') : 'empty';
              }
              return value || 'empty';
            })()
          }
        </div>
        {error && <div data-testid="field-error" className="error">{error}</div>}
        {placeholder && <div data-testid="field-placeholder">Placeholder: {placeholder}</div>}
        {rows && <div data-testid="field-rows">Rows: {rows}</div>}
        {min && <div data-testid="field-min">Min: {min}</div>}
        {max && <div data-testid="field-max">Max: {max}</div>}
        {step && <div data-testid="field-step">Step: {step}</div>}
      </div>
    );
  };
});

describe('DevelopmentStack Component', () => {
  const defaultFormData = {
    roadmap: '',
    version_control: [],
    key_activities: [],
    average_response_time: '',
    uptime_percentage: '',
    error_rate: '',
    frontend_technologies: [],
    backend_technologies: [],
    database_technologies: [],
    infrastructure_tools: [],
    deployment_process: ''
  };

  const defaultErrors = {};

  const defaultProps = {
    formData: defaultFormData,
    handleChange: jest.fn(),
    errors: defaultErrors
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render section title', () => {
    render(<DevelopmentStack {...defaultProps} />);
    expect(screen.getByText('Development Stack & Performance')).toBeInTheDocument();
  });

  it('should render section description', () => {
    render(<DevelopmentStack {...defaultProps} />);
    expect(screen.getByText(/Technical infrastructure, development tools, and performance metrics/)).toBeInTheDocument();
  });

  it('should render all section subheaders', () => {
    render(<DevelopmentStack {...defaultProps} />);

    expect(screen.getByText('Development Process')).toBeInTheDocument();
    expect(screen.getByText('Performance Metrics')).toBeInTheDocument();
    expect(screen.getByText('Technical Stack')).toBeInTheDocument();
  });

  it('should render all field labels', () => {
    render(<DevelopmentStack {...defaultProps} />);

    expect(screen.getByText('Development Roadmap')).toBeInTheDocument();
    expect(screen.getByText('Version Control & Tools')).toBeInTheDocument();
    expect(screen.getByText('Key Development Activities')).toBeInTheDocument();
    expect(screen.getByText('Average Response Time (ms)')).toBeInTheDocument();
    expect(screen.getByText('Uptime Percentage (%)')).toBeInTheDocument();
    expect(screen.getByText('Error Rate (%)')).toBeInTheDocument();
    expect(screen.getByText('Frontend Technologies')).toBeInTheDocument();
    expect(screen.getByText('Backend Technologies')).toBeInTheDocument();
    expect(screen.getByText('Database Technologies')).toBeInTheDocument();
    expect(screen.getByText('Infrastructure & DevOps')).toBeInTheDocument();
    expect(screen.getByText('Deployment Process')).toBeInTheDocument();
  });

  it('should render correct number of DynamicField components', () => {
    render(<DevelopmentStack {...defaultProps} />);

    const dynamicFields = screen.getAllByTestId('dynamic-field');
    expect(dynamicFields).toHaveLength(11);
  });

  it('should have correct field types distribution', () => {
    render(<DevelopmentStack {...defaultProps} />);

    const typeElements = screen.getAllByTestId('field-type');
    const typeTexts = typeElements.map(el => el.textContent);

    const textareaCount = typeTexts.filter(text => text === 'Type: textarea').length;
    const arrayCount = typeTexts.filter(text => text === 'Type: array').length;
    const numberCount = typeTexts.filter(text => text === 'Type: number').length;

    expect(textareaCount).toBe(2); // roadmap, deployment_process
    expect(arrayCount).toBe(6); // version_control, key_activities, frontend_technologies, backend_technologies, database_technologies, infrastructure_tools
    expect(numberCount).toBe(3); // average_response_time, uptime_percentage, error_rate
  });

  it('should have correct colWidth values', () => {
    render(<DevelopmentStack {...defaultProps} />);

    const dynamicFields = screen.getAllByTestId('dynamic-field');

    const colWidth12Fields = dynamicFields.filter(field => field.getAttribute('data-colwidth') === '12');
    const colWidth6Fields = dynamicFields.filter(field => field.getAttribute('data-colwidth') === '6');

    expect(colWidth12Fields.length).toBe(2); // roadmap, deployment_process
    expect(colWidth6Fields.length).toBe(9); // all other fields
  });

  it('should have correct placeholder texts for key fields', () => {
    render(<DevelopmentStack {...defaultProps} />);

    const placeholderElements = screen.getAllByTestId('field-placeholder');
    const placeholderTexts = placeholderElements.map(el => el.textContent);

    expect(placeholderTexts).toContain('Placeholder: Describe your development timeline, upcoming features, and future plans...');
    expect(placeholderTexts).toContain('Placeholder: Git, GitHub, GitLab, Bitbucket, SVN...');
    expect(placeholderTexts).toContain('Placeholder: Code reviews, CI/CD, Testing, Documentation...');
    expect(placeholderTexts).toContain('Placeholder: Milliseconds');
    expect(placeholderTexts).toContain('Placeholder: 0-100');
    expect(placeholderTexts).toContain('Placeholder: React, Vue, Angular, HTML5, CSS3...');
    expect(placeholderTexts).toContain('Placeholder: Node.js, Python, Java, .NET, PHP...');
    expect(placeholderTexts).toContain('Placeholder: MySQL, PostgreSQL, MongoDB, Redis...');
    expect(placeholderTexts).toContain('Placeholder: Docker, Kubernetes, AWS, Azure, Jenkins...');
    expect(placeholderTexts).toContain('Placeholder: Describe your deployment strategy, environments, and release process...');
  });

  it('should have rows specified for textarea fields', () => {
    render(<DevelopmentStack {...defaultProps} />);

    const rowsElements = screen.getAllByTestId('field-rows');
    expect(rowsElements).toHaveLength(2); // Two textarea fields

    const rowsValues = rowsElements.map(el => el.textContent);
    expect(rowsValues).toContain('Rows: 4');
    expect(rowsValues).toContain('Rows: 3');
  });

  it('should have min/max/step for number fields', () => {
    render(<DevelopmentStack {...defaultProps} />);

    const minElements = screen.getAllByTestId('field-min');
    const maxElements = screen.getAllByTestId('field-max');
    const stepElements = screen.getAllByTestId('field-step');

    expect(minElements).toHaveLength(3); // All three number fields have min
    expect(maxElements).toHaveLength(2); // uptime_percentage and error_rate have max
    expect(stepElements).toHaveLength(3); // All three number fields have step

    minElements.forEach(element => {
      expect(element.textContent).toBe('Min: 0');
    });

    const maxValues = maxElements.map(el => el.textContent);
    expect(maxValues).toEqual(['Max: 100', 'Max: 100']);

    const stepValues = stepElements.map(el => el.textContent);
    expect(stepValues).toEqual(expect.arrayContaining(['Step: 1', 'Step: 0.01', 'Step: 0.01']));
  });

  describe('Data Display', () => {
    it('should display populated form data', () => {
      const formDataWithValues = {
        roadmap: 'Q1: New features, Q2: Performance improvements',
        version_control: ['Git', 'GitHub'],
        key_activities: ['Code reviews', 'CI/CD'],
        average_response_time: '150',
        uptime_percentage: '99.95',
        error_rate: '0.05',
        frontend_technologies: ['React', 'TypeScript'],
        backend_technologies: ['Node.js', 'Express'],
        database_technologies: ['PostgreSQL', 'Redis'],
        infrastructure_tools: ['Docker', 'AWS'],
        deployment_process: 'Automated CI/CD pipeline with staging environment'
      };

      render(<DevelopmentStack {...defaultProps} formData={formDataWithValues} />);

      const valueElements = screen.getAllByTestId('field-value');
      const valuesText = valueElements.map(el => el.textContent);

      expect(valuesText).toContain('Value: Q1: New features, Q2: Performance improvements');
      expect(valuesText).toContain('Value: Git, GitHub');
      expect(valuesText).toContain('Value: Code reviews, CI/CD');
      expect(valuesText).toContain('Value: 150');
      expect(valuesText).toContain('Value: 99.95');
      expect(valuesText).toContain('Value: 0.05');
      expect(valuesText).toContain('Value: React, TypeScript');
      expect(valuesText).toContain('Value: Node.js, Express');
      expect(valuesText).toContain('Value: PostgreSQL, Redis');
      expect(valuesText).toContain('Value: Docker, AWS');
      expect(valuesText).toContain('Value: Automated CI/CD pipeline with staging environment');
    });

    it('should display empty for unpopulated form data', () => {
      render(<DevelopmentStack {...defaultProps} />);

      const valueElements = screen.getAllByTestId('field-value');
      valueElements.forEach(element => {
        expect(element.textContent).toBe('Value: empty');
      });
    });
  });

  describe('Error Handling', () => {
    it('should display errors when they exist', () => {
      const errors = {
        roadmap: 'Development roadmap is required',
        average_response_time: 'Must be a positive number',
        frontend_technologies: 'At least one frontend technology is required'
      };

      render(<DevelopmentStack {...defaultProps} errors={errors} />);

      const errorElements = screen.getAllByTestId('field-error');
      expect(errorElements).toHaveLength(3);

      expect(screen.getByText('Development roadmap is required')).toBeInTheDocument();
      expect(screen.getByText('Must be a positive number')).toBeInTheDocument();
      expect(screen.getByText('At least one frontend technology is required')).toBeInTheDocument();
    });

    it('should not display errors when none exist', () => {
      render(<DevelopmentStack {...defaultProps} />);

      const errorElements = screen.queryAllByTestId('field-error');
      expect(errorElements).toHaveLength(0);
    });
  });

  it('should group fields under correct subheaders', () => {
    render(<DevelopmentStack {...defaultProps} />);

    // Development Process fields
    expect(screen.getByText('Development Roadmap')).toBeInTheDocument();
    expect(screen.getByText('Version Control & Tools')).toBeInTheDocument();
    expect(screen.getByText('Key Development Activities')).toBeInTheDocument();

    // Performance Metrics fields
    expect(screen.getByText('Average Response Time (ms)')).toBeInTheDocument();
    expect(screen.getByText('Uptime Percentage (%)')).toBeInTheDocument();
    expect(screen.getByText('Error Rate (%)')).toBeInTheDocument();

    // Technical Stack fields
    expect(screen.getByText('Frontend Technologies')).toBeInTheDocument();
    expect(screen.getByText('Backend Technologies')).toBeInTheDocument();
    expect(screen.getByText('Database Technologies')).toBeInTheDocument();
    expect(screen.getByText('Infrastructure & DevOps')).toBeInTheDocument();
    expect(screen.getByText('Deployment Process')).toBeInTheDocument();
  });
});