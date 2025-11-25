import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { formatUnixTimestamp } from "../utils/Unix2Ymd";
import { useHandleDelete } from "../utils/HandleDel";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";
import NavBar from "./NavBar";

// NEW: Sticky Action Bar Component
const StickyActionBar = ({ onEdit, onDelete, hasDelete, appName }) => (
  <div className="sticky-top bg-white shadow-sm border-bottom py-3" style={{ zIndex: 1020, top: '56px' }}>
    <div className="container-fluid">
      <div className="row align-items-center">
        <div className="col">
          <h4 className="mb-0 text-dark">
            <i className="bi bi-eye text-primary me-2"></i>
            Viewing: {appName || 'Application'}
          </h4>
          <small className="text-muted">
            Review application details and configuration
          </small>
        </div>
        <div className="col-auto">
          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => window.history.back()}
            >
              <i className="bi bi-arrow-left me-2"></i>
              Back
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={onEdit}
            >
              <i className="bi bi-pencil-square me-2"></i>
              Edit Application
            </button>
            {hasDelete && (
              <button
                type="button"
                className="btn btn-danger"
                onClick={onDelete}
              >
                <i className="bi bi-trash me-2"></i>
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ThisApp = () => {
  const { jwtToken, sessionChecked, setJwtToken } = useAuth();
  let { id } = useParams();
  const navigate = useNavigate();
  const [alertClassName, setAlertClassName] = useState("d-none");
  const [alertMessage, setAlertMessage] = useState("");
  const [thisApp, setThisApp] = useState({}); // Fixed: lowercase to match usage

  const handleEdit = () => {
    navigate(`/editapp/${id}`);
  };

  const handleDelete = useHandleDelete(id);

  // Helper function to render array fields as bullet lists
  const renderArrayField = (fieldValue) => {
    if (!fieldValue) return "Not specified";

    if (Array.isArray(fieldValue)) {
      if (fieldValue.length === 0) return "Not specified";
      return (
        <ul className="list-unstyled mb-0">
          {fieldValue.map((item, index) => (
            <li key={index} className="d-flex align-items-start mb-1">
              <span className="text-primary me-2">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    }

    return String(fieldValue);
  };

  useEffect(() => {
    if (!jwtToken) {
      Swal.fire({
        title: "Token Invalid",
        text: "Your token is invalid. Please log in again.",
        icon: "warning",
        confirmButtonText: "OK",
      }).then(() => {
        setJwtToken(null);
        navigate("/login");
      });
      return;
    }

    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "Bearer " + jwtToken);

    const requestOptions = {
      method: "GET",
      headers: headers,
    };

    fetch(`${process.env.REACT_APP_BACKEND_URL}/apps/${id}`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setAlertClassName("alert-danger");
          setAlertMessage(data.message);
        } else {
          setThisApp(data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id, jwtToken, sessionChecked, navigate, setJwtToken]);

  return (
    <>
      <NavBar />
      <StickyActionBar
        onEdit={handleEdit}
        onDelete={handleDelete}
        hasDelete={thisApp.id > 0}
        appName={thisApp.title || thisApp.name}
      />
      <div className="container-fluid" style={{ marginTop: '20px' }}>
        <div className="card mb-3 shadow-sm border-0">
          <div className="card-body p-4">
            <div className={`alert ${alertClassName} mb-4`} role="alert">
              {alertMessage}
            </div>

            {/* Header Section */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h2 className="card-title mb-1 text-primary">
                  <i className="bi bi-box-seam me-2"></i> {thisApp.title || thisApp.name}
                </h2>
                <div className="d-flex flex-wrap gap-2 mt-2">
                  <span className="badge bg-primary">{thisApp.category}</span>
                  <span className="badge bg-secondary">
                    {renderArrayField(thisApp.platform)}
                  </span>
                  <span className="badge bg-success">Release: {thisApp.release}</span>
                </div>
              </div>
              <div className="text-end">
                <div className="text-muted small">App ID: {thisApp.id}</div>
                <div className="text-muted small">Last Updated: {formatUnixTimestamp(thisApp.updated)}</div>
              </div>
            </div>

            {/* Description Section */}
            <div className="section mb-4 p-3 bg-light rounded">
              <p className="mb-2"><strong>Description:</strong></p>
              <p className="text-muted mb-3">{thisApp.description || "Not specified"}</p>
              <p className="mb-1"><strong>Positioning Statement:</strong></p>
              {/* FIXED: positioning_stmt vs positioning_stmt */}
              <p className="text-muted">{thisApp.positioning_stmt || "Not specified"}</p>
            </div>

            {/* General Information Section */}
            <div className="section mb-4">
              <div className="section-header bg-primary text-white p-3 rounded-top">
                <h5 className="mb-0">
                  <i className="bi bi-info-circle me-2"></i>General Information
                </h5>
              </div>
              <div className="section-content p-3 border border-top-0 rounded-bottom">
                <div className="row">
                  <div className="col-md-6">
                    <div className="info-item mb-3">
                      <div className="info-label text-muted small">Name</div>
                      <div className="info-value">{thisApp.name}</div>
                    </div>
                    <div className="info-item mb-3">
                      <div className="info-label text-muted small">Release</div>
                      <div className="info-value">{thisApp.release}</div>
                    </div>
                    <div className="info-item mb-3">
                      <div className="info-label text-muted small">Created Date</div>
                      <div className="info-value">{formatUnixTimestamp(thisApp.created)}</div>
                    </div>
                    <div className="info-item mb-3">
                      <div className="info-label text-muted small">Developer</div>
                      <div className="info-value">{thisApp.developer}</div>
                    </div>
                    <div className="info-item mb-3">
                      <div className="info-label text-muted small">License</div>
                      <div className="info-value">{thisApp.license_type}</div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="info-item mb-3">
                      <div className="info-label text-muted small">Size (bytes)</div>
                      <div className="info-value">{thisApp.size}</div>
                    </div>
                    <div className="info-item mb-3">
                      <div className="info-label text-muted small">Web Presence</div>
                      <div className="info-value">
                        <div><i className="bi bi-link-45deg me-1"></i>{thisApp.web || "Not specified"}</div>
                        <div><i className="bi bi-link me-1"></i>{thisApp.url || "Not specified"}</div>
                        <div><i className="bi bi-box-arrow-up-right me-1"></i>{thisApp.landing_page || "Not specified"}</div>
                      </div>
                    </div>
                    {/* ADDED: Missing fields */}
                    <div className="info-item mb-3">
                      <div className="info-label text-muted small">Path</div>
                      <div className="info-value">{thisApp.path || "Not specified"}</div>
                    </div>
                    <div className="info-item mb-3">
                      <div className="info-label text-muted small">Init Command</div>
                      <div className="info-value">{thisApp.init || "Not specified"}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Technical Details Section */}
            <div className="section mb-4">
              <div className="section-header bg-info text-white p-3 rounded-top">
                <h5 className="mb-0">
                  <i className="bi bi-gear-wide-connected me-2"></i>Technical Specifications
                </h5>
              </div>
              <div className="section-content p-3 border border-top-0 rounded-bottom">
                <div className="row">
                  <div className="col-md-6">
                    <div className="info-item mb-3">
                      <div className="info-label text-muted small">Compatibility</div>
                      <div className="info-value">{renderArrayField(thisApp.compatibility)}</div>
                    </div>
                    <div className="info-item mb-3">
                      <div className="info-label text-muted small">Integration Capabilities</div>
                      <div className="info-value">{renderArrayField(thisApp.integration_capabilities)}</div>
                    </div>
                    <div className="info-item mb-3">
                      <div className="info-label text-muted small">Development Stack</div>
                      <div className="info-value">{renderArrayField(thisApp.development_stack)}</div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="info-item mb-3">
                      <div className="info-label text-muted small">API Documentation</div>
                      <div className="info-value">{thisApp.api_documentation || "Not specified"}</div>
                    </div>
                    <div className="info-item mb-3">
                      <div className="info-label text-muted small">Security Features</div>
                      <div className="info-value">{renderArrayField(thisApp.security_features)}</div>
                    </div>
                    <div className="info-item mb-3">
                      <div className="info-label text-muted small">Regulatory Compliance</div>
                      <div className="info-value">{renderArrayField(thisApp.regulatory_compliance)}</div>
                    </div>
                    {/* ADDED: Missing technical fields */}
                    <div className="info-item mb-3">
                      <div className="info-label text-muted small">Version Control</div>
                      <div className="info-value">{thisApp.version_control || "Not specified"}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Model Section */}
            <div className="section mb-4">
              <div className="section-header bg-success text-white p-3 rounded-top">
                <h5 className="mb-0">
                  <i className="bi bi-graph-up me-2"></i>Business Model
                </h5>
              </div>
              <div className="section-content p-3 border border-top-0 rounded-bottom">
                <div className="row">
                  <div className="col-md-6">
                    <div className="info-item mb-3">
                      <div className="info-label text-muted small">Revenue Streams</div>
                      <div className="info-value">{renderArrayField(thisApp.revenue_streams)}</div>
                    </div>
                    <div className="info-item mb-3">
                      <div className="info-label text-muted small">Customer Segments</div>
                      <div className="info-value">{renderArrayField(thisApp.customer_segments)}</div>
                    </div>
                    <div className="info-item mb-3">
                      <div className="info-label text-muted small">Channels</div>
                      <div className="info-value">{renderArrayField(thisApp.channels)}</div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    {/* FIXED: value_proposition vs value_propositions */}
                    <div className="info-item mb-3">
                      <div className="info-label text-muted small">Value Proposition</div>
                      <div className="info-value">{thisApp.value_proposition || "Not specified"}</div>
                    </div>
                    <div className="info-item mb-3">
                      <div className="info-label text-muted small">Pricing Tiers</div>
                      <div className="info-value">{renderArrayField(thisApp.pricing_tiers)}</div>
                    </div>
                    <div className="info-item mb-3">
                      <div className="info-label text-muted small">Partnerships</div>
                      <div className="info-value">{renderArrayField(thisApp.partnerships)}</div>
                    </div>
                    <div className="info-item mb-3">
                      <div className="info-label text-muted small">Cost Structure</div>
                      <div className="info-value">{renderArrayField(thisApp.cost_structure)}</div>
                    </div>
                    <div className="info-item mb-3">
                      <div className="info-label text-muted small">Customer Relationships</div>
                      <div className="info-value">{renderArrayField(thisApp.customer_relationships)}</div>
                    </div>
                    {/* FIXED: unfair_advantage vs unfair_advantages */}
                    <div className="info-item mb-3">
                      <div className="info-label text-muted small">Unfair Advantage</div>
                      <div className="info-value">{thisApp.unfair_advantage || "Not specified"}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Metrics Section */}
            <div className="section mb-4">
              <div className="section-header bg-warning text-dark p-3 rounded-top">
                <h5 className="mb-0">
                  <i className="bi bi-speedometer2 me-2"></i>Performance Metrics
                </h5>
              </div>
              <div className="section-content p-3 border border-top-0 rounded-bottom">
                <div className="row">
                  <div className="col-md-6">
                    <div className="info-item mb-3">
                      <div className="info-label text-muted small">Error Rate</div>
                      <div className="info-value">{thisApp.error_rate || "Not specified"}</div>
                    </div>
                    <div className="info-item mb-3">
                      <div className="info-label text-muted small">Average Response Time</div>
                      <div className="info-value">{thisApp.average_response_time || "Not specified"}</div>
                    </div>
                    <div className="info-item mb-3">
                      <div className="info-label text-muted small">Uptime Percentage</div>
                      <div className="info-value">{thisApp.uptime_percentage || "Not specified"}</div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="info-item mb-3">
                      <div className="info-label text-muted small">Key Activities</div>
                      <div className="info-value">{renderArrayField(thisApp.key_activities)}</div>
                    </div>
                    <div className="info-item mb-3">
                      <div className="info-label text-muted small">Roadmap</div>
                      <div className="info-value">{thisApp.roadmap || "Not specified"}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* User Metrics Section */}
            <div className="section mb-4">
              <div className="section-header bg-purple text-white p-3 rounded-top">
                <h5 className="mb-0">
                  <i className="bi bi-people me-2"></i>Analytics & Metrics
                </h5>
              </div>
              <div className="section-content p-3 border border-top-0 rounded-bottom">
                <div className="row">
                  <div className="col-md-6">
                    <div className="info-item mb-3">
                      <div className="info-label text-muted small">Active Users</div>
                      <div className="info-value">{thisApp.active_users || "Not specified"}</div>
                    </div>
                    <div className="info-item mb-3">
                      <div className="info-label text-muted small">User Retention Rate</div>
                      <div className="info-value">{thisApp.user_retention_rate || "Not specified"}</div>
                    </div>
                    <div className="info-item mb-3">
                      <div className="info-label text-muted small">User Acquisition Cost</div>
                      <div className="info-value">{thisApp.user_acquisition_cost || "Not specified"}</div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="info-item mb-3">
                      <div className="info-label text-muted small">Churn Rate</div>
                      <div className="info-value">{thisApp.churn_rate || "Not specified"}</div>
                    </div>
                    <div className="info-item mb-3">
                      <div className="info-label text-muted small">Monthly Recurring Revenue</div>
                      <div className="info-value">{thisApp.monthly_recurring_revenue || "Not specified"}</div>
                    </div>
                    <div className="info-item mb-3">
                      <div className="info-label text-muted small">User Feedback</div>
                      <div className="info-value">{renderArrayField(thisApp.user_feedback)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Operational Section */}
            <div className="section mb-4">
              <div className="section-header bg-secondary text-white p-3 rounded-top">
                <h5 className="mb-0">
                  <i className="bi bi-clipboard-data me-2"></i>Compliance & Operations
                </h5>
              </div>
              <div className="section-content p-3 border border-top-0 rounded-bottom">
                <div className="row">
                  <div className="col-md-6">
                    <div className="info-item mb-3">
                      <div className="info-label text-muted small">Backup & Recovery Options</div>
                      <div className="info-value">{renderArrayField(thisApp.backup_recovery_options)}</div>
                    </div>
                    <div className="info-item mb-3">
                      <div className="info-label text-muted small">Localization Support</div>
                      <div className="info-value">{renderArrayField(thisApp.localization_support)}</div>
                    </div>
                    <div className="info-item mb-3">
                      <div className="info-label text-muted small">Accessibility Features</div>
                      <div className="info-value">{renderArrayField(thisApp.accessibility_features)}</div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="info-item mb-3">
                      <div className="info-label text-muted small">Team Structure</div>
                      <div className="info-value">{renderArrayField(thisApp.team_structure)}</div>
                    </div>
                    <div className="info-item mb-3">
                      <div className="info-label text-muted small">Data Backup Location</div>
                      <div className="info-value">{thisApp.data_backup_location || "Not specified"}</div>
                    </div>
                    {/* ADDED: Missing operational fields */}
                    <div className="info-item mb-3">
                      <div className="info-label text-muted small">Analytics Tools</div>
                      <div className="info-value">{renderArrayField(thisApp.analytics_tools)}</div>
                    </div>
                    <div className="info-item mb-3">
                      <div className="info-label text-muted small">Key Metrics</div>
                      <div className="info-value">{renderArrayField(thisApp.key_metrics)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Impact & Strategy Section */}
            <div className="section mb-4">
              <div className="section-header bg-dark text-white p-3 rounded-top">
                <h5 className="mb-0">
                  <i className="bi bi-globe2 me-2"></i>Impact & Strategy
                </h5>
              </div>
              <div className="section-content p-3 border border-top-0 rounded-bottom">
                <div className="row">
                  <div className="col-md-6">
                    <div className="info-item mb-3">
                      <div className="info-label text-muted small">Environmental Impact</div>
                      <div className="info-value">{thisApp.environmental_impact || "Not specified"}</div>
                    </div>
                    <div className="info-item mb-3">
                      <div className="info-label text-muted small">Social Impact</div>
                      <div className="info-value">{thisApp.social_impact || "Not specified"}</div>
                    </div>
                    <div className="info-item mb-3">
                      <div className="info-label text-muted small">Intellectual Property</div>
                      <div className="info-value">{renderArrayField(thisApp.intellectual_property)}</div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    {/* FIXED: fundings_investment vs funding_investment */}
                    <div className="info-item mb-3">
                      <div className="info-label text-muted small">Funding Investment</div>
                      <div className="info-value">{thisApp.fundings_investment || "Not specified"}</div>
                    </div>
                    <div className="info-item mb-3">
                      <div className="info-label text-muted small">Exit Strategy</div>
                      <div className="info-value">{thisApp.exit_strategy || "Not specified"}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Removed duplicate action buttons since we have them in sticky bar */}
          </div>
        </div>
      </div>

      <style>{`
        .bg-purple {
          background-color: #6f42c1 !important;
        }

        .section-header {
          font-weight: 600;
        }

        .section-content {
          background-color: #f8f9fa;
        }

        .info-item {
          border-bottom: 1px solid #e9ecef;
          padding-bottom: 0.75rem;
        }

        .info-item:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .info-label {
          font-size: 0.875rem;
          margin-bottom: 0.25rem;
        }

        .info-value {
          font-weight: 500;
        }

        .card-title {
          font-weight: 700;
        }
      `}</style>
    </>
  );
};

export { ThisApp };

// import { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { formatUnixTimestamp } from "../utils/Unix2Ymd";
// import { useHandleDelete } from "../utils/HandleDel";
// import { useAuth } from "../context/AuthContext";
// import Swal from "sweetalert2";
// import NavBar from "./NavBar";

// const ThisApp = () => {
//   const { jwtToken, sessionChecked, setJwtToken } = useAuth();
//   let { id } = useParams();
//   const navigate = useNavigate();
//   const [alertClassName, setAlertClassName] = useState("d-none");
//   const [alertMessage, setAlertMessage] = useState("");
//   const [ThisApp, setThisApp] = useState({});

//   const handleEdit = () => {
//     navigate(`/editapp/${id}`);
//   };

//   const handleDelete = useHandleDelete(id);

//   const handleClick = (action) => () => {
//     if (action === "edit") {
//       handleEdit();
//     }
//     if (action === "delete") {
//       handleDelete();
//     }
//   };

//   // Helper function to render array fields as bullet lists
//   const renderArrayField = (fieldValue) => {
//     if (!fieldValue) return "Not specified";

//     if (Array.isArray(fieldValue)) {
//       if (fieldValue.length === 0) return "Not specified";
//       return (
//         <ul className="list-unstyled mb-0">
//           {fieldValue.map((item, index) => (
//             <li key={index} className="d-flex align-items-start mb-1">
//               <span className="text-primary me-2">•</span>
//               <span>{item}</span>
//             </li>
//           ))}
//         </ul>
//       );
//     }

//     return String(fieldValue);
//   };

//   // Helper function to render text fields with proper formatting

//   useEffect(() => {
//     if (!jwtToken) {
//       Swal.fire({
//         title: "Token Invalid",
//         text: "Your token is invalid. Please log in again.",
//         icon: "warning",
//         confirmButtonText: "OK",
//       }).then(() => {
//         setJwtToken(null);
//         navigate("/login");
//       });
//       return;
//     }

//     const headers = new Headers();
//     headers.append("Content-Type", "application/json");
//     headers.append("Authorization", "Bearer " + jwtToken);

//     const requestOptions = {
//       method: "GET",
//       headers: headers,
//     };

//     fetch(`${process.env.REACT_APP_BACKEND_URL}/apps/${id}`, requestOptions)
//       .then((response) => response.json())
//       .then((data) => {
//         if (data.error) {
//           setAlertClassName("alert-danger");
//           setAlertMessage(data.message);
//         } else {
//           setThisApp(data);
//         }
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }, [id, jwtToken, sessionChecked, navigate, setJwtToken]);

//   return (
//     <>
//       <NavBar />
//       <div className="container-fluid my-4">
//         <div className="card mb-3 shadow-sm border-0">
//           <div className="card-body p-4">
//             <div className={`alert ${alertClassName} mb-4`} role="alert">
//               {alertMessage}
//             </div>

//             {/* Header Section */}
//             <div className="d-flex justify-content-between align-items-center mb-4">
//               <div>
//                 <h2 className="card-title mb-1 text-primary">
//                   <i className="bi bi-box-seam me-2"></i> {ThisApp.title || ThisApp.name}
//                 </h2>
//                 <div className="d-flex flex-wrap gap-2 mt-2">
//                   <span className="badge bg-primary">{ThisApp.category}</span>
//                   <span className="badge bg-secondary">
//                     {renderArrayField(ThisApp.platform)}
//                   </span>
//                   <span className="badge bg-success">Release: {ThisApp.release}</span>
//                 </div>
//               </div>
//               <div className="text-end">
//                 <div className="text-muted small">App ID: {ThisApp.id}</div>
//                 <div className="text-muted small">Last Updated: {formatUnixTimestamp(ThisApp.updated)}</div>
//               </div>
//             </div>

//             {/* Description Section */}
//             <div className="section mb-4 p-3 bg-light rounded">
//               <p className="mb-2"><strong>Description:</strong></p>
//               <p className="text-muted mb-3">{ThisApp.description || "Not specified"}</p>
//               <p className="mb-1"><strong>Positioning Statement:</strong></p>
//               <p className="text-muted">{ThisApp.positioning_stmt || "Not specified"}</p>
//             </div>

//             {/* General Information Section */}
//             <div className="section mb-4">
//               <div className="section-header bg-primary text-white p-3 rounded-top">
//                 <h5 className="mb-0">
//                   <i className="bi bi-info-circle me-2"></i>General Information
//                 </h5>
//               </div>
//               <div className="section-content p-3 border border-top-0 rounded-bottom">
//                 <div className="row">
//                   <div className="col-md-6">
//                     <div className="info-item mb-3">
//                       <div className="info-label text-muted small">Name</div>
//                       <div className="info-value">{ThisApp.name}</div>
//                     </div>
//                     <div className="info-item mb-3">
//                       <div className="info-label text-muted small">Release Date</div>
//                       <div className="info-value">{formatUnixTimestamp(ThisApp.created)}</div>
//                     </div>
//                     <div className="info-item mb-3">
//                       <div className="info-label text-muted small">Developer</div>
//                       <div className="info-value">{ThisApp.developer}</div>
//                     </div>
//                     <div className="info-item mb-3">
//                       <div className="info-label text-muted small">License</div>
//                       <div className="info-value">{ThisApp.license_type}</div>
//                     </div>
//                   </div>
//                   <div className="col-md-6">
//                     <div className="info-item mb-3">
//                       <div className="info-label text-muted small">Size</div>
//                       <div className="info-value">{ThisApp.size}</div>
//                     </div>
//                     <div className="info-item mb-3">
//                       <div className="info-label text-muted small">Web Presence</div>
//                       <div className="info-value">
//                         <div><i className="bi bi-link-45deg me-1"></i>{ThisApp.web || "Not specified"}</div>
//                         <div><i className="bi bi-link me-1"></i>{ThisApp.url || "Not specified"}</div>
//                         <div><i className="bi bi-box-arrow-up-right me-1"></i>{ThisApp.landing_page || "Not specified"}</div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Technical Details Section */}
//             <div className="section mb-4">
//               <div className="section-header bg-info text-white p-3 rounded-top">
//                 <h5 className="mb-0">
//                   <i className="bi bi-gear-wide-connected me-2"></i>Technical Specifications
//                 </h5>
//               </div>
//               <div className="section-content p-3 border border-top-0 rounded-bottom">
//                 <div className="row">
//                   <div className="col-md-6">
//                     <div className="info-item mb-3">
//                       <div className="info-label text-muted small">Init Command</div>
//                       <div className="info-value">{ThisApp.init}</div>
//                     </div>
//                     <div className="info-item mb-3">
//                       <div className="info-label text-muted small">Path</div>
//                       <div className="info-value">{ThisApp.path}</div>
//                     </div>
//                     <div className="info-item mb-3">
//                       <div className="info-label text-muted small">Compatibility</div>
//                       <div className="info-value">{renderArrayField(ThisApp.compatibility)}</div>
//                     </div>
//                     <div className="info-item mb-3">
//                       <div className="info-label text-muted small">Integration Capabilities</div>
//                       <div className="info-value">{renderArrayField(ThisApp.integration_capabilities)}</div>
//                     </div>
//                   </div>
//                   <div className="col-md-6">
//                     <div className="info-item mb-3">
//                       <div className="info-label text-muted small">Development Stack</div>
//                       <div className="info-value">{renderArrayField(ThisApp.development_stack)}</div>
//                     </div>
//                     <div className="info-item mb-3">
//                       <div className="info-label text-muted small">API Documentation</div>
//                       <div className="info-value">{ThisApp.api_documentation}</div>
//                     </div>
//                     <div className="info-item mb-3">
//                       <div className="info-label text-muted small">Security Features</div>
//                       <div className="info-value">{renderArrayField(ThisApp.security_features)}</div>
//                     </div>
//                     <div className="info-item mb-3">
//                       <div className="info-label text-muted small">Regulatory Compliance</div>
//                       <div className="info-value">{renderArrayField(ThisApp.regulatory_compliance)}</div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Business Model Section */}
//             <div className="section mb-4">
//               <div className="section-header bg-success text-white p-3 rounded-top">
//                 <h5 className="mb-0">
//                   <i className="bi bi-graph-up me-2"></i>Business Model
//                 </h5>
//               </div>
//               <div className="section-content p-3 border border-top-0 rounded-bottom">
//                 <div className="row">
//                   <div className="col-md-6">
//                     <div className="info-item mb-3">
//                       <div className="info-label text-muted small">Revenue Streams</div>
//                       <div className="info-value">{renderArrayField(ThisApp.revenue_streams)}</div>
//                     </div>
//                     <div className="info-item mb-3">
//                       <div className="info-label text-muted small">Customer Segments</div>
//                       <div className="info-value">{renderArrayField(ThisApp.customer_segments)}</div>
//                     </div>
//                     <div className="info-item mb-3">
//                       <div className="info-label text-muted small">Channels</div>
//                       <div className="info-value">{renderArrayField(ThisApp.channels)}</div>
//                     </div>
//                     <div className="info-item mb-3">
//                       <div className="info-label text-muted small">Value Propositions</div>
//                       <div className="info-value">{ThisApp.value_propositions}</div>
//                     </div>
//                   </div>
//                   <div className="col-md-6">
//                     <div className="info-item mb-3">
//                       <div className="info-label text-muted small">Pricing Tiers</div>
//                       <div className="info-value">{renderArrayField(ThisApp.pricing_tiers)}</div>
//                     </div>
//                     <div className="info-item mb-3">
//                       <div className="info-label text-muted small">Partnerships</div>
//                       <div className="info-value">{renderArrayField(ThisApp.partnerships)}</div>
//                     </div>
//                     <div className="info-item mb-3">
//                       <div className="info-label text-muted small">Cost Structure</div>
//                       <div className="info-value">{renderArrayField(ThisApp.cost_structure)}</div>
//                     </div>
//                     <div className="info-item mb-3">
//                       <div className="info-label text-muted small">Customer Relationships</div>
//                       <div className="info-value">{renderArrayField(ThisApp.customer_relationships)}</div>
//                     </div>
//                     <div className="info-item mb-3">
//                       <div className="info-label text-muted small">Unfair Advantages</div>
//                       <div className="info-value">{ThisApp.unfair_advantages}</div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Development & Roadmap Section */}
//             <div className="section mb-4">
//               <div className="section-header bg-warning text-dark p-3 rounded-top">
//                 <h5 className="mb-0">
//                   <i className="bi bi-code-square me-2"></i>Development & Roadmap
//                 </h5>
//               </div>
//               <div className="section-content p-3 border border-top-0 rounded-bottom">
//                 <div className="row">
//                   <div className="col-md-6">
//                     <div className="info-item mb-3">
//                       <div className="info-label text-muted small">Roadmap</div>
//                       <div className="info-value">{ThisApp.roadmap}</div>
//                     </div>
//                     <div className="info-item mb-3">
//                       <div className="info-label text-muted small">Version Control</div>
//                       <div className="info-value">{ThisApp.version_control}</div>
//                     </div>
//                     <div className="info-item mb-3">
//                       <div className="info-label text-muted small">Error Rate</div>
//                       <div className="info-value">{ThisApp.error_rate}</div>
//                     </div>
//                   </div>
//                   <div className="col-md-6">
//                     <div className="info-item mb-3">
//                       <div className="info-label text-muted small">Average Response Time</div>
//                       <div className="info-value">{ThisApp.average_response_time}</div>
//                     </div>
//                     <div className="info-item mb-3">
//                       <div className="info-label text-muted small">Uptime Percentage</div>
//                       <div className="info-value">{ThisApp.uptime_percentage}</div>
//                     </div>
//                     <div className="info-item mb-3">
//                       <div className="info-label text-muted small">Key Activities</div>
//                       <div className="info-value">{renderArrayField(ThisApp.key_activities)}</div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* User Metrics Section */}
//             <div className="section mb-4">
//               <div className="section-header bg-purple text-white p-3 rounded-top">
//                 <h5 className="mb-0">
//                   <i className="bi bi-people me-2"></i>Analytics & Metrics
//                 </h5>
//               </div>
//               <div className="section-content p-3 border border-top-0 rounded-bottom">
//                 <div className="row">
//                   <div className="col-md-6">
//                     <div className="info-item mb-3">
//                       <div className="info-label text-muted small">Active Users</div>
//                       <div className="info-value">{ThisApp.active_users}</div>
//                     </div>
//                     <div className="info-item mb-3">
//                       <div className="info-label text-muted small">User Retention Rate</div>
//                       <div className="info-value">{ThisApp.user_retention_rate}</div>
//                     </div>
//                     <div className="info-item mb-3">
//                       <div className="info-label text-muted small">User Acquisition Cost</div>
//                       <div className="info-value">{ThisApp.user_acquisition_cost}</div>
//                     </div>
//                   </div>
//                   <div className="col-md-6">
//                     <div className="info-item mb-3">
//                       <div className="info-label text-muted small">Churn Rate</div>
//                       <div className="info-value">{ThisApp.churn_rate}</div>
//                     </div>
//                     <div className="info-item mb-3">
//                       <div className="info-label text-muted small">Monthly Recurring Revenue</div>
//                       <div className="info-value">{ThisApp.monthly_recurring_revenue}</div>
//                     </div>
//                     <div className="info-item mb-3">
//                       <div className="info-label text-muted small">User Feedback</div>
//                       <div className="info-value">{ThisApp.user_feedback}</div>
//                     </div>
//                     <div className="info-item mb-3">
//                       <div className="info-label text-muted small">Key Metrics</div>
//                       <div className="info-value">{renderArrayField(ThisApp.key_metrics)}</div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Operational Section */}
//             <div className="section mb-4">
//               <div className="section-header bg-secondary text-white p-3 rounded-top">
//                 <h5 className="mb-0">
//                   <i className="bi bi-clipboard-data me-2"></i>Compliance & Operations
//                 </h5>
//               </div>
//               <div className="section-content p-3 border border-top-0 rounded-bottom">
//                 <div className="row">
//                   <div className="col-md-6">
//                     <div className="info-item mb-3">
//                       <div className="info-label text-muted small">Backup & Recovery Options</div>
//                       <div className="info-value">{ThisApp.backup_recovery_options}</div>
//                     </div>
//                     <div className="info-item mb-3">
//                       <div className="info-label text-muted small">Localization Support</div>
//                       <div className="info-value">{renderArrayField(ThisApp.localization_support)}</div>
//                     </div>
//                     <div className="info-item mb-3">
//                       <div className="info-label text-muted small">Accessibility Features</div>
//                       <div className="info-value">{renderArrayField(ThisApp.accessibility_features)}</div>
//                     </div>
//                   </div>
//                   <div className="col-md-6">
//                     <div className="info-item mb-3">
//                       <div className="info-label text-muted small">Team Structure</div>
//                       <div className="info-value">{ThisApp.team_structure}</div>
//                     </div>
//                     <div className="info-item mb-3">
//                       <div className="info-label text-muted small">Data Backup Location</div>
//                       <div className="info-value">{ThisApp.data_backup_location}</div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Impact & Strategy Section */}
//             <div className="section mb-4">
//               <div className="section-header bg-dark text-white p-3 rounded-top">
//                 <h5 className="mb-0">
//                   <i className="bi bi-globe2 me-2"></i>Impact & Strategy
//                 </h5>
//               </div>
//               <div className="section-content p-3 border border-top-0 rounded-bottom">
//                 <div className="row">
//                   <div className="col-md-6">
//                     <div className="info-item mb-3">
//                       <div className="info-label text-muted small">Environmental Impact</div>
//                       <div className="info-value">{ThisApp.environmental_impact}</div>
//                     </div>
//                     <div className="info-item mb-3">
//                       <div className="info-label text-muted small">Social Impact</div>
//                       <div className="info-value">{ThisApp.social_impact}</div>
//                     </div>
//                     <div className="info-item mb-3">
//                       <div className="info-label text-muted small">Intellectual Property</div>
//                       <div className="info-value">{ThisApp.intellectual_property}</div>
//                     </div>
//                   </div>
//                   <div className="col-md-6">
//                     <div className="info-item mb-3">
//                       <div className="info-label text-muted small">Funding Investment</div>
//                       <div className="info-value">{ThisApp.funding_investment}</div>
//                     </div>
//                     <div className="info-item mb-3">
//                       <div className="info-label text-muted small">Exit Strategy</div>
//                       <div className="info-value">{ThisApp.exit_strategy}</div>
//                     </div>
//                     <div className="info-item mb-3">
//                       <div className="info-label text-muted small">Analytics Tools</div>
//                       <div className="info-value">{renderArrayField(ThisApp.analytics_tools)}</div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="d-flex gap-2 mt-4">
//               <button className="btn btn-primary" onClick={handleClick("edit")}>
//                 <i className="bi bi-pencil-square me-2"></i>
//                 Edit App
//               </button>
//               {ThisApp.id > 0 && (
//                 <button className="btn btn-danger" onClick={handleClick("delete")}>
//                   <i className="bi bi-trash me-2"></i>
//                   Delete App
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       <style>{`
//         .bg-purple {
//           background-color: #6f42c1 !important;
//         }

//         .section-header {
//           font-weight: 600;
//         }

//         .section-content {
//           background-color: #f8f9fa;
//         }

//         .info-item {
//           border-bottom: 1px solid #e9ecef;
//           padding-bottom: 0.75rem;
//         }

//         .info-item:last-child {
//           border-bottom: none;
//           padding-bottom: 0;
//         }

//         .info-label {
//           font-size: 0.875rem;
//           margin-bottom: 0.25rem;
//         }

//         .info-value {
//           font-weight: 500;
//         }

//         .card-title {
//           font-weight: 700;
//         }
//       `}</style>
//     </>
//   );
// };

// export { ThisApp };