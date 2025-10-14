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
                    name="versioncontrol"
                    label="Version Control"
                    onChange={handleChange}
                    value={formData.versioncontrol}
                    error={errors.versioncontrol}
                    colWidth={12}
                    type="textarea"
                    rows={5}
                />
                <DynamicField
                    name="errorrate"
                    label="Error Rate"
                    onChange={handleChange}
                    value={formData.errorrate}
                    error={errors.errorrate}
                    colWidth={12}
                    type="textarea"
                    rows={5}
                />
                <DynamicField
                    name="averageresponsetime"
                    label="Average Response Time"
                    onChange={handleChange}
                    value={formData.averageresponsetime}
                    error={errors.averageresponsetime}
                    type="numeric"
                />

                <DynamicField
                    name="uptime"
                    label="Uptime percentage"
                    onChange={handleChange}
                    value={formData.uptimepercentage}
                    error={errors.uptimepercentage}
                    type="numeric"
                />

                <DynamicField
                    name="keyactivities"
                    label="Key Activities"
                    onChange={handleChange}
                    value={stringArrayToTextareaValue(formData.keyActivities)}
                    error={errors.keyActivities}
                    colWidth={12}
                    type="textarea"
                    rows={5}
                />
            </div>
        </div>
    </section>
);