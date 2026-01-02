import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GeneralInformation } from './FormSections/GeneralInformation.jsx';
import { TechnicalSpecifications } from './FormSections/TechnicalSpecifications.jsx';
import { BusinessModel } from './FormSections/BusinessModel.jsx';
import { DevelopmentStack } from './FormSections/DevelopmentStack.jsx';
import { AnalyticsMetrics } from './FormSections/AnalyticsMetrics.jsx';
import { ComplianceOperations } from './FormSections/ComplianceOperations.jsx';
import { ImpactStrategy } from './FormSections/ImpactStrategy.jsx';
import { validateForm } from './AppFormValidation.js';
import { handleGenericFormSubmit, scrollToFirstError } from '../../utils/FormSubmitHandler';

import {
  submitAppForm,
  fetchAppForEdit,
  fetchAppDetails
} from './AppFormHandlers';

// FIXED: Import from the correct location - use app-specific converter
import { convertAppData } from '../../utils/formConverters'; // From index.js
// OR if you don't have index.js yet:
// import { convertAppData } from '../utils/formConverters/AppConverter.js';

import NavBar from '../NavBar.jsx';
import Swal from 'sweetalert2';

const FIELD_GROUPS = [
  'GeneralInformation',
  'TechnicalSpecifications',
  'BusinessModel',
  'DevelopmentStack',
  'AnalyticsMetrics',
  'ComplianceOperations',
  'ImpactStrategy'
];

// Sticky Action Bar Component
const StickyActionBar = ({ onSave, onCancel, isSubmitting, isEditMode }) => (
  <div className="sticky-top bg-white shadow-sm border-bottom py-3" style={{ zIndex: 1020, top: '56px' }}>
    <div className="container-fluid">
      <div className="row align-items-center">
        <div className="col">
          <h4 className="mb-0 text-dark">
            <i className={`bi ${isEditMode ? 'bi-pencil-square' : 'bi-plus-circle'} text-primary me-2`}></i>
            {isEditMode ? 'Edit Application' : 'Create New Application'}
          </h4>
          <small className="text-muted">
            {isEditMode ? 'Update your application details and configuration' : 'Build something amazing! Fill in the details below.'}
          </small>
        </div>
        <div className="col-auto">
          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              <i className="bi bi-arrow-left me-2"></i>
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={onSave}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Saving...
                </>
              ) : (
                <>
                  <i className="bi bi-check-circle me-2"></i>
                  {isEditMode ? 'Update Application' : 'Create Application'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const EditApp = () => {
  const { jwtToken, sessionChecked } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const appId = parseInt(id || "0", 10);

  const [formData, setFormData] = useState({});
  const [releaseOptions, setReleaseOptions] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [activeSection, setActiveSection] = useState('general');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch releases (for dropdown)
  useEffect(() => {
    if (sessionChecked && !jwtToken) {
      navigate("/login");
    }
  }, [jwtToken, sessionChecked, navigate]);
  useEffect(() => {
    if (!sessionChecked || !jwtToken) return;

    fetchAppDetails(jwtToken)
      .then(data => {
        setReleaseOptions(data.release || []);
      })
      .catch(error => {
        console.error('Release fetch error:', error);
      });
  }, [jwtToken, sessionChecked]);

  // Main app data fetch
  useEffect(() => {
    if (!sessionChecked || !jwtToken) return;

    if (isNaN(appId) || appId < 0) {
      setFetchError('Invalid application ID');
      setLoading(false);
      return;
    }

    let ignore = false;

    fetchAppForEdit(appId, jwtToken)
      .then(data => {
        if (!ignore) {
          setFormData(data);
          setLoading(false);
        }
      })
      .catch(error => {
        if (!ignore) {
          console.error('Fetch app error:', error);
          setFetchError(error.message);
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [appId, jwtToken, sessionChecked]);

  const handleFormChange = (event) => {
    const { name, type, files, value, checked } = event.target;

    if (type === 'file') {
      // For file inputs, store the File object
      setFormData(prev => ({
        ...prev,
        [name]: files.length > 0 ? files[0] : null
      }));
    } else if (type === 'checkbox') {
      // For checkboxes
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'select-multiple') {
      // For multi-selects
      const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
      setFormData(prev => ({ ...prev, [name]: selectedOptions }));
    } else {
      // For all other inputs
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmitForm = async (event) => {
    setIsSubmitting(true);
    setErrors({});

    try {
      const result = await handleGenericFormSubmit({
        event,
        formId: 'edit-app-form',
        existingData: formData,
        entityId: appId,
        validateFn: (data) => validateForm(data, FIELD_GROUPS),
        convertFn: convertAppData, // FIXED: Use app-specific converter
        submitFn: (apiData, id) => submitAppForm(apiData, id, jwtToken),
        fileFields: ['logo', 'image', 'thumbnail', 'icon'],
        onSuccess: async (result, submittedData) => {
          const appName = submittedData.name || 'Application';
          const action = appId === 0 ? 'created' : 'updated';

          await Swal.fire({
            title: 'Success!',
            text: `App "${appName}" ${action} successfully`,
            icon: 'success',
            confirmButtonText: 'OK'
          });

          navigate('/apps');
        },
        onError: async (errorMessage, validationErrors) => {
          console.error('Form submission error:', errorMessage);

          if (errorMessage === 'SESSION_EXPIRED') {
            await Swal.fire({
              title: 'Session Expired',
              text: 'Your session has expired. Please log in again.',
              icon: 'warning',
              confirmButtonText: 'Go to Login'
            });
            navigate('/login');
            return;
          }

          if (validationErrors) {
            setErrors(validationErrors);
            scrollToFirstError(validationErrors);
          } else {
            await Swal.fire({
              title: 'Error!',
              text: errorMessage || 'An error occurred while saving.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        }
      });

      // If there were validation errors, they're already handled in onError
      // But we can log the result for debugging
      console.log('Form submission result:', result);

    } catch (error) {
      // This catches unexpected errors (not handled by handleGenericFormSubmit)
      console.error('Unexpected error in handleSubmitForm:', error);
      await Swal.fire({
        title: 'Unexpected Error',
        text: 'An unexpected error occurred. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Section Navigation Component
  const SectionNavigation = () => (
    <div className="col-md-3">
      <div className="card shadow-sm border-0 h-100">
        <div className="card-header bg-primary text-white">
          <h5 className="card-title mb-0">
            <i className="bi bi-layers me-2"></i>
            Application Sections
          </h5>
        </div>
        <div className="card-body p-0">
          <nav className="nav nav-pills flex-column">
            {['general', 'technical', 'business', 'development', 'analytics', 'compliance', 'impact'].map((section) => (
              <button
                key={section}
                type="button"
                className={`nav-link text-start rounded-0 border-bottom ${activeSection === section ? 'active bg-primary' : 'text-dark'}`}
                onClick={() => setActiveSection(section)}
                disabled={isSubmitting}
              >
                <i className={`bi bi-${getSectionIcon(section)} me-2`}></i>
                {getSectionTitle(section)}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );

  // Helper functions for section navigation
  const getSectionIcon = (section) => {
    const icons = {
      general: 'info-circle',
      technical: 'cpu',
      business: 'graph-up',
      development: 'code-slash',
      analytics: 'bar-chart',
      compliance: 'shield-check',
      impact: 'rocket'
    };
    return icons[section] || 'info-circle';
  };

  const getSectionTitle = (section) => {
    const titles = {
      general: 'General Information',
      technical: 'Technical Specifications',
      business: 'Business Model',
      development: 'Development Stack',
      analytics: 'Analytics & Metrics',
      compliance: 'Compliance & Operations',
      impact: 'Impact & Strategy'
    };
    return titles[section] || 'General Information';
  };

  // Form Content Component
  const FormContent = () => {
    const renderActiveSection = () => {
      const props = {
        formData,
        errors,
        handleChange: handleFormChange,
        disabled: isSubmitting || loading
      };

      switch (activeSection) {
        case 'general':
          return <GeneralInformation {...props} releaseOptions={releaseOptions} />;
        case 'technical':
          return <TechnicalSpecifications {...props} />;
        case 'business':
          return <BusinessModel {...props} />;
        case 'development':
          return <DevelopmentStack {...props} />;
        case 'analytics':
          return <AnalyticsMetrics {...props} />;
        case 'compliance':
          return <ComplianceOperations {...props} />;
        case 'impact':
          return <ImpactStrategy {...props} />;
        default:
          return <GeneralInformation {...props} releaseOptions={releaseOptions} />;
      }
    };

    return (
      <div className="col-md-9">
        <div className="card shadow-sm border-0">
          <div className="card-body">
            <form id="edit-app-form" onSubmit={handleSubmitForm}>
              {renderActiveSection()}

              {/* Hidden submit button for accessibility */}
              <button type="submit" style={{ display: 'none' }} aria-hidden="true"></button>
            </form>
          </div>
        </div>
      </div>
    );
  };

  // Error state
  if (fetchError) {
    return (
      <>
        <NavBar />
        <div className="container-lg my-4">
          <div className="card border-danger">
            <div className="card-header bg-danger text-white">
              <h4 className="card-title mb-0">
                <i className="bi bi-exclamation-triangle me-2"></i>
                Error Loading Application
              </h4>
            </div>
            <div className="card-body">
              <p className="card-text">{fetchError}</p>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-primary"
                  onClick={() => window.location.reload()}
                >
                  <i className="bi bi-arrow-clockwise me-2"></i>
                  Retry
                </button>
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => navigate('/apps')}
                >
                  <i className="bi bi-arrow-left me-2"></i>
                  Back to Apps
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Loading state
  if (loading) {
    return (
      <>
        <NavBar />
        <div className="container-lg my-4">
          <div className="card">
            <div className="card-body text-center py-5">
              <div className="spinner-border text-primary mb-3" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <h5>Loading Application</h5>
              <p className="text-muted">Preparing your workspace...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Main render
  return (
    <>
      <NavBar />
      <StickyActionBar
        onSave={handleSubmitForm}
        onCancel={() => navigate('/apps')}
        isSubmitting={isSubmitting}
        isEditMode={appId !== 0}
      />
      <div className="container-fluid" style={{ marginTop: '20px' }}>
        <div className="row">
          <SectionNavigation />
          <FormContent />
        </div>

        {/* Debug info (development only) */}
        {/* {process.env.NODE_ENV === 'development' && (
          <div className="mt-3 p-3 border rounded bg-light">
            <small className="text-muted">
              <i className="bi bi-bug me-1"></i>
              Debug: App ID: {appId} | Loading: {loading.toString()} | Submitting: {isSubmitting.toString()}
            </small>
          </div>
        )} */}
      </div>
    </>
  );
};

export { EditApp };