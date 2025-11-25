import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GeneralInformation } from './apps/FormSections/GeneralInformation.jsx';
import { TechnicalSpecifications } from './apps/FormSections/TechnicalSpecifications.jsx';
import { BusinessModel } from './apps/FormSections/BusinessModel.jsx';
import { DevelopmentStack } from './apps/FormSections/DevelopmentStack.jsx';
import { AnalyticsMetrics } from './apps/FormSections/AnalyticsMetrics.jsx';
import { ComplianceOperations } from './apps/FormSections/ComplianceOperations.jsx';
import { ImpactStrategy } from './apps/FormSections/ImpactStrategy.jsx';
import { validateForm } from './apps/AppFormValidation.js';
import { submitAppForm } from './apps/AppFormHandlers';
import { convertFormDataForAPI } from './apps/FormSections/FormDataConverter';
import NavBar from './NavBar.jsx';
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

const cleanFormData = (data) => {
  if (!data || typeof data !== 'object') {
    console.warn('Invalid data passed to cleanFormData:', data);
    return {};
  }

  const cleaned = { ...data };
  const fileFields = ['logo', 'image', 'thumbnail', 'icon'];

  fileFields.forEach(field => {
    if (cleaned[field]) {
      try {
        if (typeof cleaned[field] === 'string') {
          if (!cleaned[field].startsWith('http') && !cleaned[field].startsWith('data:')) {
            cleaned[field] = null;
          }
        } else if (!(cleaned[field] instanceof File)) {
          cleaned[field] = null;
        }
      } catch (error) {
        console.warn(`Error cleaning field ${field}:`, error);
        cleaned[field] = null;
      }
    }
  });

  return cleaned;
};

// NEW: Sticky Action Bar Component
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
                  <span className="spinner-border spinner-border-sm me-2"></span>
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
  const [isSubmitting, setIsSubmitting] = useState(false); // NEW: Loading state for submit

  const fetchReleases = useCallback(async (token) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/releases`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to fetch releases');
      const data = await response.json();
      return (data || []).map(item => ({
        value: item.value || '',
        label: item.label || item.value || '',
      }));
    } catch (error) {
      console.error('Error fetching releases:', error);
      throw error;
    }
  }, []);

  const fetchAppData = useCallback(async (token, id) => {
    try {
      if (id === 0) {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/newapp`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) throw new Error('Failed to fetch app details');
        return await response.json();
      } else {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/apps/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch app details: ${response.status} ${errorText}`);
        }
        return await response.json();
      }
    } catch (error) {
      console.error("Error in fetchAppData:", error);
      throw error;
    }
  }, []);

  // Releases fetch
  useEffect(() => {
    if (!sessionChecked || !jwtToken) return;

    fetchReleases(jwtToken)
      .then(setReleaseOptions)
      .catch(error => {
        console.error('Release fetch error:', error);
      });
  }, [jwtToken, sessionChecked, fetchReleases]);

  // Main app data fetch
  useEffect(() => {
    if (!sessionChecked || !jwtToken) return;

    if (isNaN(appId) || appId < 0) {
      setFetchError('Invalid application ID');
      setLoading(false);
      return;
    }

    let ignore = false;

    fetchAppData(jwtToken, appId)
      .then(data => {
        if (!ignore) {
          setFormData(cleanFormData(data));
          setLoading(false);
        }
      })
      .catch(error => {
        if (!ignore) {
          setFetchError(error.message);
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [appId, jwtToken, sessionChecked, fetchAppData]);

  const handleFormChange = (event) => {
    const { name, type, files } = event.target;

    // For file inputs, use the File object
    if (type === 'file') {
      setFormData(prev => ({ ...prev, [name]: files[0] || null }));
    }
  };

  // NEW: Updated handleSubmitForm with loading state
  const handleSubmitForm = async (event) => {
    if (event) event.preventDefault();

    setIsSubmitting(true);

    try {
      // Get current values directly from the form
      const formElement = document.getElementById('edit-app-form');
      const currentFormData = new FormData(formElement);

      // Convert FormData to object
      const formValues = {};
      for (let [key, value] of currentFormData.entries()) {
        // Handle multiple values
        if (formValues[key]) {
          if (Array.isArray(formValues[key])) {
            formValues[key].push(value);
          } else {
            formValues[key] = [formValues[key], value];
          }
        } else {
          formValues[key] = value;
        }
      }

      // Merge current form values with existing formData, but prioritize form values
      const submissionData = {
        ...formData,          // Existing data (includes id if editing)
        ...formValues         // Current form values override existing data
      };

      // Ensure ID is included for updates
      if (appId !== 0) {
        submissionData.id = appId;
      }

      console.log('Final submission data:', submissionData);

      const validationErrors = validateForm(submissionData, FIELD_GROUPS);
      setErrors(validationErrors);

      if (Object.keys(validationErrors).length > 0) {
        setIsSubmitting(false);
        return;
      }

      // Convert form data to proper API types before submission
      const apiData = convertFormDataForAPI(submissionData, appId === 0);
      console.log('API data after conversion:', apiData);

      await submitAppForm(apiData, appId, jwtToken);

      const appName = submissionData.name || 'Application';
      const action = appId === 0 ? 'created' : 'updated';

      await Swal.fire({
        title: 'Success!',
        text: `App "${appName}" ${action} successfully`,
        icon: 'success',
        confirmButtonText: 'OK'
      });

      navigate('/apps');
    } catch (error) {
      if (error.message === 'SESSION_EXPIRED') {
        await Swal.fire({
          title: 'Session Expired',
          text: 'Your session has expired. Please log in again.',
          icon: 'warning',
          confirmButtonText: 'Go to Login'
        });
        navigate('/login');
        return;
      }

      console.error('Form submission error:', error);
      let errorMessage = 'An error occurred while saving the application.';
      if (error.message.includes('Server error:')) {
        errorMessage = `Server error: ${error.message.split('Server error:')[1]}`;
      }

      await Swal.fire({
        title: 'Error!',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // NEW: Handler for sticky action bar
  const handleSaveFromActionBar = () => {
    handleSubmitForm();
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
            <button
              type="button"
              className={`nav-link text-start rounded-0 border-bottom ${activeSection === 'general' ? 'active bg-primary' : 'text-dark'}`}
              onClick={() => setActiveSection('general')}
            >
              <i className="bi bi-info-circle me-2"></i>
              General Information
            </button>
            <button
              type="button"
              className={`nav-link text-start rounded-0 border-bottom ${activeSection === 'technical' ? 'active bg-primary' : 'text-dark'}`}
              onClick={() => setActiveSection('technical')}
            >
              <i className="bi bi-cpu me-2"></i>
              Technical Specifications
            </button>
            <button
              type="button"
              className={`nav-link text-start rounded-0 border-bottom ${activeSection === 'business' ? 'active bg-primary' : 'text-dark'}`}
              onClick={() => setActiveSection('business')}
            >
              <i className="bi bi-graph-up me-2"></i>
              Business Model
            </button>
            <button
              type="button"
              className={`nav-link text-start rounded-0 border-bottom ${activeSection === 'development' ? 'active bg-primary' : 'text-dark'}`}
              onClick={() => setActiveSection('development')}
            >
              <i className="bi bi-code-slash me-2"></i>
              Development Stack
            </button>
            <button
              type="button"
              className={`nav-link text-start rounded-0 border-bottom ${activeSection === 'analytics' ? 'active bg-primary' : 'text-dark'}`}
              onClick={() => setActiveSection('analytics')}
            >
              <i className="bi bi-bar-chart me-2"></i>
              Analytics & Metrics
            </button>
            <button
              type="button"
              className={`nav-link text-start rounded-0 border-bottom ${activeSection === 'compliance' ? 'active bg-primary' : 'text-dark'}`}
              onClick={() => setActiveSection('compliance')}
            >
              <i className="bi bi-shield-check me-2"></i>
              Compliance & Operations
            </button>
            <button
              type="button"
              className={`nav-link text-start rounded-0 ${activeSection === 'impact' ? 'active bg-primary' : 'text-dark'}`}
              onClick={() => setActiveSection('impact')}
            >
              <i className="bi bi-rocket me-2"></i>
              Impact & Strategy
            </button>
          </nav>
        </div>
      </div>
    </div>
  );

  // UPDATED: Form Content Component (removed bottom buttons)
  const FormContent = () => {
    const renderActiveSection = () => {
      switch (activeSection) {
        case 'general':
          return (
            <GeneralInformation
              formData={formData}
              handleChange={handleFormChange}
              errors={errors}
              releaseOptions={releaseOptions}
            />
          );
        case 'technical':
          return (
            <TechnicalSpecifications
              formData={formData}
              errors={errors}
            />
          );
        case 'business':
          return (
            <BusinessModel
              formData={formData}
              errors={errors}
            />
          );
        case 'development':
          return (
            <DevelopmentStack
              formData={formData}
              errors={errors}
            />
          );
        case 'analytics':
          return (
            <AnalyticsMetrics
              formData={formData}
              errors={errors}
            />
          );
        case 'compliance':
          return (
            <ComplianceOperations
              formData={formData}
              errors={errors}
            />
          );
        case 'impact':
          return (
            <ImpactStrategy
              formData={formData}
              errors={errors}
            />
          );
        default:
          return (
            <GeneralInformation
              formData={formData}
              errors={errors}
              releaseOptions={releaseOptions}
            />
          );
      }
    };

    return (
      <div className="col-md-9">
        <div className="card shadow-sm border-0">
          <div className="card-body">
            <form id="edit-app-form">
              {renderActiveSection()}
            </form>
          </div>
        </div>
      </div>
    );
  };

  // Show error state
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

  // Show loading state
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

  // UPDATED: Show form when data is loaded (with sticky action bar)
  return (
    <>
      <NavBar />
      <StickyActionBar
        onSave={handleSaveFromActionBar}
        onCancel={() => navigate('/apps')}
        isSubmitting={isSubmitting}
        isEditMode={appId !== 0}
      />
      <div className="container-fluid" style={{ marginTop: '20px' }}>
        <div className="row">
          <SectionNavigation />
          <FormContent />
        </div>
      </div>
    </>
  );
};

export { EditApp };

// import { useState, useEffect, useCallback } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { GeneralInformation } from './apps/FormSections/GeneralInformation.jsx';
// import { TechnicalSpecifications } from './apps/FormSections/TechnicalSpecifications.jsx';
// import { BusinessModel } from './apps/FormSections/BusinessModel.jsx';
// import { DevelopmentStack } from './apps/FormSections/DevelopmentStack.jsx';
// import { AnalyticsMetrics } from './apps/FormSections/AnalyticsMetrics.jsx';
// import { ComplianceOperations } from './apps/FormSections/ComplianceOperations.jsx';
// import { ImpactStrategy } from './apps/FormSections/ImpactStrategy.jsx';
// import { validateForm } from './apps/AppFormValidation.js';
// import { submitAppForm } from './apps/AppFormHandlers';
// import { convertFormDataForAPI } from './apps/FormSections/FormDataConverter';
// import NavBar from './NavBar.jsx';
// import Swal from 'sweetalert2';

// const FIELD_GROUPS = [
//   'GeneralInformation',
//   'TechnicalSpecifications',
//   'BusinessModel',
//   'DevelopmentStack',
//   'AnalyticsMetrics',
//   'ComplianceOperations',
//   'ImpactStrategy'
// ];

// const cleanFormData = (data) => {
//   if (!data || typeof data !== 'object') {
//     console.warn('Invalid data passed to cleanFormData:', data);
//     return {};
//   }

//   const cleaned = { ...data };
//   const fileFields = ['logo', 'image', 'thumbnail', 'icon'];

//   fileFields.forEach(field => {
//     if (cleaned[field]) {
//       try {
//         if (typeof cleaned[field] === 'string') {
//           if (!cleaned[field].startsWith('http') && !cleaned[field].startsWith('data:')) {
//             cleaned[field] = null;
//           }
//         } else if (!(cleaned[field] instanceof File)) {
//           cleaned[field] = null;
//         }
//       } catch (error) {
//         console.warn(`Error cleaning field ${field}:`, error);
//         cleaned[field] = null;
//       }
//     }
//   });

//   return cleaned;
// };

// const EditApp = () => {
//   const { jwtToken, sessionChecked } = useAuth();
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const appId = parseInt(id || "0", 10);

//   const [formData, setFormData] = useState({});
//   const [releaseOptions, setReleaseOptions] = useState([]);
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [fetchError, setFetchError] = useState(null);
//   const [activeSection, setActiveSection] = useState('general');

//   const fetchReleases = useCallback(async (token) => {
//     try {
//       const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/releases`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });
//       if (!response.ok) throw new Error('Failed to fetch releases');
//       const data = await response.json();
//       return (data || []).map(item => ({
//         value: item.value || '',
//         label: item.label || item.value || '',
//       }));
//     } catch (error) {
//       console.error('Error fetching releases:', error);
//       throw error;
//     }
//   }, []);

//   const fetchAppData = useCallback(async (token, id) => {
//     try {
//       if (id === 0) {
//         const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/newapp`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         });
//         if (!response.ok) throw new Error('Failed to fetch app details');
//         return await response.json();
//       } else {
//         const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/apps/${id}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         });
//         if (!response.ok) {
//           const errorText = await response.text();
//           throw new Error(`Failed to fetch app details: ${response.status} ${errorText}`);
//         }
//         return await response.json();
//       }
//     } catch (error) {
//       console.error("Error in fetchAppData:", error);
//       throw error;
//     }
//   }, []);

//   // Releases fetch
//   useEffect(() => {
//     if (!sessionChecked || !jwtToken) return;

//     fetchReleases(jwtToken)
//       .then(setReleaseOptions)
//       .catch(error => {
//         console.error('Release fetch error:', error);
//       });
//   }, [jwtToken, sessionChecked, fetchReleases]);

//   // Main app data fetch
//   useEffect(() => {
//     if (!sessionChecked || !jwtToken) return;

//     if (isNaN(appId) || appId < 0) {
//       setFetchError('Invalid application ID');
//       setLoading(false);
//       return;
//     }

//     let ignore = false;

//     fetchAppData(jwtToken, appId)
//       .then(data => {
//         if (!ignore) {
//           setFormData(cleanFormData(data));
//           setLoading(false);
//         }
//       })
//       .catch(error => {
//         if (!ignore) {
//           setFetchError(error.message);
//           setLoading(false);
//         }
//       });

//     return () => {
//       ignore = true;
//     };
//   }, [appId, jwtToken, sessionChecked, fetchAppData]);

//   const handleFormChange = (event) => {
//     const { name, type, files } = event.target;

//     // For file inputs, use the File object
//     if (type === 'file') {
//       setFormData(prev => ({ ...prev, [name]: files[0] || null }));
//     }
//   };

//   const handleSubmitForm = async (event) => {
//   event.preventDefault();

//   // Get current values directly from the form
//   const formElement = document.getElementById('edit-app-form');
//   const currentFormData = new FormData(formElement);

//   // Convert FormData to object
//   const formValues = {};
//   for (let [key, value] of currentFormData.entries()) {
//     // Handle multiple values
//     if (formValues[key]) {
//       if (Array.isArray(formValues[key])) {
//         formValues[key].push(value);
//       } else {
//         formValues[key] = [formValues[key], value];
//       }
//     } else {
//       formValues[key] = value;
//     }
//   }
//   // DEBUG: Log what we're getting from the form
//   console.log('Form values from DOM:', formValues);
//   console.log('Current formData state:', formData);
//   console.log('App ID:', appId);

//   // Merge current form values with existing formData, but prioritize form values
//   const submissionData = {
//     ...formData,          // Existing data (includes id if editing)
//     ...formValues         // Current form values override existing data
//   };

//   // Ensure ID is included for updates
//   if (appId !== 0) {
//     submissionData.id = appId;
//   }

//   console.log('Final submission data:', submissionData);

//   const validationErrors = validateForm(submissionData, FIELD_GROUPS);
//   setErrors(validationErrors);

//   if (Object.keys(validationErrors).length > 0) return;

//   try {
//     // Convert form data to proper API types before submission
//     const apiData = convertFormDataForAPI(submissionData, appId === 0);
//     console.log('API data after conversion:', apiData);

//     await submitAppForm(apiData, appId, jwtToken);

//     const appName = submissionData.name || 'Application';
//     const action = appId === 0 ? 'created' : 'updated';

//     await Swal.fire({
//       title: 'Success!',
//       text: `App "${appName}" ${action} successfully`,
//       icon: 'success',
//       confirmButtonText: 'OK'
//     });

//     navigate('/apps');
//   } catch (error) {
//     if (error.message === 'SESSION_EXPIRED') {
//       await Swal.fire({
//         title: 'Session Expired',
//         text: 'Your session has expired. Please log in again.',
//         icon: 'warning',
//         confirmButtonText: 'Go to Login'
//       });
//       navigate('/login');
//       return;
//     }

//     console.error('Form submission error:', error);
//     let errorMessage = 'An error occurred while saving the application.';
//     if (error.message.includes('Server error:')) {
//       errorMessage = `Server error: ${error.message.split('Server error:')[1]}`;
//     }

//     await Swal.fire({
//       title: 'Error!',
//       text: errorMessage,
//       icon: 'error',
//       confirmButtonText: 'OK'
//     });
//   }
// };
//   // Section Navigation Component
//   const SectionNavigation = () => (
//     <div className="col-md-3">
//       <div className="card shadow-sm border-0 h-100">
//         <div className="card-header bg-primary text-white">
//           <h5 className="card-title mb-0">
//             <i className="bi bi-layers me-2"></i>
//             Application Sections
//           </h5>
//         </div>
//         <div className="card-body p-0">
//           <nav className="nav nav-pills flex-column">
//             <button
//               type="button"
//               className={`nav-link text-start rounded-0 border-bottom ${activeSection === 'general' ? 'active bg-primary' : 'text-dark'}`}
//               onClick={() => setActiveSection('general')}
//             >
//               <i className="bi bi-info-circle me-2"></i>
//               General Information
//             </button>
//             <button
//               type="button"
//               className={`nav-link text-start rounded-0 border-bottom ${activeSection === 'technical' ? 'active bg-primary' : 'text-dark'}`}
//               onClick={() => setActiveSection('technical')}
//             >
//               <i className="bi bi-cpu me-2"></i>
//               Technical Specifications
//             </button>
//             <button
//               type="button"
//               className={`nav-link text-start rounded-0 border-bottom ${activeSection === 'business' ? 'active bg-primary' : 'text-dark'}`}
//               onClick={() => setActiveSection('business')}
//             >
//               <i className="bi bi-graph-up me-2"></i>
//               Business Model
//             </button>
//             <button
//               type="button"
//               className={`nav-link text-start rounded-0 border-bottom ${activeSection === 'development' ? 'active bg-primary' : 'text-dark'}`}
//               onClick={() => setActiveSection('development')}
//             >
//               <i className="bi bi-code-slash me-2"></i>
//               Development Stack
//             </button>
//             <button
//               type="button"
//               className={`nav-link text-start rounded-0 border-bottom ${activeSection === 'analytics' ? 'active bg-primary' : 'text-dark'}`}
//               onClick={() => setActiveSection('analytics')}
//             >
//               <i className="bi bi-bar-chart me-2"></i>
//               Analytics & Metrics
//             </button>
//             <button
//               type="button"
//               className={`nav-link text-start rounded-0 border-bottom ${activeSection === 'compliance' ? 'active bg-primary' : 'text-dark'}`}
//               onClick={() => setActiveSection('compliance')}
//             >
//               <i className="bi bi-shield-check me-2"></i>
//               Compliance & Operations
//             </button>
//             <button
//               type="button"
//               className={`nav-link text-start rounded-0 ${activeSection === 'impact' ? 'active bg-primary' : 'text-dark'}`}
//               onClick={() => setActiveSection('impact')}
//             >
//               <i className="bi bi-rocket me-2"></i>
//               Impact & Strategy
//             </button>
//           </nav>
//         </div>
//       </div>
//     </div>
//   );

//   // Form Content Component
//   const FormContent = () => {
//     const renderActiveSection = () => {
//       switch (activeSection) {
//         case 'general':
//           return (
//             <GeneralInformation
//               formData={formData}
//               handleChange={handleFormChange}
//               errors={errors}
//               releaseOptions={releaseOptions}
//             />
//           );
//         case 'technical':
//           return (
//             <TechnicalSpecifications
//               formData={formData}
//               // handleChange={handleFormChange}
//               errors={errors}
//             />
//           );
//         case 'business':
//           return (
//             <BusinessModel
//               formData={formData}
//               // handleChange={handleFormChange}
//               errors={errors}
//             />
//           );
//         case 'development':
//           return (
//             <DevelopmentStack
//               formData={formData}
//               // handleChange={handleFormChange}
//               errors={errors}
//             />
//           );
//         case 'analytics':
//           return (
//             <AnalyticsMetrics
//               formData={formData}
//               // handleChange={handleFormChange}
//               errors={errors}
//             />
//           );
//         case 'compliance':
//           return (
//             <ComplianceOperations
//               formData={formData}
//               // handleChange={handleFormChange}
//               errors={errors}
//             />
//           );
//         case 'impact':
//           return (
//             <ImpactStrategy
//               formData={formData}
//               // handleChange={handleFormChange}
//               errors={errors}
//             />
//           );
//         default:
//           return (
//             <GeneralInformation
//               formData={formData}
//               // handleChange={handleFormChange}
//               errors={errors}
//               releaseOptions={releaseOptions}
//             />
//           );
//       }
//     };

//     return (
//       <div className="col-md-9">
//         <div className="card shadow-sm border-0">
//           <div className="card-header bg-light border-0">
//             <h3 className="card-title mb-0">
//               {appId === 0 ? (
//                 <>
//                   <i className="bi bi-plus-circle text-primary me-2"></i>
//                   Create New Application
//                 </>
//               ) : (
//                 <>
//                   <i className="bi bi-pencil-square text-primary me-2"></i>
//                   Edit Application
//                 </>
//               )}
//             </h3>
//             <p className="text-muted mb-0 mt-1">
//               {appId === 0
//                 ? "Build something amazing! Fill in the details below to create your new application."
//                 : "Update your application details and configuration."
//               }
//             </p>
//           </div>

//           <div className="card-body">
//             <form onSubmit={handleSubmitForm} id="edit-app-form">
//               {renderActiveSection()}

//               <div className="border-top pt-4 mt-4">
//                 <div className="d-flex justify-content-between align-items-center">
//                   <button
//                     type="button"
//                     className="btn btn-outline-secondary"
//                     onClick={() => navigate('/apps')}
//                   >
//                     <i className="bi bi-arrow-left me-2"></i>
//                     Cancel
//                   </button>
//                   <button type="submit" className="btn btn-primary btn-lg">
//                     <i className="bi bi-save me-2"></i>
//                     {appId === 0 ? 'Create Application' : 'Update Application'}
//                   </button>
//                 </div>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // Show error state
//   if (fetchError) {
//     return (
//       <>
//         <NavBar />
//         <div className="container-lg my-4">
//           <div className="card border-danger">
//             <div className="card-header bg-danger text-white">
//               <h4 className="card-title mb-0">
//                 <i className="bi bi-exclamation-triangle me-2"></i>
//                 Error Loading Application
//               </h4>
//             </div>
//             <div className="card-body">
//               <p className="card-text">{fetchError}</p>
//               <div className="d-flex gap-2">
//                 <button
//                   className="btn btn-primary"
//                   onClick={() => window.location.reload()}
//                 >
//                   <i className="bi bi-arrow-clockwise me-2"></i>
//                   Retry
//                 </button>
//                 <button
//                   className="btn btn-outline-secondary"
//                   onClick={() => navigate('/apps')}
//                 >
//                   <i className="bi bi-arrow-left me-2"></i>
//                   Back to Apps
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </>
//     );
//   }

//   // Show loading state
//   if (loading) {
//     return (
//       <>
//         <NavBar />
//         <div className="container-lg my-4">
//           <div className="card">
//             <div className="card-body text-center py-5">
//               <div className="spinner-border text-primary mb-3" role="status">
//                 <span className="visually-hidden">Loading...</span>
//               </div>
//               <h5>Loading Application</h5>
//               <p className="text-muted">Preparing your workspace...</p>
//             </div>
//           </div>
//         </div>
//       </>
//     );
//   }

//   // Show form when data is loaded
//   return (
//     <>
//       <NavBar />
//       <div className="container-fluid my-4">
//         <div className="row">
//           <SectionNavigation />
//           <FormContent />
//         </div>
//       </div>
//     </>
//   );
// };

// export { EditApp };