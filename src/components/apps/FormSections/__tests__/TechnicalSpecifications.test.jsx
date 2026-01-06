// src/components/apps/FormSections/__tests__/TechnicalSpecifications.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TechnicalSpecifications from '../TechnicalSpecifications.jsx';

describe('TechnicalSpecifications Component', () => {
  const defaultFormData = {
    compatibility: [],
    path: '',
    init: '',
    development_stack: [],
    integration_capabilities: [],
    api_documentation: '',
    security_features: [],
    regulatory_compliance: [],
    supported_browsers: [],
    database_systems: [],
    deployment_architecture: ''
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
    render(<TechnicalSpecifications {...defaultProps} />);
    expect(screen.getByText(/Technical Specifications/i)).toBeDefined();
  });

  it('should render section description', () => {
    render(<TechnicalSpecifications {...defaultProps} />);
    expect(screen.getByText(/Technical infrastructure, integration capabilities, and system requirements/)).toBeDefined();
  });

  it('should render all section subheaders', () => {
    render(<TechnicalSpecifications {...defaultProps} />);

    // Find h6 elements which are the subheaders
    const subheaders = document.querySelectorAll('h6');
    const subheaderTexts = Array.from(subheaders).map(h => h.textContent);

    expect(subheaderTexts).toContain('System Requirements');
    expect(subheaderTexts).toContain('Technology Stack');
    expect(subheaderTexts).toContain('Integration & APIs');
    expect(subheaderTexts).toContain('Security & Compliance');
  });

  it('should render all field labels', () => {
    render(<TechnicalSpecifications {...defaultProps} />);

    // Find all label elements
    const labels = document.querySelectorAll('label.form-label');
    const labelTexts = Array.from(labels).map(label => label.textContent?.trim());

    expect(labelTexts).toContain('System Compatibility');
    expect(labelTexts).toContain('Installation Path');
    expect(labelTexts).toContain('Initialization Command');
    expect(labelTexts).toContain('Development Stack');
    expect(labelTexts).toContain('Integration Capabilities');
    expect(labelTexts).toContain('API Documentation');
    expect(labelTexts).toContain('Security Features');
    expect(labelTexts).toContain('Regulatory Compliance');
    expect(labelTexts).toContain('Supported Browsers');
    expect(labelTexts).toContain('Database Systems');
    expect(labelTexts).toContain('Deployment Architecture');
  });

  it('should render correct number of form fields', () => {
    render(<TechnicalSpecifications {...defaultProps} />);

    // Count all textareas and inputs
    const textareas = document.querySelectorAll('textarea');
    const inputs = document.querySelectorAll('input[type="text"]');

    expect(textareas.length + inputs.length).toBe(11); // 9 textareas + 2 inputs
  });

  describe('Field Types', () => {
    it('should have textareas for array fields', () => {
      render(<TechnicalSpecifications {...defaultProps} />);

      // All these should be textareas (for array fields)
      const compatibilityField = document.querySelector('textarea[name="compatibility"]');
      expect(compatibilityField).toBeDefined();

      const developmentStackField = document.querySelector('textarea[name="development_stack"]');
      expect(developmentStackField).toBeDefined();

      const integrationField = document.querySelector('textarea[name="integration_capabilities"]');
      expect(integrationField).toBeDefined();

      const securityField = document.querySelector('textarea[name="security_features"]');
      expect(securityField).toBeDefined();

      const complianceField = document.querySelector('textarea[name="regulatory_compliance"]');
      expect(complianceField).toBeDefined();

      const browsersField = document.querySelector('textarea[name="supported_browsers"]');
      expect(browsersField).toBeDefined();

      const databaseField = document.querySelector('textarea[name="database_systems"]');
      expect(databaseField).toBeDefined();
    });

    it('should have text inputs for path and init fields', () => {
      render(<TechnicalSpecifications {...defaultProps} />);

      const pathField = document.querySelector('input[name="path"]');
      expect(pathField).toBeDefined();

      const initField = document.querySelector('input[name="init"]');
      expect(initField).toBeDefined();
    });

    it('should have textareas for documentation fields', () => {
      render(<TechnicalSpecifications {...defaultProps} />);

      const apiDocField = document.querySelector('textarea[name="api_documentation"]');
      expect(apiDocField).toBeDefined();

      const deploymentField = document.querySelector('textarea[name="deployment_architecture"]');
      expect(deploymentField).toBeDefined();
    });
  });

  describe('Placeholder Texts', () => {
    it('should have placeholder texts for all fields', () => {
      render(<TechnicalSpecifications {...defaultProps} />);

      const fieldsWithPlaceholders = document.querySelectorAll('[placeholder]');
      expect(fieldsWithPlaceholders.length).toBe(11);
    });

    it('should have appropriate placeholder content', () => {
      render(<TechnicalSpecifications {...defaultProps} />);

      // Check some key placeholders using query selectors
      expect(document.querySelector('[placeholder*="Windows 10+"]')).toBeDefined();
      expect(document.querySelector('[placeholder*="/usr/local/bin/app"]')).toBeDefined();
      expect(document.querySelector('[placeholder*="npm start"]')).toBeDefined();
      expect(document.querySelector('[placeholder*="React, Node.js"]')).toBeDefined();
      expect(document.querySelector('[placeholder*="REST APIs"]')).toBeDefined();
      expect(document.querySelector('[placeholder*="Describe your API endpoints"]')).toBeDefined();
      expect(document.querySelector('[placeholder*="SSL/TLS"]')).toBeDefined();
      expect(document.querySelector('[placeholder*="GDPR"]')).toBeDefined();
      expect(document.querySelector('[placeholder*="Chrome 90+"]')).toBeDefined();
      expect(document.querySelector('[placeholder*="PostgreSQL"]')).toBeDefined();
      expect(document.querySelector('[placeholder*="Describe your deployment setup"]')).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should display errors when they exist', () => {
      const errors = {
        compatibility: 'System compatibility is required',
        development_stack: 'At least one technology is required',
        api_documentation: 'API documentation cannot be empty'
      };

      render(<TechnicalSpecifications {...defaultProps} errors={errors} />);

      // Check that error messages are displayed
      expect(screen.getByText('System compatibility is required')).toBeDefined();
      expect(screen.getByText('At least one technology is required')).toBeDefined();
      expect(screen.getByText('API documentation cannot be empty')).toBeDefined();

      // Check that fields have error classes
      const compatibilityField = document.querySelector('textarea[name="compatibility"]');
      expect(compatibilityField.className).toContain('is-invalid');

      const developmentStackField = document.querySelector('textarea[name="development_stack"]');
      expect(developmentStackField.className).toContain('is-invalid');

      const apiDocField = document.querySelector('textarea[name="api_documentation"]');
      expect(apiDocField.className).toContain('is-invalid');
    });

    it('should not display errors when none exist', () => {
      render(<TechnicalSpecifications {...defaultProps} />);

      // Should not have error messages
      expect(screen.queryByText(/is required/)).toBeNull();
      expect(screen.queryByText(/cannot be empty/)).toBeNull();

      // Should not have error classes
      const fields = document.querySelectorAll('textarea, input');
      fields.forEach(field => {
        expect(field.className).not.toContain('is-invalid');
      });
    });
  });

  describe('Data Display', () => {
    it('should display populated form data', () => {
      const formDataWithValues = {
        compatibility: ['Windows 10', 'macOS 12'],
        path: '/usr/local/bin/myapp',
        init: 'npm start',
        development_stack: ['React', 'Node.js', 'PostgreSQL'],
        integration_capabilities: ['REST API', 'Webhooks'],
        api_documentation: 'Swagger documentation available',
        security_features: ['SSL', '2FA'],
        regulatory_compliance: ['GDPR', 'HIPAA'],
        supported_browsers: ['Chrome', 'Firefox'],
        database_systems: ['PostgreSQL', 'Redis'],
        deployment_architecture: 'Docker containers on AWS'
      };

      render(<TechnicalSpecifications {...defaultProps} formData={formDataWithValues} />);

      // Check that values are displayed
      const compatibilityField = document.querySelector('textarea[name="compatibility"]');
      expect(compatibilityField.value).toBe('Windows 10\nmacOS 12');

      const pathField = document.querySelector('input[name="path"]');
      expect(pathField.value).toBe('/usr/local/bin/myapp');

      const initField = document.querySelector('input[name="init"]');
      expect(initField.value).toBe('npm start');

      const developmentStackField = document.querySelector('textarea[name="development_stack"]');
      expect(developmentStackField.value).toBe('React\nNode.js\nPostgreSQL');

      const apiDocField = document.querySelector('textarea[name="api_documentation"]');
      expect(apiDocField.value).toBe('Swagger documentation available');

      const deploymentField = document.querySelector('textarea[name="deployment_architecture"]');
      expect(deploymentField.value).toBe('Docker containers on AWS');
    });
  });

  describe('Field Grouping', () => {
    it('should group fields under correct subheaders', () => {
      render(<TechnicalSpecifications {...defaultProps} />);

      // Find all h6 elements (subheaders)
      const subheaders = document.querySelectorAll('h6');
      const subheaderTexts = Array.from(subheaders).map(h => h.textContent);

      // Find all label elements
      const labels = document.querySelectorAll('label.form-label');
      const labelTexts = Array.from(labels).map(label => label.textContent?.trim());

      // Check that we have the expected structure
      expect(subheaderTexts).toContain('System Requirements');
      expect(labelTexts).toContain('System Compatibility');
      expect(labelTexts).toContain('Installation Path');
      expect(labelTexts).toContain('Initialization Command');

      expect(subheaderTexts).toContain('Technology Stack');
      expect(labelTexts).toContain('Development Stack');

      expect(subheaderTexts).toContain('Integration & APIs');
      expect(labelTexts).toContain('Integration Capabilities');
      expect(labelTexts).toContain('API Documentation');

      expect(subheaderTexts).toContain('Security & Compliance');
      expect(labelTexts).toContain('Security Features');
      expect(labelTexts).toContain('Regulatory Compliance');
      expect(labelTexts).toContain('Supported Browsers');
      expect(labelTexts).toContain('Database Systems');
      expect(labelTexts).toContain('Deployment Architecture');
    });
  });
});