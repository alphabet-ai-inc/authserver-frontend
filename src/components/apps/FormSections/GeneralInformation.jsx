import DynamicField from "./DynamicField.jsx";
import { stringArrayToTextareaValue, textareaValueToStringArray } from '../../../utils/ArrayHandler.js';
import { dateToUnixBigInt } from "../../../utils/Unix2Ymd.js";

// import { stringArrayToTextareaValue } from '../../../utils/ArrayHandler.js';
export const GeneralInformation = ({ formData, handleChange, errors, releaseOptions }) => (
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
          value={formData.id}
          colWidth={6}
          disabled
          readOnly
        />

        <DynamicField
          name="name"
          label="Application Name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          required
          colWidth={6}
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
          colWidth={12}
        />

        <DynamicField
          name="description"
          label="Description"
          type="textarea"
          rows={3}
          value={formData.description}
          onChange={handleChange}
          error={errors.description}
          colWidth={12}
        />

        <DynamicField
          name="title"
          label="Title"
          value={formData.title}
          onChange={handleChange}
          error={errors.title}
          colWidth={12}
        />

        <DynamicField
          name="positioning_stmt"
          label="Positioning Statement"
          type="textarea"
          rows={3}
          value={formData.positioning_stmt}
          onChange={handleChange}
          error={errors.positioning_stmt}
          colWidth={12}
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
          colWidth={12}
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
          // value={formData.platform}
          // onChange={handleChange}
          error={errors.platform}
          colWidth={12}
        />

        <DynamicField
          name="developer"
          label="Developer"
          value={formData.developer}
          onChange={handleChange}
          error={errors.developer}
          colWidth={12}
        />

        <DynamicField
          name="license"
          label="License Type"
          value={formData.license}
          onChange={handleChange}
          error={errors.license}
          colWidth={12}
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
          name="website"
          label="Website"
          value={formData.website}
          onChange={handleChange}
          error={errors.website}
          colWidth={12}
        />

        <DynamicField
          name="url"
          label="URL"
          value={formData.url}
          onChange={handleChange}
          error={errors.url}
          colWidth={12}
        />

        <DynamicField
          name="landingpage"
          label="Landing Page"
          value={formData.landingpage}
          onChange={handleChange}
          error={errors.landingpage}
          colWidth={12}
        />

        <DynamicField
          name="created"
          label="Creation Date"
          type="date"
          value={formData.created}
          onChange={(event) => {
            try {
              const unixTime = dateToUnixBigInt(event.target.value);
              handleChange({ target: { name: 'updated', value: unixTime } });
            } catch (err) {
              handleChange({ target: { name: 'updated', value: formData.updated } });
              alert(err.message);
            }
          }}
          error={errors.created}
        />

        <DynamicField
          name="updated"
          label="Release Date"
          type="date"
          value={formData.updated}
          onChange={(event) => {
            try {
              const unixTime = dateToUnixBigInt(event.target.value);
              handleChange({ target: { name: 'updated', value: unixTime } });
            } catch (err) {
              handleChange({ target: { name: 'updated', value: formData.updated } });
              alert(err.message);
            }
          }}
          error={errors.updated}
        />

      </div>
    </div>
  </section>
);
