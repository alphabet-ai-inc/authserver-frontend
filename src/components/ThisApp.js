import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { formatUnixTimestamp } from "../utils/Unix2Ymd";
import { useHandleDelete } from "../utils/HandleDel";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";
import { NavBar } from "./NavBar";

/**
 *
 * @returns {JSX.Element} ThisApp component displaying details of a specific app.
 * Fetches app data from the backend using the app ID from URL parameters.
 * Displays app details and provides options to edit or delete the app.
 * Handles session validation and redirects to login if the JWT token is invalid.
 */
const ThisApp = () => {
  const { jwtToken, sessionChecked, setJwtToken } = useAuth();
  let { id } = useParams();

  const navigate = useNavigate();
  const [alertClassName, setAlertClassName] = useState("d-none");
  const [alertMessage, setAlertMessage] = useState("");
  const [ThisApp, setThisApp] = useState({}); // <-- Add this line

  /**
   * List of release options for the app.
   * Each option has an ID and a corresponding version value.
   * This is used to display the release version based on the app's release ID.
   * Future improvements could include fetching this list from the backend.
   */
  // const releaseOptions = [
  //   { id: "A", value: "1.0.0" },
  //   { id: "B", value: "1.0.1" },
  //   { id: "C", value: "1.0.2" },
  //   { id: "D", value: "1.1.0" },
  //   { id: "E", value: "1.2.0" },
  //   { id: "F", value: "2" },
  //   { id: "G", value: "3.0.1" },
  //   { id: "H", value: "4.1.0" },
  // ];

  // function getIndex(id) {
  //   try {
  //     return releaseOptions.findIndex((o) => o.id === id);
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }

  const handleEdit = () => {
    navigate(`/editapp/${id}`);
  };

  const handleDelete = useHandleDelete(id);

  const handleClick = (action) => () => {
    if (action === "edit") {
      handleEdit();
    }
    if (action === "delete") {
      handleDelete(); // Call the function returned by the hook
    }
  };
  /**
   * Effect to fetch app details when the component mounts or when the ID or JWT token changes.
   * Validates the JWT token and redirects to login if invalid.
   * Updates the component state with the fetched app data.
   * In the future, user validation, checking session expiration, and handling token refresh could be more robust.
   * @dependency id - The app ID from URL parameters.
   * @dependency jwtToken - The JWT token for authentication.
   */
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
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
        rel="stylesheet"
      />
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css"
      />

      <NavBar />
      <div className="card mb-3 shadow-sm">
        <div className="card-body">
          <div className={`alert ${alertClassName}`} role="alert">
            {alertMessage}
          </div>

          <h5 className="card-title">
            <i className="bi bi-box-seam me-2"></i> {ThisApp.title}
          </h5>

          {/* General Information Section */}
          <div className="section mb-4">
            <h6 className="text-muted mb-3">
              <i className="bi bi-info-circle me-2"></i>General Information
            </h6>
            <div className="row">
              <div className="col-md-6">
                <div className="card-text">
                  <i className="bi bi-file-earmark-text me-1"></i>
                  <strong>Name: </strong>
                  {ThisApp.name}
                  <br />

                  <h6 className="card-subtitle mb-2 text-muted">
                    <i className="bi bi-tag-fill me-1"></i> Release:{ThisApp.release}
                  </h6>

                  <i className="bi bi-hash me-1"></i>
                  <strong>App ID: </strong>
                  {ThisApp.id}
                  <br />
                  <i className="bi bi-calendar-plus me-1"></i>
                  <strong>Release Date: </strong>
                  {formatUnixTimestamp(ThisApp.created)}
                  <br />
                  <i className="bi bi-calendar-check me-1"></i>
                  <strong>Last Updated: </strong>
                  {formatUnixTimestamp(ThisApp.updated)}
                  <br />
                    <i className="bi bi-card-text me-1"></i>
                    <strong>Description: </strong>
                    {ThisApp.description}
                    <br />
                    <i className="bi bi-card-heading me-1"></i>
                  <strong>Positioning Statement: </strong>
                  {ThisApp.positioningStmt}
                  <br />
                    <i className="bi bi-chat-left-text me-1"></i>
                  <strong>logo: </strong>
                  {ThisApp.logo}
                  <br />
                  <i className="bi bi-globe me-1"></i>
                  <strong>Web Presence: </strong>
                  <span className="ms-2 d-block">
                    <i className="bi bi-link-45deg me-1"></i>
                    {ThisApp.web}
                    <br />
                    <i className="bi bi-link me-1"></i>
                    {ThisApp.url}
                    <br />
                    <i className="bi bi-box-arrow-up-right me-1"></i>
                    {ThisApp.landingPage}
                  </span>
                </div>
              </div>
              <div className="col-md-6">
                <p className="card-text">
                  <i className="bi bi-grid me-1"></i>
                  <strong>Category: </strong>
                  {ThisApp.category}
                  <br />
                  <i className="bi bi-windows me-1"></i>
                  <strong>Platform: </strong>
                  {ThisApp.platform}
                  <br />
                  <i className="bi bi-person-workspace me-1"></i>
                  <strong>Developer: </strong>
                  {ThisApp.developer}
                  <br />
                  <i className="bi bi-file-earmark-lock me-1"></i>
                  <strong>License: </strong>
                  {ThisApp.licenseType}
                  <br />
                  <i className="bi bi-archive me-1"></i>
                  <strong>Size: </strong>
                  {ThisApp.size}
                </p>
              </div>
            </div>
          </div>

          {/* Technical Details Section */}
          <div className="section mb-4">
            <h6 className="text-muted mb-3">
              <i className="bi bi-gear-wide-connected me-2"></i>Technical
              Specifications
            </h6>
            <div className="row">
              <div className="col-md-6">
                <p className="card-text">
                  <i className="bi bi-file-earmark-code me-1"></i>
                  <strong>Init: </strong>
                  {ThisApp.init}
                  <br />
                  <i className="bi bi-folder2-open me-1"></i>
                  <strong>Path: </strong>
                  {ThisApp.path}
                  <br />
                  <i className="bi bi-pc-display-horizontal me-1"></i>
                  <strong>Compatibility: </strong>
                  {ThisApp.compatibility}
                  <br />
                  <i className="bi bi-plug me-1"></i>
                  <strong>Integration: </strong>
                  {ThisApp.integrationCapabilities}
                </p>
              </div>
              <div className="col-md-6">
                <p className="card-text">
                  <i className="bi bi-stack me-1"></i>
                  <strong>Development Stack: </strong>
                  {ThisApp.developmentStack}
                  <br />
                  <i className="bi bi-file-text me-1"></i>
                  <strong>API Docs: </strong>
                  {ThisApp.apiDocumentation}
                  <br />
                  <i className="bi bi-shield-check me-1"></i>
                  <strong>Security: </strong>
                  {ThisApp.securityFeatures}
                  <br />
                  <i className="bi bi-clipboard-check me-1"></i>
                  <strong>Compliance: </strong>
                  {ThisApp.regulatoryCompliance}
                </p>
              </div>
            </div>
          </div>

          {/* Business Model Section */}
          <div className="section mb-4">
            <h6 className="text-muted mb-3">
              <i className="bi bi-graph-up me-2"></i>Business Model
            </h6>
            <div className="row">
              <div className="col-md-6">
                <p className="card-text">
                  <i className="bi bi-currency-dollar me-1"></i>
                  <strong>Revenue Streams: </strong>
                  {ThisApp.revenueStreams}
                  <br />
                  <i className="bi bi-people me-1"></i>
                  <strong>Customer Segments: </strong>
                  {ThisApp.customerSegments}
                  <br />
                  <i className="bi bi-shop me-1"></i>
                  <strong>Channels: </strong>
                  {ThisApp.channels}
                  <br />
                  <i className="bi bi-lightbulb me-1"></i>
                  <strong>Value Proposition: </strong>
                  {ThisApp.valueProposition}
                </p>
              </div>
              <div className="col-md-6">
                <p className="card-text">
                  <i className="bi bi-cash-coin me-1"></i>
                  <strong>Pricing: </strong>
                  {ThisApp.pricingTiers}
                  <br />
                  <i className="bi bi-diagram-3 me-1"></i>
                  <strong>Partnerships: </strong>
                  {ThisApp.partnerships}
                  <br />
                  <i className="bi bi-building me-1"></i>
                  <strong>Cost Structure: </strong>
                  {ThisApp.costStructure}
                  <br />
                  <i className="bi bi-hand-thumbs-up me-1"></i>
                  <strong>Customer Relationships: </strong>
                  {ThisApp.customerRelationships}
                  <br />
                  <i className="bi bi-trophy me-1"></i>
                  <strong>Unfair Advantage: </strong>
                  {ThisApp.unfairAdvantage}
                </p>
              </div>
            </div>
          </div>

          {/* Development & Roadmap Section */}
          <div className="section mb-4">
            <h6 className="text-muted mb-3">
              <i className="bi bi-code-square me-2"></i>Development & Roadmap
            </h6>
            <div className="row">
              <div className="col-md-6">
                <p className="card-text">
                  <i className="bi bi-kanban me-1"></i>
                  <strong>Roadmap: </strong>
                  {ThisApp.roadmap}
                  <br />
                  <i className="bi bi-git me-1"></i>
                  <strong>Version Control: </strong>
                  {ThisApp.versionControl}
                  <br />
                  <i className="bi bi-bug me-1"></i>
                  <strong>Error Rate: </strong>
                  {ThisApp.errorRate}
                </p>
              </div>
              <div className="col-md-6">
                <p className="card-text">
                  <i className="bi bi-speedometer2 me-1"></i>
                  <strong>Response Time: </strong>
                  {ThisApp.averageResponseTime}
                  <br />
                  <i className="bi bi-server me-1"></i>
                  <strong>Uptime: </strong>
                  {ThisApp.uptimePercentage}
                  <br />
                  <i className="bi bi-tools me-1"></i>
                  <strong>Maintenance: </strong>
                  {ThisApp.keyActivities}
                </p>
              </div>
            </div>
          </div>

          {/* User Metrics Section */}
          <div className="section mb-4">
            <h6 className="text-muted mb-3">
              <i className="bi bi-people me-2"></i>User Analytics
            </h6>
            <div className="row">
              <div className="col-md-6">
                <p className="card-text">
                  <i className="bi bi-person-plus me-1"></i>
                  <strong>Active Users: </strong>
                  {ThisApp.activeUsers}
                  <br />
                  <i className="bi bi-arrow-repeat me-1"></i>
                  <strong>Retention Rate: </strong>
                  {ThisApp.userRetentionRate}
                  <br />
                  <i className="bi bi-graph-up-arrow me-1"></i>
                  <strong>Acquisition Cost: </strong>
                  {ThisApp.userAcquisitionCost}
                </p>
              </div>
              <div className="col-md-6">
                <p className="card-text">
                  <i className="bi bi-pie-chart me-1"></i>
                  <strong>Churn Rate: </strong>
                  {ThisApp.churnRate}
                  <br />
                  <i className="bi bi-cash-stack me-1"></i>
                  <strong>MRR: </strong>
                  {ThisApp.monthlyRecurringRevenue}
                  <br />
                  <i className="bi bi-chat-dots me-1"></i>
                  <strong>Feedback: </strong>
                  {ThisApp.userFeedback}
                  <br />
                  <i className="bi bi-chat-dots me-1"></i>
                  <strong>Feedback: </strong>
                  {ThisApp.keyMetrics}
                </p>
              </div>
            </div>
          </div>

          {/* Operational Section */}
          <div className="section mb-4">
            <h6 className="text-muted mb-3">
              <i className="bi bi-clipboard-data me-2"></i>Operations
            </h6>
            <div className="row">
              <div className="col-md-6">
                <p className="card-text">
                  <i className="bi bi-shield-check me-1"></i>
                  <strong>Backups: </strong>
                  {ThisApp.backupRecoveryOptions}
                  <br />
                  <i className="bi bi-translate me-1"></i>
                  <strong>Localization: </strong>
                  {ThisApp.localizationSupport}
                  <br />
                  <i className="bi bi-universal-access me-1"></i>
                  <strong>Accessibility: </strong>
                  {ThisApp.accessibilityFeatures}
                </p>
              </div>
              <div className="col-md-6">
                <p className="card-text">
                  <i className="bi bi-diagram-2 me-1"></i>
                  <strong>Team Structure: </strong>
                  {ThisApp.teamStructure}
                  <br />
                  <i className="bi bi-shield-lock me-1"></i>
                  <strong>Data Backup: </strong>
                  {ThisApp.dataBackupLocation}
                </p>
              </div>
            </div>
          </div>

          {/* Impact & Strategy Section */}
          <div className="section mb-4">
            <h6 className="text-muted mb-3">
              <i className="bi bi-globe2 me-2"></i>Impact & Strategy
            </h6>
            <div className="row">
              <div className="col-md-6">
                <p className="card-text">
                  <i className="bi bi-tree me-1"></i>
                  <strong>Environmental: </strong>
                  {ThisApp.environmentalImpact}
                  <br />
                  <i className="bi bi-heart-pulse me-1"></i>
                  <strong>Social: </strong>
                  {ThisApp.socialImpact}
                  <br />
                  <i className="bi bi-lightning me-1"></i>
                  <strong>IP: </strong>
                  {ThisApp.intellectualProperty}
                </p>
              </div>
              <div className="col-md-6">
                <p className="card-text">
                  <i className="bi bi-graph-up me-1"></i>
                  <strong>Funding: </strong>
                  {ThisApp.fundingsInvestment}
                  <br />
                  <i className="bi bi-door-open me-1"></i>
                  <strong>Exit Strategy: </strong>
                  {ThisApp.exitStrategy}
                  <br />
                  <i className="bi bi-person-lines-fill me-1"></i>
                  <strong>Analytics: </strong>
                  {ThisApp.analyticsTools}
                </p>
              </div>
            </div>
          </div>

          <div className="d-flex gap-2">
            <button className="btn btn-primary" onClick={handleClick("edit")}>
              <i
                className="bi bi-pencil-square me-1"
                style={{ marginRight: 8 }}
              ></i>
              Edit App
            </button>
            {ThisApp.id > 0 && (
              <a
                href="#!"
                className="btn btn-danger"
                onClick={handleClick("delete")}
              >
                <i className="bi bi-trash me-1" style={{ marginRight: 8 }}></i>
                Delete App
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export { ThisApp };
