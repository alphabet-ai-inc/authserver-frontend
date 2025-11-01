import DynamicField from "./DynamicField.jsx";
import { stringArrayToTextareaValue, textareaValueToStringArray } from '../../../utils/ArrayHandler.js';
export const GeneralInformation = ({
  formData,
  handleChange,
  errors,
  releaseOptions
}) => (
  <section className="form-section card mb-4">
    <div className="card-body">
      <h4 className="card-title mb-4">
        <i className="bi bi-info-circle me-2"></i>
        General Information
      </h4>

      <div className="row g-3">
        <DynamicField
          name="id"
          label="Application ID"
          type="number"
          value={formData.id}
          colswidth={6}
          disabled
          readOnly
          required
        />

        <DynamicField
          name="name"
          label="Application Name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          required
          colswidth={6}
        />

        <DynamicField
          name="release"
          label="Release Version"
          type="select"
          options={releaseOptions}
          value={formData.release}
          onChange={handleChange}
          error={errors.release}
          required
          colswidth={12}
        />

        <DynamicField
          name="description"
          label="Description"
          type="textarea"
          rows={3}
          value={formData.description}
          onChange={handleChange}
          error={errors.description}
          colswidth={12}
        />

        <DynamicField
          name="title"
          label="Title"
          value={formData.title}
          onChange={handleChange}
          error={errors.title}
          colswidth={12}
        />

        <DynamicField
          name="positioning_stmt"
          label="Positioning Statement"
          type="textarea"
          rows={3}
          value={formData.positioning_stmt}
          onChange={handleChange}
          error={errors.positioning_stmt}
          colswidth={12}
        />

        <DynamicField
          name="logo"
          label="Logo"
          type="file"
          accept="image/*"
          value={formData.logo}
          onChange={handleChange}
          error={errors.logo}
        />

        <DynamicField
          name="category"
          label="Category"
          value={formData.category}
          onChange={handleChange}
          error={errors.category}
          colswidth={12}
        />

        <DynamicField
          name="platform"
          label="Platforms"
          type="textarea"
          rows={3}
          value={stringArrayToTextareaValue(formData.platform)}
          onChange={(event) => {
            try {
              const arrayValue = textareaValueToStringArray(event.target.value);
              handleChange({ target: { name: 'platform', value: arrayValue } });
            } catch (err) {
              handleChange({ target: { name: 'platform', value: formData.platform } });
              alert(err.message);
            }
          }}
          error={errors.platform}
          colswidth={12}
        />

        <DynamicField
          name="developer"
          label="Developer"
          value={formData.developer}
          onChange={handleChange}
          error={errors.developer}
          colswidth={12}
        />

        <DynamicField
          name="license_type"
          label="License Type"
          value={formData.license_type}
          onChange={handleChange}
          error={errors.license_type}
          colswidth={12}
        />

        <DynamicField
          name="size"
          label="Size (MB)"
          type="number"
          value={formData.size}
          onChange={handleChange}
          error={errors.size}
        />

        <DynamicField
          name="web"
          label="Website"
          value={formData.web}
          onChange={handleChange}
          error={errors.web}
          colswidth={12}
        />

        <DynamicField
          name="url"
          label="URL"
          value={formData.url}
          onChange={handleChange}
          error={errors.url}
          colswidth={12}
        />

        <DynamicField
          name="landing_page"
          label="Landing Page"
          value={formData.landing_page}
          onChange={handleChange}
          error={errors.landing_page}
          colswidth={12}
        />

        <DynamicField
          name="created"
          label="Creation Date"
          type="date"
          readOnly
          value={formData.created}
          onChange={handleChange}
          error={errors.created}
        />

        <DynamicField
          name="updated"
          label="Release Date"
          type="date"
          readOnly
          value={formData.updated}
          onChange={handleChange}
          error={errors.updated}
        />
      </div>
    </div>
  </section>
);
