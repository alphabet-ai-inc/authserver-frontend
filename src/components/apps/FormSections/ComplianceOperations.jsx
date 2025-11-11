import DynamicField from './DynamicField.jsx';

export const ComplianceOperations = ({ formData, handleChange, errors }) => {
  return (
    <section className="form-section card mb-4 border-0 shadow-sm">
      <div className="card-header bg-light border-0">
        <h4 className="card-title mb-0">
          <i className="bi bi-shield-check text-primary me-2"></i>
          Compliance & Operations
        </h4>
        <p className="text-muted mb-0 mt-1 small">
          Security, accessibility, team structure, and operational compliance requirements
        </p>
      </div>

      <div className="card-body">
        <div className="row g-4">
          {/* Security & Data Protection */}
          <div className="col-12">
            <h6 className="border-bottom pb-2 mb-3 text-muted">
              <i className="bi bi-shield-lock me-2"></i>
              Security & Data Protection
            </h6>
          </div>

          <DynamicField
            type="textarea"
            name="backup_recovery_options"
            label="Backup & Recovery Procedures"
            onChange={handleChange}
            value={formData.backup_recovery_options}
            error={errors.backup_recovery_options}
            placeholder="Describe your data backup frequency, recovery procedures, and disaster recovery plans..."
            rows={4}
            colWidth={12}
          />

          <DynamicField
            type="text"
            name="data_backup_location"
            label="Data Backup Location"
            onChange={handleChange}
            value={formData.data_backup_location}
            error={errors.data_backup_location}
            placeholder="e.g., AWS S3, Google Cloud Storage, On-premise servers..."
            colWidth={6}
          />

          {/* Compliance & Accessibility */}
          <div className="col-12 mt-4">
            <h6 className="border-bottom pb-2 mb-3 text-muted">
              <i className="bi bi-person-check me-2"></i>
              Compliance & Accessibility
            </h6>
          </div>

          <DynamicField
            type="array"
            name="localization_support"
            label="Localization & Language Support"
            onChange={handleChange}
            value={formData.localization_support}
            error={errors.localization_support}
            placeholder="English, Spanish, French, German, Japanese..."
            colWidth={6}
          />

          <DynamicField
            type="array"
            name="accessibility_features"
            label="Accessibility Features"
            onChange={handleChange}
            value={formData.accessibility_features}
            error={errors.accessibility_features}
            placeholder="Screen reader support, Keyboard navigation, High contrast mode..."
            colWidth={6}
          />

          {/* Team & Operations */}
          <div className="col-12 mt-4">
            <h6 className="border-bottom pb-2 mb-3 text-muted">
              <i className="bi bi-people me-2"></i>
              Team & Operations
            </h6>
          </div>

          <DynamicField
            type="textarea"
            name="team_structure"
            label="Team Structure & Responsibilities"
            onChange={handleChange}
            value={formData.team_structure}
            error={errors.team_structure}
            placeholder="Describe your team organization, roles, and operational responsibilities..."
            rows={4}
            colWidth={12}
          />

          {/* Additional Compliance Fields */}
          <DynamicField
            type="array"
            name="compliance_standards"
            label="Compliance Standards"
            onChange={handleChange}
            value={formData.compliance_standards}
            error={errors.compliance_standards}
            placeholder="GDPR, HIPAA, SOC2, PCI-DSS, ISO 27001..."
            colWidth={12}
          />

          <DynamicField
            type="textarea"
            name="security_protocols"
            label="Security Protocols"
            onChange={handleChange}
            value={formData.security_protocols}
            error={errors.security_protocols}
            placeholder="Describe your security measures, encryption standards, and access controls..."
            rows={3}
            colWidth={12}
          />

          <DynamicField
            type="array"
            name="supported_regions"
            label="Supported Regions/Countries"
            onChange={handleChange}
            value={formData.supported_regions}
            error={errors.supported_regions}
            placeholder="United States, European Union, Canada, Australia..."
            colWidth={12}
          />
        </div>
      </div>
    </section>
  );
};