import DynamicField from "../../DynamicField.jsx";
// import { COMPANY_OPTIONS } from "../../../config/selectOptions.js";
import { DBSAUTH_ID } from "../../../config/selectOptions.js";

export const UserSystemIntegration = ({ formData, errors }) => (
  <section className="form-section card mb-4 border-0 shadow-sm">
    <div className="card-header bg-light border-0">
      <h4 className="card-title mb-0">
        <i className="bi bi-graph-up text-primary me-2"></i>
        Business Model
      </h4>
      <p className="text-muted mb-0 mt-1 small">
        Define your business strategy, revenue streams, and customer approach
      </p>
    </div>

    <div className="card-body">
      <div className="row g-4">
        {/* Revenue Streams - Using the new array type */}
        <DynamicField
          type="select"
          id="dbsauth_id"
          name="dbsauth_id"
          label="Database Authorizations"
          value={formData.dbsauth_id}
          error={errors.dbsauth_id}
          options={DBSAUTH_ID}
          placeholder="Select the authorized database"
          colWidth={12}
        />

        <DynamicField
          type="select"
          id="company_id"
          name="company_id"
          label="Company"
          value={formData.company_id}
          error={errors.company_id}
          placeholder="Select the company to which the user remains"
          colWidth={3}
        />

      </div>
    </div>
  </section>
);
export default UserSystemIntegration;