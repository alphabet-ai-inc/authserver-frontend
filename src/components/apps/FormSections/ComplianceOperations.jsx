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
              name="backup_recovery_options"
              label="Backup and Recovery Options"
              onChange={handleChange}
              value={formData.backup_recovery_options}
              error={errors.backup_recovery_options}
              type="textarea"
              placeholder="Enter backup and recovery options"
              columns={12}
              rows={4}
            />

            <DynamicField
              name="localization_support"
              label="Localization Support"
              onChange={handleChange}
              value={formData.localization_support}
              error={errors.localization_support}
              type="textarea"
              placeholder="Enter localization support details"
              columns={12}
              rows={4}
            />

            <DynamicField
              name="accessibility_features"
              label="Accessibility Features"
              onChange={handleChange}
              value={formData.accessibility_features}
              error={errors.accessibility_features}
              type="textarea"
              placeholder="Enter accessibility features"
              columns={12}
              rows={4}
            />

            <DynamicField
                name="team_structure"
                label="Team Structure"
                onChange={handleChange}
                value={formData.team_structure}
                error={errors.team_structure}
                type="textarea"
                placeholder="Enter team structure"
                columns={12}
                rows={4}
            />
            <DynamicField
              name="data_backup_location"
              label="Data Backup Location"
              onChange={handleChange}
              value={formData.data_backup_location}
              error={errors.data_backup_location}
              type="text"
              placeholder="Enter data backup location"
            />

          </div>
        </div>
      </section>
    </>
  );
};
