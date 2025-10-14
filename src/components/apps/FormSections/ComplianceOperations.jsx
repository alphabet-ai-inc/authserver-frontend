import DynamicField from './DynamicField.jsx';

export const ComplianceOperations = ({ formData, handleChange, errors }) => {
  return (
    <>
      <section className="form-section card mb-4">
        <div className="card-body">
          <h4 className="card-title mb-4">
            <i className="bi bi-shield-lock me-2"></i>
            Compliance Operations
          </h4>
          <div className="row g-3">
            <DynamicField
              name="BackupRecoveryOptions"
              label="Backup and Recovery Options"
              onChange={handleChange}
              value={formData.BackupRecoveryOptions}
              error={errors.BackupRecoveryOptions}
              type="textarea"
              placeholder="Enter backup and recovery options"
              columns={12}
              rows={4}
            />

            <DynamicField
              name="localizationSupport"
              label="Localization Support"
              onChange={handleChange}
              value={formData.localizationSupport}
              error={errors.localizationSupport}
              type="textarea"
              placeholder="Enter localization support details"
              columns={12}
              rows={4}
            />

            <DynamicField
              name="accessibilityFeatures"
              label="Accessibility Features"
              onChange={handleChange}
              value={formData.accessibilityFeatures}
              error={errors.accessibilityFeatures}
              type="textarea"
              placeholder="Enter accessibility features"
              columns={12}
              rows={4}
            />

            <DynamicField
                name="teamStructure"
                label="Team Structure"
                onChange={handleChange}
                value={formData.teamStructure}
                error={errors.teamStructure}
                type="textarea"
                placeholder="Enter team structure"
                columns={12}
                rows={4}
            />
            <DynamicField
              name="dataBackupLocation"
              label="Data Backup Location"
              onChange={handleChange}
              value={formData.dataBackupLocation}
              error={errors.dataBackupLocation}
              type="text"
              placeholder="Enter data backup location"
            />

          </div>
        </div>
      </section>
    </>
  );
};
