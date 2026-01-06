// src/components/apps/FormSections/__tests__/ComplianceOperations.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ComplianceOperations from '../ComplianceOperations.jsx'; // Use default import

describe('ComplianceOperations Component', () => {
  const defaultFormData = {
    backup_recovery_options: '',
    data_backup_location: '',
    localization_support: [],
    accessibility_features: [],
    team_structure: '',
    compliance_standards: [],
    security_protocols: '',
    supported_regions: []
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
    render(<ComplianceOperations {...defaultProps} />);
    expect(screen.getByText('Compliance & Operations')).toBeDefined();
  });

  it('should render section description', () => {
    render(<ComplianceOperations {...defaultProps} />);
    expect(screen.getByText(/Security, accessibility, team structure, and operational compliance requirements/)).toBeDefined();
  });

  it('should render all section subheaders', () => {
    render(<ComplianceOperations {...defaultProps} />);

    // Find h6 elements (subheaders)
    const subheaders = document.querySelectorAll('h6');
    const subheaderTexts = Array.from(subheaders).map(h => h.textContent);

    expect(subheaderTexts).toContain('Security & Data Protection');
    expect(subheaderTexts).toContain('Compliance & Accessibility');
    expect(subheaderTexts).toContain('Team & Operations');
  });

  it('should render all field labels', () => {
    render(<ComplianceOperations {...defaultProps} />);

    // Find all label elements
    const labels = document.querySelectorAll('label.form-label');
    const labelTexts = Array.from(labels).map(label => label.textContent?.trim());

    expect(labelTexts).toContain('Backup & Recovery Procedures');
    expect(labelTexts).toContain('Data Backup Location');
    expect(labelTexts).toContain('Localization & Language Support');
    expect(labelTexts).toContain('Accessibility Features');
    expect(labelTexts).toContain('Team Structure & Responsibilities');
    expect(labelTexts).toContain('Compliance Standards');
    expect(labelTexts).toContain('Security Protocols');
    expect(labelTexts).toContain('Supported Regions/Countries');
  });

  it('should render correct number of form fields', () => {
    render(<ComplianceOperations {...defaultProps} />);

    // Count all textareas, inputs, and other form elements
    const textareas = document.querySelectorAll('textarea');
    const inputs = document.querySelectorAll('input[type="text"], input[type="text"]:not([type])');

    expect(textareas.length + inputs.length).toBe(8);
  });

  describe('Field Types', () => {
    it('should have textareas for text fields', () => {
      render(<ComplianceOperations {...defaultProps} />);

      // Check that these fields are textareas
      const backupField = document.querySelector('textarea[name="backup_recovery_options"]');
      const teamField = document.querySelector('textarea[name="team_structure"]');
      const securityField = document.querySelector('textarea[name="security_protocols"]');

      expect(backupField).toBeDefined();
      expect(teamField).toBeDefined();
      expect(securityField).toBeDefined();
    });

    it('should have text input for Data Backup Location', () => {
      render(<ComplianceOperations {...defaultProps} />);

      const locationField = document.querySelector('input[name="data_backup_location"]');
      expect(locationField).toBeDefined();
      expect(locationField.type).toBe('text');
    });

    it('should have textareas for array fields (localization, accessibility, compliance, regions)', () => {
      render(<ComplianceOperations {...defaultProps} />);

      const localizationField = document.querySelector('textarea[name="localization_support"]');
      const accessibilityField = document.querySelector('textarea[name="accessibility_features"]');
      const complianceField = document.querySelector('textarea[name="compliance_standards"]');
      const regionsField = document.querySelector('textarea[name="supported_regions"]');

      expect(localizationField).toBeDefined();
      expect(accessibilityField).toBeDefined();
      expect(complianceField).toBeDefined();
      expect(regionsField).toBeDefined();
    });
  });

  describe('Layout', () => {
    it('should have correct Bootstrap column classes', () => {
      render(<ComplianceOperations {...defaultProps} />);

      // Find parent divs with col-* classes
      const col12Divs = document.querySelectorAll('.col-md-12');
      const col6Divs = document.querySelectorAll('.col-md-6');

      // Count should match expected layout
      expect(col12Divs.length).toBe(5); // Full width fields
      expect(col6Divs.length).toBe(3); // Half width fields
    });
  });

  describe('Placeholder Texts', () => {
    it('should have placeholder texts for all fields', () => {
      render(<ComplianceOperations {...defaultProps} />);

      const fieldsWithPlaceholders = document.querySelectorAll('[placeholder]');
      expect(fieldsWithPlaceholders.length).toBe(8);
    });

    it('should have appropriate placeholder content', () => {
      render(<ComplianceOperations {...defaultProps} />);

      // Check placeholders using query selectors
      expect(document.querySelector('[placeholder*="Describe your data backup frequency"]')).toBeDefined();
      expect(document.querySelector('[placeholder*="e.g., AWS S3, Google Cloud Storage"]')).toBeDefined();
      expect(document.querySelector('[placeholder*="English, Spanish, French"]')).toBeDefined();
      expect(document.querySelector('[placeholder*="Screen reader support"]')).toBeDefined();
      expect(document.querySelector('[placeholder*="Describe your team organization"]')).toBeDefined();
      expect(document.querySelector('[placeholder*="GDPR, HIPAA, SOC2"]')).toBeDefined();
      expect(document.querySelector('[placeholder*="Describe your security measures"]')).toBeDefined();
      expect(document.querySelector('[placeholder*="United States, European Union"]')).toBeDefined();
    });
  });

  describe('Textarea Rows', () => {
    it('should have rows attribute for textarea fields', () => {
      render(<ComplianceOperations {...defaultProps} />);

      const textareas = document.querySelectorAll('textarea');
      textareas.forEach(textarea => {
        expect(textarea.hasAttribute('rows')).toBe(true);
      });
    });

    it('should have correct rows values', () => {
      render(<ComplianceOperations {...defaultProps} />);

      const textareas = document.querySelectorAll('textarea');
      const rowsValues = Array.from(textareas).map(ta => ta.getAttribute('rows'));

      // Should have some rows=4 and some rows=3
      rowsValues.forEach(rows => {
        expect(rows === '3' || rows === '4').toBe(true);
      });
    });
  });

  describe('Data Display', () => {
    it('should display populated form data', () => {
      const formDataWithValues = {
        backup_recovery_options: 'Daily backups to AWS S3 with 30-day retention',
        data_backup_location: 'AWS S3 us-east-1',
        localization_support: ['English', 'Spanish', 'French'],
        accessibility_features: ['Screen reader', 'Keyboard navigation'],
        team_structure: '5 developers, 2 QA, 1 DevOps',
        compliance_standards: ['GDPR', 'HIPAA'],
        security_protocols: 'AES-256 encryption, 2FA required',
        supported_regions: ['US', 'EU', 'Canada']
      };

      render(<ComplianceOperations {...defaultProps} formData={formDataWithValues} />);

      // Check textarea values
      const backupField = document.querySelector('textarea[name="backup_recovery_options"]');
      expect(backupField.value).toBe('Daily backups to AWS S3 with 30-day retention');

      const teamField = document.querySelector('textarea[name="team_structure"]');
      expect(teamField.value).toBe('5 developers, 2 QA, 1 DevOps');

      const securityField = document.querySelector('textarea[name="security_protocols"]');
      expect(securityField.value).toBe('AES-256 encryption, 2FA required');

      // Check input value
      const locationField = document.querySelector('input[name="data_backup_location"]');
      expect(locationField.value).toBe('AWS S3 us-east-1');

      // Check array fields (should be newline separated)
      const localizationField = document.querySelector('textarea[name="localization_support"]');
      expect(localizationField.value).toBe('English\nSpanish\nFrench');

      const accessibilityField = document.querySelector('textarea[name="accessibility_features"]');
      expect(accessibilityField.value).toBe('Screen reader\nKeyboard navigation');

      const complianceField = document.querySelector('textarea[name="compliance_standards"]');
      expect(complianceField.value).toBe('GDPR\nHIPAA');

      const regionsField = document.querySelector('textarea[name="supported_regions"]');
      expect(regionsField.value).toBe('US\nEU\nCanada');
    });

    it('should display empty for unpopulated form data', () => {
      render(<ComplianceOperations {...defaultProps} />);

      // Check all textareas are empty
      const textareas = document.querySelectorAll('textarea');
      textareas.forEach(textarea => {
        expect(textarea.value).toBe('');
      });

      // Check all inputs are empty
      const inputs = document.querySelectorAll('input[type="text"]');
      inputs.forEach(input => {
        expect(input.value).toBe('');
      });
    });
  });

  describe('Error Handling', () => {
    it('should display errors when they exist', () => {
      const errors = {
        backup_recovery_options: 'Backup procedures are required',
        compliance_standards: 'At least one compliance standard must be selected'
      };

      render(<ComplianceOperations {...defaultProps} errors={errors} />);

      // Check error messages
      expect(screen.getByText('Backup procedures are required')).toBeDefined();
      expect(screen.getByText('At least one compliance standard must be selected')).toBeDefined();

      // Check error classes on fields
      const backupField = document.querySelector('textarea[name="backup_recovery_options"]');
      expect(backupField.className).toContain('is-invalid');

      const complianceField = document.querySelector('textarea[name="compliance_standards"]');
      expect(complianceField.className).toContain('is-invalid');
    });

    it('should not display errors when none exist', () => {
      render(<ComplianceOperations {...defaultProps} />);

      // Should not have error messages
      expect(screen.queryByText(/is required/)).toBeNull();
      expect(screen.queryByText(/must be selected/)).toBeNull();

      // Should not have error classes
      const fields = document.querySelectorAll('textarea, input');
      fields.forEach(field => {
        expect(field.className).not.toContain('is-invalid');
      });
    });
  });

  describe('Field Grouping', () => {
    it('should group fields under correct subheaders', () => {
      render(<ComplianceOperations {...defaultProps} />);

      // All fields should be present
      const labels = document.querySelectorAll('label.form-label');
      const labelTexts = Array.from(labels).map(label => label.textContent?.trim());

      expect(labelTexts).toContain('Backup & Recovery Procedures');
      expect(labelTexts).toContain('Data Backup Location');
      expect(labelTexts).toContain('Localization & Language Support');
      expect(labelTexts).toContain('Accessibility Features');
      expect(labelTexts).toContain('Team Structure & Responsibilities');
      expect(labelTexts).toContain('Compliance Standards');
      expect(labelTexts).toContain('Security Protocols');
      expect(labelTexts).toContain('Supported Regions/Countries');
    });
  });
});