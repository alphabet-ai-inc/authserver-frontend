import DynamicField from "./DynamicField.jsx";
import { stringArrayToTextareaValue } from '../../../utils/ArrayHandler.js';

export const DevelopmentStack = ({ formData, handleChange, errors }) => (
    <section className="form-section card mb-4">
        <div className="card-body">
            <h4 className="card-title mb-4">
                <i className="bi bi-lightning-charge me-2"></i>
                Development Stack
            </h4>
            <div className="row g-3">
                <DynamicField
                    name="roadmap"
                    label="Roadmap"
                    onChange={handleChange}
                    value={formData.roadmap}
                    error={errors.roadmap   }
                    colWidth={12}
                    type="textarea"
                    rows={5}
                />
                <DynamicField
                    name="version_control"
                    label="Version Control"
                    onChange={handleChange}
                    value={formData.version_control}
                    error={errors.version_control}
                    colWidth={12}
                    type="textarea"
                    rows={5}
                />
                <DynamicField
                    name="error_rate"
                    label="Error Rate"
                    onChange={handleChange}
                    value={formData.error_rate}
                    error={errors.error_rate}
                    colWidth={12}
                    type="textarea"
                    rows={5}
                />
                <DynamicField
                    name="average_response_time"
                    label="Average Response Time"
                    onChange={handleChange}
                    value={formData.average_response_time}
                    error={errors.average_response_time}
                    type="numeric"
                />

                <DynamicField
                    name="uptime_percentage"
                    label="Uptime percentage"
                    onChange={handleChange}
                    value={formData.uptime_percentage}
                    error={errors.uptime_percentage}
                    type="numeric"
                />

                <DynamicField
                    name="key_activities"
                    label="Key Activities"
                    onChange={handleChange}
                    value={stringArrayToTextareaValue(formData.key_activities)}
                    error={errors.key_activities}
                    colWidth={12}
                    type="textarea"
                    rows={5}
                />
            </div>
        </div>
    </section>
);