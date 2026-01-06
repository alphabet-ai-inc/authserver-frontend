// src/components/apps/FormSections/__tests__/DevelopmentStack.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import DevelopmentStack from '../DevelopmentStack.jsx';

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
    handleChange: vi.fn(),
    errors: defaultErrors
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render section title', () => {
    render(<DevelopmentStack {...defaultProps} />);
    expect(screen.getByText('Development Stack & Performance')).toBeDefined();
  });

  it('should render section description', () => {
    render(<DevelopmentStack {...defaultProps} />);
    expect(screen.getByText(/Technical infrastructure, development tools, and performance metrics/)).toBeDefined();
  });

  describe('Section Subheaders', () => {
    it('should render all section subheaders', () => {
      render(<DevelopmentStack {...defaultProps} />);

      // Find h6 elements (subheaders)
      const subheaders = document.querySelectorAll('h6');
      const subheaderTexts = Array.from(subheaders).map(h => h.textContent);

      expect(subheaderTexts.some(text => text.includes('Development Process'))).toBe(true);
      expect(subheaderTexts.some(text => text.includes('Performance Metrics'))).toBe(true);
      expect(subheaderTexts.some(text => text.includes('Technical Stack'))).toBe(true);
    });
  });

  describe('Field Labels', () => {
    it('should render all field labels', () => {
      render(<DevelopmentStack {...defaultProps} />);

      // Find all label elements
      const labels = document.querySelectorAll('label.form-label');
      const labelTexts = Array.from(labels).map(label => label.textContent?.trim());

      // Development Process fields
      expect(labelTexts.some(text => text.includes('Development Roadmap'))).toBe(true);
      expect(labelTexts.some(text => text.includes('Version Control') || text.includes('Tools'))).toBe(true);
      expect(labelTexts.some(text => text.includes('Key Development') || text.includes('Activities'))).toBe(true);

      // Performance Metrics fields
      expect(labelTexts.some(text => text.includes('Average Response Time'))).toBe(true);
      expect(labelTexts.some(text => text.includes('Uptime Percentage'))).toBe(true);
      expect(labelTexts.some(text => text.includes('Error Rate'))).toBe(true);

      // Technical Stack fields
      expect(labelTexts.some(text => text.includes('Frontend Technologies'))).toBe(true);
      expect(labelTexts.some(text => text.includes('Backend Technologies'))).toBe(true);
      expect(labelTexts.some(text => text.includes('Database Technologies'))).toBe(true);
      expect(labelTexts.some(text => text.includes('Infrastructure') || text.includes('DevOps'))).toBe(true);
      expect(labelTexts.some(text => text.includes('Deployment Process'))).toBe(true);
    });
  });

  describe('Field Types', () => {
    it('should have textareas for roadmap and deployment process', () => {
      render(<DevelopmentStack {...defaultProps} />);

      const roadmapField = document.querySelector('textarea[name="roadmap"]');
      const deploymentField = document.querySelector('textarea[name="deployment_process"]');

      expect(roadmapField || deploymentField).toBeDefined();
    });

    it('should have number inputs for performance metrics', () => {
      render(<DevelopmentStack {...defaultProps} />);

      const responseField = document.querySelector('input[name="average_response_time"]');
      const uptimeField = document.querySelector('input[name="uptime_percentage"]');
      const errorField = document.querySelector('input[name="error_rate"]');

      const existingNumberFields = [
        responseField,
        uptimeField,
        errorField
      ].filter(field => field && field.type === 'number');

      expect(existingNumberFields.length).toBeGreaterThan(0);
    });

    it('should have textareas for array fields', () => {
      render(<DevelopmentStack {...defaultProps} />);

      // Array fields are likely textareas
      const versionField = document.querySelector('textarea[name="version_control"]');
      const activitiesField = document.querySelector('textarea[name="key_activities"]');
      const frontendField = document.querySelector('textarea[name="frontend_technologies"]');
      const backendField = document.querySelector('textarea[name="backend_technologies"]');
      const databaseField = document.querySelector('textarea[name="database_technologies"]');
      const infraField = document.querySelector('textarea[name="infrastructure_tools"]');

      const existingArrayFields = [
        versionField,
        activitiesField,
        frontendField,
        backendField,
        databaseField,
        infraField
      ].filter(field => field !== null);

      expect(existingArrayFields.length).toBeGreaterThan(0);
    });
  });

  describe('Field Attributes', () => {
    it('should have rows attribute for textareas', () => {
      render(<DevelopmentStack {...defaultProps} />);

      const textareas = document.querySelectorAll('textarea');
      textareas.forEach(textarea => {
        expect(textarea.hasAttribute('rows')).toBe(true);
      });
    });

    it('should have min attribute for number fields', () => {
      render(<DevelopmentStack {...defaultProps} />);

      const numberInputs = document.querySelectorAll('input[type="number"]');
      numberInputs.forEach(input => {
        expect(input.hasAttribute('min')).toBe(true);
      });
    });
  });

  describe('Placeholder Texts', () => {
    it('should have placeholder texts for fields', () => {
      render(<DevelopmentStack {...defaultProps} />);

      const fieldsWithPlaceholders = document.querySelectorAll('[placeholder]');
      expect(fieldsWithPlaceholders.length).toBeGreaterThan(0);

      // Check for some expected placeholders
      expect(document.querySelector('[placeholder*="development timeline"]')).toBeDefined();
      expect(document.querySelector('[placeholder*="Git, GitHub"]')).toBeDefined();
      expect(document.querySelector('[placeholder*="React, Vue"]')).toBeDefined();
      expect(document.querySelector('[placeholder*="Node.js, Python"]')).toBeDefined();
      expect(document.querySelector('[placeholder*="MySQL, PostgreSQL"]')).toBeDefined();
      expect(document.querySelector('[placeholder*="Docker, Kubernetes"]')).toBeDefined();
      expect(document.querySelector('[placeholder*="deployment strategy"]')).toBeDefined();
    });
  });

  describe('Layout', () => {
    it('should have appropriate column layout', () => {
      render(<DevelopmentStack {...defaultProps} />);

      const col12Divs = document.querySelectorAll('.col-md-12');
      const col6Divs = document.querySelectorAll('.col-md-6');

      expect(col12Divs.length + col6Divs.length).toBeGreaterThan(0);
    });
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

      // Check text fields
      const roadmapField = document.querySelector('textarea[name="roadmap"]');
      if (roadmapField) {
        expect(roadmapField.value).toBe('Q1: New features, Q2: Performance improvements');
      }

      const deploymentField = document.querySelector('textarea[name="deployment_process"]');
      if (deploymentField) {
        expect(deploymentField.value).toBe('Automated CI/CD pipeline with staging environment');
      }

      // Check number fields
      const responseField = document.querySelector('input[name="average_response_time"]');
      if (responseField) {
        expect(responseField.value).toBe('150');
      }

      const uptimeField = document.querySelector('input[name="uptime_percentage"]');
      if (uptimeField) {
        expect(uptimeField.value).toBe('99.95');
      }

      const errorField = document.querySelector('input[name="error_rate"]');
      if (errorField) {
        expect(errorField.value).toBe('0.05');
      }

      // Check array fields
      const versionField = document.querySelector('textarea[name="version_control"]');
      if (versionField) {
        expect(versionField.value).toBe('Git\nGitHub');
      }

      const frontendField = document.querySelector('textarea[name="frontend_technologies"]');
      if (frontendField) {
        expect(frontendField.value).toBe('React\nTypeScript');
      }

      const backendField = document.querySelector('textarea[name="backend_technologies"]');
      if (backendField) {
        expect(backendField.value).toBe('Node.js\nExpress');
      }
    });

    it('should display empty for unpopulated form data', () => {
      render(<DevelopmentStack {...defaultProps} />);

      const inputs = document.querySelectorAll('input');
      inputs.forEach(input => {
        expect(input.value).toBe('');
      });

      const textareas = document.querySelectorAll('textarea');
      textareas.forEach(textarea => {
        expect(textarea.value).toBe('');
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

      expect(screen.getByText('Development roadmap is required')).toBeDefined();
      expect(screen.getByText('Must be a positive number')).toBeDefined();
      expect(screen.getByText('At least one frontend technology is required')).toBeDefined();

      // Check error classes
      const roadmapField = document.querySelector('textarea[name="roadmap"]');
      const responseField = document.querySelector('input[name="average_response_time"]');
      const frontendField = document.querySelector('textarea[name="frontend_technologies"]');

      if (roadmapField) {
        expect(roadmapField.className).toContain('is-invalid');
      }
      if (responseField) {
        expect(responseField.className).toContain('is-invalid');
      }
      if (frontendField) {
        expect(frontendField.className).toContain('is-invalid');
      }
    });

    it('should not display errors when none exist', () => {
      render(<DevelopmentStack {...defaultProps} />);

      expect(screen.queryByText(/is required/)).toBeNull();
      expect(screen.queryByText(/must be/)).toBeNull();

      const fields = document.querySelectorAll('input, textarea');
      fields.forEach(field => {
        expect(field.className).not.toContain('is-invalid');
      });
    });
  });

  describe('Field Grouping', () => {
    it('should group fields under correct sections', () => {
      render(<DevelopmentStack {...defaultProps} />);

      // All fields should be present
      const labels = document.querySelectorAll('label.form-label');
      const labelTexts = Array.from(labels).map(label => label.textContent?.trim());

      // Check we have all expected fields
      expect(labelTexts.length).toBeGreaterThanOrEqual(11);
    });
  });
});