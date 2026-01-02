// /**
//  * EditUser Component
//  * --------------
//  * Form for creating or editing user accounts.
//  * - Handles both new user creation and existing user editing
//  * - Validates user data before submission
//  * - Provides organized form sections for different user data categories
//  *
//  * Dependencies:
//  * - React Router (useNavigate, useParams)
//  * - AuthContext (for JWT token)
//  * - Form validation utilities
//  * - Form submission handlers
//  * - User-specific converters and handlers
//  *
//  * @component
//  */

// import { useState, useEffect, useCallback } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
// import { UserGeneralInformation } from './FormSections/UserGeneralInformation.jsx';
// import { UserAccountSecurity } from './FormSections/UserAccountSecurity.jsx';
// import { UserAccessPermissions } from './FormSections/UserAccessPermissions.jsx';
// import { UserActivitySettings } from './FormSections/UserActivitySettings.jsx';
// import { UserSystemIntegration } from './FormSections/UserSystemIntegration.jsx';
// import { validateUserForm } from './UserFormValidation.jsx';
// import { handleGenericFormSubmit, scrollToFirstError } from '../../utils/FormSubmitHandler';

// import {
//   submitUserForm,
//   fetchUserForEdit,
//   fetchUserDetails
// } from './UserFormHandlers';

// // Import user-specific converter
// import { convertUserData } from '../../utils/formConverters/UserConverter.js';

// import NavBar from '../NavBar.jsx';
// import Swal from 'sweetalert2';

// const USER_FIELD_GROUPS = [
//   'UserGeneralInformation',
//   'UserAccountSecurity',
//   'UserAccessPermissions',
//   'UserActivitySettings',
//   'UserSystemIntegration'
// ];

// // Initial form data for new users
// const INITIAL_FORM_DATA = {
//   active: true,
//   blocked: false,
//   tries: 0,
//   lan: 'en',
//   company_id: 1,
//   first_name: '',
//   last_name: '',
//   email: '',
//   code: '',
//   password: '',
//   confirm_password: '',
//   role: '',
//   profile_id: null,
//   group_id: null,
//   last_app: null,
//   last_db: null,
//   dbsauth_id: null
// };

// // Sticky Action Bar Component for User Edit
// const StickyActionBar = ({ onSave, onCancel, isSubmitting, isEditMode }) => (
//   <div className="sticky-top bg-white shadow-sm border-bottom py-3" style={{ zIndex: 1020, top: '56px' }}>
//     <div className="container-fluid">
//       <div className="row align-items-center">
//         <div className="col">
//           <h4 className="mb-0 text-dark">
//             <i className={`bi ${isEditMode ? 'bi-person-check' : 'bi-person-plus'} text-primary me-2`}></i>
//             {isEditMode ? 'Edit User Account' : 'Create New User Account'}
//           </h4>
//           <small className="text-muted">
//             {isEditMode ? 'Update user details and permissions' : 'Set up a new user account with appropriate access rights'}
//           </small>
//         </div>
//         <div className="col-auto">
//           <div className="d-flex gap-2">
//             <button
//               type="button"
//               className="btn btn-outline-secondary"
//               onClick={onCancel}
//               disabled={isSubmitting}
//             >
//               <i className="bi bi-arrow-left me-2"></i>
//               Cancel
//             </button>
//             <button
//               type="button"
//               className="btn btn-primary"
//               onClick={onSave}
//               disabled={isSubmitting}
//             >
//               {isSubmitting ? (
//                 <>
//                   <span className="spinner-border spinner-border-sm me-2" role="status"></span>
//                   Saving...
//                 </>
//               ) : (
//                 <>
//                   <i className="bi bi-check-circle me-2"></i>
//                   {isEditMode ? 'Update User' : 'Create User'}
//                 </>
//               )}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
// );

// const EditUser = () => {
//   const { jwtToken, sessionChecked } = useAuth();
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const userId = parseInt(id || "0", 10);

//   const [formData, setFormData] = useState(INITIAL_FORM_DATA);
//   const [roleOptions, setRoleOptions] = useState([]);
//   const [profileOptions, setProfileOptions] = useState([]);
//   const [groupOptions, setGroupOptions] = useState([]);
//   const [companyOptions, setCompanyOptions] = useState([]);
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [fetchError, setFetchError] = useState(null);
//   const [activeSection, setActiveSection] = useState('general');
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Authentication check
//   useEffect(() => {
//     if (sessionChecked && !jwtToken) {
//       navigate('/login');
//     }
//   }, [sessionChecked, jwtToken, navigate]);

//   // Fetch dropdown options
//   useEffect(() => {
//     if (!sessionChecked || !jwtToken) return;

//     const fetchOptions = async () => {
//       try {
//         const data = await fetchUserDetails(jwtToken);
//         setRoleOptions(data.roles || []);
//         setProfileOptions(data.profiles || []);
//         setGroupOptions(data.groups || []);
//         setCompanyOptions(data.companies || []);
//       } catch (error) {
//         console.error('Options fetch error:', error);
//       }
//     };

//     fetchOptions();
//   }, [jwtToken, userId, sessionChecked]);

//   // Main user data fetch (for editing)
//   useEffect(() => {
//     // Don't run if still checking session or no token
//     if (!sessionChecked || !jwtToken) return;

//     console.log('Data fetch effect running:', { userId, sessionChecked, hasToken: !!jwtToken });

//     // For new users (userId === 0), set loading to false immediately
//     if (userId === 0) {
//       console.log('New user mode - setting empty form');
//       setFormData(INITIAL_FORM_DATA);
//       setLoading(false);
//       return;
//     }

//     // For editing existing users
//     if (isNaN(userId) || userId < 0) {
//       setFetchError('Invalid user ID');
//       setLoading(false);
//       return;
//     }

//     let ignore = false;

//     const loadUserData = async () => {
//       try {
//         const data = await fetchUserForEdit(userId, jwtToken);

//         if (!ignore) {
//           console.log('User data loaded:', data);

//           // Merge fetched data with initial defaults
//           const userData = {
//             ...INITIAL_FORM_DATA,
//             ...data,
//             active: data.active !== undefined ? data.active : true,
//             blocked: data.blocked || false,
//             tries: data.tries || 0,
//             lan: data.lan || 'en',
//             company_id: data.company_id || 1,
//             profile_id: data.profile_id || null,
//             group_id: data.group_id || null,
//             last_app: data.last_app || null,
//             last_db: data.last_db || null,
//             dbsauth_id: data.dbsauth_id || null
//           };

//           setFormData(userData);
//           setLoading(false);
//         }
//       } catch (error) {
//         if (!ignore) {
//           console.error('Fetch user error:', error);
//           setFetchError(error.message || 'Failed to load user data');
//           setLoading(false);
//         }
//       }
//     };

//     loadUserData();

//     return () => {
//       ignore = true;
//     };
//   }, [userId, jwtToken, sessionChecked]);

//   // Memoized form change handler to prevent focus loss
//   const handleFormChange = useCallback((event) => {
//     const { name, type, value, checked } = event.target;

//     // Special handling for number fields
//     const isNumberField = [
//       'id', 'profile_id', 'group_id', 'company_id', 'dbsauth_id',
//       'last_app', 'last_db', 'tries'
//     ].includes(name);

//     if (type === 'checkbox') {
//       setFormData(prev => ({ ...prev, [name]: checked }));
//     } else if (isNumberField) {
//       // Convert empty string to null, otherwise parse as integer
//       const numValue = value === '' ? null : parseInt(value, 10);
//       setFormData(prev => ({ ...prev, [name]: isNaN(numValue) ? null : numValue }));
//     } else if (type === 'select-multiple') {
//       const selectedOptions = Array.from(event.target.selectedOptions).map(option => option.value);
//       setFormData(prev => ({ ...prev, [name]: selectedOptions }));
//     } else {
//       setFormData(prev => ({ ...prev, [name]: value }));
//     }
//   }, []);

//   // Memoized password change handler
//   const handlePasswordChange = useCallback((name, value) => {
//     setFormData(prev => ({ ...prev, [name]: value }));
//   }, []);

//   const handleSubmitForm = async (event) => {
//     event.preventDefault();
//     setIsSubmitting(true);
//     setErrors({});

//     try {
//       // For new users, ensure password is set
//       // if (userId === 0 && !formData.password) {
//       //   setErrors(prev => ({
//       //     ...prev,
//       //     password: 'Password is required for new users'
//       //   }));
//       //   scrollToFirstError({ password: 'Password is required for new users' });
//       //   setIsSubmitting(false);
//       //   return;
//       // }

//       const result = await handleGenericFormSubmit({
//         event,
//         formId: 'edit-user-form',
//         existingData: formData,
//         entityId: userId,
//         validateFn: (data) => validateUserForm(data, USER_FIELD_GROUPS),
//         convertFn: convertUserData,
//         submitFn: (apiData, id) => submitUserForm(apiData, id, jwtToken),
//         fileFields: [], // No file fields for user
//         onSuccess: async (result, submittedData) => {
//           const userName = submittedData.first_name || submittedData.email || 'User';
//           const action = userId === 0 ? 'created' : 'updated';

//           await Swal.fire({
//             title: 'Success!',
//             text: `User "${userName}" ${action} successfully`,
//             icon: 'success',
//             confirmButtonText: 'OK'
//           });

//           console.log('data to be submitted: ', submittedData);
//           console.log('Action:', action);
//           console.log('UserId: ', userId);

//           navigate('/users');
//         },
//         onError: async (errorMessage, validationErrors) => {
//           console.error('User form submission error:', errorMessage);

//           if (errorMessage === 'SESSION_EXPIRED') {
//             await Swal.fire({
//               title: 'Session Expired',
//               text: 'Your session has expired. Please log in again.',
//               icon: 'warning',
//               confirmButtonText: 'Go to Login'
//             });
//             navigate('/login');
//             return;
//           }

//           if (validationErrors) {
//             setErrors(validationErrors);
//             scrollToFirstError(validationErrors);
//           } else {
//             await Swal.fire({
//               title: 'Error!',
//               text: errorMessage || 'An error occurred while saving the user.',
//               icon: 'error',
//               confirmButtonText: 'OK'
//             });
//           }
//         }
//       });

//       console.log('User form submission result:', result);

//     } catch (error) {
//       console.error('Unexpected error in handleSubmitForm:', error);
//       await Swal.fire({
//         title: 'Unexpected Error',
//         text: 'An unexpected error occurred. Please try again.',
//         icon: 'error',
//         confirmButtonText: 'OK'
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Section Navigation Component
//   const SectionNavigation = () => (
//     <div className="col-md-3">
//       <div className="card shadow-sm border-0 h-100">
//         <div className="card-header bg-primary text-white">
//           <h5 className="card-title mb-0">
//             <i className="bi bi-person-gear me-2"></i>
//             User Sections
//           </h5>
//         </div>
//         <div className="card-body p-0">
//           <nav className="nav nav-pills flex-column">
//             {['general', 'security', 'access', 'activity', 'integration'].map((section) => (
//               <button
//                 key={section}
//                 type="button"
//                 className={`nav-link text-start rounded-0 border-bottom ${activeSection === section ? 'active bg-primary' : 'text-dark'}`}
//                 onClick={() => setActiveSection(section)}
//                 disabled={isSubmitting || loading}
//               >
//                 <i className={`bi bi-${getSectionIcon(section)} me-2`}></i>
//                 {getSectionTitle(section)}
//                 {hasSectionErrors(section) && (
//                   <span className="badge bg-danger rounded-pill ms-2">
//                     <i className="bi bi-exclamation-circle"></i>
//                   </span>
//                 )}
//               </button>
//             ))}
//           </nav>

//           {/* User Status Summary */}
//           <div className="p-3 border-top">
//             <small className="text-muted d-block mb-2">Current Status:</small>
//             <div className="d-flex flex-column gap-1">
//               <span className={`badge ${formData.active ? 'bg-success' : 'bg-secondary'} bg-opacity-25 text-dark`}>
//                 <i className={`bi ${formData.active ? 'bi-check-circle' : 'bi-x-circle'} me-1`}></i>
//                 {formData.active ? 'Active' : 'Inactive'}
//               </span>
//               {formData.blocked && (
//                 <span className="badge bg-danger bg-opacity-25 text-dark">
//                   <i className="bi bi-slash-circle me-1"></i>
//                   Blocked
//                 </span>
//               )}
//               <span className="badge bg-info bg-opacity-25 text-dark">
//                 <i className="bi bi-shield me-1"></i>
//                 {formData.role || 'No Role'}
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   // Helper functions for section navigation
//   const getSectionIcon = (section) => {
//     const icons = {
//       general: 'person-lines-fill',
//       security: 'shield-lock',
//       access: 'key',
//       activity: 'activity',
//       integration: 'puzzle'
//     };
//     return icons[section] || 'person-lines-fill';
//   };

//   const getSectionTitle = (section) => {
//     const titles = {
//       general: 'General Information',
//       security: 'Account & Security',
//       access: 'Access & Permissions',
//       activity: 'Activity Settings',
//       integration: 'System Integration'
//     };
//     return titles[section] || 'General Information';
//   };

//   const hasSectionErrors = (section) => {
//     const sectionFields = {
//       general: ['first_name', 'last_name', 'email', 'code'],
//       security: ['password', 'active', 'blocked'],
//       access: ['role', 'profile_id', 'group_id'],
//       activity: ['last_app', 'last_db', 'lan'],
//       integration: ['company_id', 'dbsauth_id']
//     };

//     return Object.keys(errors).some(field =>
//       sectionFields[section]?.includes(field)
//     );
//   };

//   // Form Content Component
//   const FormContent = () => {
//     const renderActiveSection = () => {
//       const commonProps = {
//         formData,
//         errors,
//         handleChange: handleFormChange,
//         handlePasswordChange,
//         disabled: isSubmitting || loading
//       };

//       switch (activeSection) {
//         case 'general':
//           return (
//             <UserGeneralInformation
//               {...commonProps}
//               roleOptions={roleOptions}
//             />
//           );
//         case 'security':
//           return (
//             <UserAccountSecurity
//               {...commonProps}
//               isNewUser={userId === 0}
//             />
//           );
//         case 'access':
//           return (
//             <UserAccessPermissions
//               {...commonProps}
//               roleOptions={roleOptions}
//               profileOptions={profileOptions}
//               groupOptions={groupOptions}
//             />
//           );
//         case 'activity':
//           return (
//             <UserActivitySettings
//               {...commonProps}
//               appOptions={[]} // You'll need to fetch app options
//               dbOptions={[]} // You'll need to fetch db options
//             />
//           );
//         case 'integration':
//           return (
//             <UserSystemIntegration
//               {...commonProps}
//               companyOptions={companyOptions}
//             />
//           );
//         default:
//           return (
//             <UserGeneralInformation
//               {...commonProps}
//               roleOptions={roleOptions}
//             />
//           );
//       }
//     };

//     return (
//       <div className="col-md-9">
//         <div className="card shadow-sm border-0">
//           <div className="card-body">
//             <form id="edit-user-form" onSubmit={handleSubmitForm}>
//               {renderActiveSection()}

//               {/* Global form errors */}
//               {errors._global && (
//                 <div className="alert alert-danger mt-3">
//                   <i className="bi bi-exclamation-triangle me-2"></i>
//                   {errors._global}
//                 </div>
//               )}

//               {/* Hidden submit button for accessibility */}
//               <button type="submit" style={{ display: 'none' }} aria-hidden="true"></button>
//             </form>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // Error state
//   if (fetchError) {
//     return (
//       <>
//         <NavBar />
//         <div className="container-lg my-4">
//           <div className="card border-danger">
//             <div className="card-header bg-danger text-white">
//               <h4 className="card-title mb-0">
//                 <i className="bi bi-exclamation-triangle me-2"></i>
//                 Error Loading User
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
//                   onClick={() => navigate('/users')}
//                 >
//                   <i className="bi bi-arrow-left me-2"></i>
//                   Back to Users
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </>
//     );
//   }

//   // Loading state
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
//               <h5>Loading User Data</h5>
//               <p className="text-muted">
//                 {userId === 0 ? 'Preparing new user form...' : 'Loading user information...'}
//               </p>
//             </div>
//           </div>
//         </div>
//       </>
//     );
//   }

//   // Debug log (development only)
//   console.log('Form state:', {
//     loading,
//     userId,
//     formDataKeys: Object.keys(formData),
//     formDataValues: formData
//   });

//   // Main render
//   return (
//     <>
//       <NavBar />
//       <StickyActionBar
//         onSave={handleSubmitForm}
//         onCancel={() => navigate('/users')}
//         isSubmitting={isSubmitting}
//         isEditMode={userId !== 0}
//       />
//       <div className="container-fluid" style={{ marginTop: '20px' }}>
//         <div className="row">
//           <SectionNavigation />
//           <FormContent />
//         </div>

//         {/* Debug info (development only) */}
//         {process.env.NODE_ENV === 'development' && (
//           <div className="mt-3 p-3 border rounded bg-light">
//             <small className="text-muted">
//               <i className="bi bi-bug me-1"></i>
//               Debug: User ID: {userId} | Loading: {loading.toString()} | Submitting: {isSubmitting.toString()}
//             </small>
//             <pre className="mt-2 small" style={{ maxHeight: '200px', overflow: 'auto' }}>
//               {JSON.stringify(formData, null, 2)}
//             </pre>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export { EditUser };

// /**
//  * EditUser Component
//  * --------------
//  * Form for creating or editing user accounts.
//  * - Handles both new user creation and existing user editing
//  * - Validates user data before submission
//  * - Provides organized form sections for different user data categories
//  *
//  * Dependencies:
//  * - React Router (useNavigate, useParams)
//  * - AuthContext (for JWT token)
//  * - Form validation utilities
//  * - Form submission handlers
//  * - User-specific converters and handlers
//  *
//  * @component
//  */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserGeneralInformation } from './FormSections/UserGeneralInformation.jsx';
import { UserAccountSecurity } from './FormSections/UserAccountSecurity.jsx';
import { UserAccessPermissions } from './FormSections/UserAccessPermissions.jsx';
import { UserActivitySettings } from './FormSections/UserActivitySettings.jsx';
import { UserSystemIntegration } from './FormSections/UserSystemIntegration.jsx';
import { validateUserForm } from './UserFormValidation.jsx';
import { handleGenericFormSubmit, scrollToFirstError } from '../../utils/FormSubmitHandler';

import {
  submitUserForm,
  fetchUserForEdit,
  // fetchUserDetails
} from './UserFormHandlers';

// Import user-specific converter
import { convertUserData } from '../../utils/formConverters/UserConverter.js';

import NavBar from '../NavBar.jsx';
import Swal from 'sweetalert2';

const USER_FIELD_GROUPS = [
  'UserGeneralInformation',
  'UserAccountSecurity',
  'UserAccessPermissions',
  'UserActivitySettings',
  'UserSystemIntegration'
];

// Sticky Action Bar Component for User Edit
const StickyActionBar = ({ onSave, onCancel, isSubmitting, isEditMode }) => (
  <div className="sticky-top bg-white shadow-sm border-bottom py-3" style={{ zIndex: 1020, top: '56px' }}>
    <div className="container-fluid">
      <div className="row align-items-center">
        <div className="col">
          <h4 className="mb-0 text-dark">
            <i className={`bi ${isEditMode ? 'bi-person-check' : 'bi-person-plus'} text-primary me-2`}></i>
            {isEditMode ? 'Edit User Account' : 'Create New User Account'}
          </h4>
          <small className="text-muted">
            {isEditMode ? 'Update user details and permissions' : 'Set up a new user account with appropriate access rights'}
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
                  {isEditMode ? 'Update User' : 'Create User'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const EditUser = () => {
  const { jwtToken, sessionChecked } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const userId = parseInt(id || "0", 10);

  const [formData, setFormData] = useState({});

  // const [roleOptions, setRoleOptions] = useState([]);
  // const [profileOptions, setProfileOptions] = useState([]);
  // const [groupOptions, setGroupOptions] = useState([]);
  // const [companyOptions, setCompanyOptions] = useState([]);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [activeSection, setActiveSection] = useState('general');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch dropdown options (roles, profiles, groups, companies)
  useEffect(() => {
    if (!sessionChecked || !jwtToken) {
      navigate('/login');
    }
    }, [jwtToken, sessionChecked, navigate]);

  // useEffect(() => {
  //   if (!sessionChecked || !jwtToken) return;

  //   fetchUserDetails(jwtToken)
  //     .then(data => {
        // setRoleOptions(data.roles || []);
        // setProfileOptions(data.profiles || []);
        // setGroupOptions(data.groups || []);
        // setCompanyOptions(data.companies || []);
        // setReleaseOptions(data.release || []);
  //     })
  //     .catch(error => {
  //       console.error('Options fetch error:', error);
  //     });
  // }, [jwtToken, sessionChecked]);

  // Main user data fetch (for editing)
  useEffect(() => {
    if (!sessionChecked || !jwtToken) {
      navigate("/login");
    }
  }, [jwtToken, sessionChecked, navigate]);

  useEffect(() => {
    if (!sessionChecked || jwtToken) return;

    if (isNaN(userId) || userId < 0) {
      setFetchError('Invalid user ID');
      setLoading(false);
      return;
    }
    let ignore = false;

    fetchUserForEdit(userId, jwtToken)
      .then(data => {
        if (!ignore) {
          // Ensure all required fields have default values
          const userData = {
            active: data.active !== undefined ? data.active : true,
            blocked: data.blocked || false,
            tries: data.tries || 0,
            lan: data.lan || 'en',
            company_id: data.company_id || 1,
            ...data
          };
          setFormData(userData);
          setLoading(false);
        }
      })
      .catch(error => {
        if (!ignore) {
          console.error('Fetch user error:', error);
          setFetchError(error.message || 'Failed to load user data');
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [userId, jwtToken, sessionChecked]);
  const handleFormChange = (event) => {
    const { name, type, value, checked } = event.target;

    // Special handling for number fields
    const isNumberField = [
      'id', 'profile_id', 'group_id', 'company_id', 'dbsauth_id',
      'last_app', 'last_db', 'tries'
    ].includes(name);

    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (isNumberField) {
      // Convert empty string to null, otherwise parse as integer
      const numValue = value === '' ? null : parseInt(value, 10);
      setFormData(prev => ({ ...prev, [name]: isNaN(numValue) ? null : numValue }));
    } else if (type === 'select-multiple') {
      const selectedOptions = Array.from(event.target.selectedOptions).map(option => option.value);
      setFormData(prev => ({ ...prev, [name]: selectedOptions }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Handle password confirmation
  const handlePasswordChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitForm = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    try {
      // For new users, ensure password is set
      // if (userId === 0 && !formData.password) {
      //   setErrors(prev => ({
      //     ...prev,
      //     password: 'Password is required for new users'
      //   }));
      //   scrollToFirstError({ password: 'Password is required for new users' });
      //   setIsSubmitting(false);
      //   return;
      // }

      const result = await handleGenericFormSubmit({
        event,
        formId: 'edit-user-form',
        existingData: formData,
        entityId: userId,
        validateFn: (data) => validateUserForm(data, USER_FIELD_GROUPS),
        convertFn: convertUserData,
        submitFn: (apiData, id) => submitUserForm(apiData, id, jwtToken),
        fileFields: [], // No file fields for user

        onSuccess: async (result,submittedData) => {
          const userName = submittedData.first_name || submittedData.email || 'User';
          const action = userId === 0 ? 'created' : 'updated';

          await Swal.fire({
            title: 'Success!',
            text: `User "${userName}" ${action} successfully`,
            icon: 'success',
            confirmButtonText: 'OK'
          });

          console.log('data to be submitted: ', submittedData);
          console.log('Action:', action);
          console.log('UserId: ', userId);

          navigate('/users');
        },
        onError: async (errorMessage, validationErrors) => {
          console.error('User form submission error:', errorMessage);

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
              text: errorMessage || 'An error occurred while saving the user.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        }
      });
      console.log('User form submission result:', result);

    } catch (error) {
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
            <i className="bi bi-person-gear me-2"></i>
            User Sections
          </h5>
        </div>
        <div className="card-body p-0">
          <nav className="nav nav-pills flex-column">
            {['general', 'security', 'access', 'activity', 'integration'].map((section) => (
              <button
                key={section}
                type="button"
                className={`nav-link text-start rounded-0 border-bottom ${activeSection === section ? 'active bg-primary' : 'text-dark'}`}
                onClick={() => setActiveSection(section)}
                disabled={isSubmitting || loading}
              >
                <i className={`bi bi-${getSectionIcon(section)} me-2`}></i>
                {getSectionTitle(section)}
                {hasSectionErrors(section) && (
                  <span className="badge bg-danger rounded-pill ms-2">
                    <i className="bi bi-exclamation-circle"></i>
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* User Status Summary */}
          <div className="p-3 border-top">
            <small className="text-muted d-block mb-2">Current Status:</small>
            <div className="d-flex flex-column gap-1">
              <span className={`badge ${formData.active ? 'bg-success' : 'bg-secondary'} bg-opacity-25 text-dark`}>
                <i className={`bi ${formData.active ? 'bi-check-circle' : 'bi-x-circle'} me-1`}></i>
                {formData.active ? 'Active' : 'Inactive'}
              </span>
              {formData.blocked && (
                <span className="badge bg-danger bg-opacity-25 text-dark">
                  <i className="bi bi-slash-circle me-1"></i>
                  Blocked
                </span>
              )}
              <span className="badge bg-info bg-opacity-25 text-dark">
                <i className="bi bi-shield me-1"></i>
                {formData.role || 'No Role'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Helper functions for section navigation
  const getSectionIcon = (section) => {
    const icons = {
      general: 'person-lines-fill',
      security: 'shield-lock',
      access: 'key',
      activity: 'activity',
      integration: 'puzzle'
    };
    return icons[section] || 'person-lines-fill';
  };

  const getSectionTitle = (section) => {
    const titles = {
      general: 'General Information',
      security: 'Account & Security',
      access: 'Access & Permissions',
      activity: 'Activity Settings',
      integration: 'System Integration'
    };
    return titles[section] || 'General Information';
  };

  const hasSectionErrors = (section) => {
    const sectionFields = {
      general: ['first_name', 'last_name', 'email', 'code'],
      security: ['password', 'active', 'blocked'],
      access: ['role', 'profile_id', 'group_id'],
      activity: ['last_app', 'last_db', 'lan'],
      integration: ['company_id', 'dbsauth_id']
    };

    return Object.keys(errors).some(field =>
      sectionFields[section]?.includes(field)
    );
  };

  // Form Content Component
  const FormContent = () => {
    const renderActiveSection = () => {
      const commonProps = {
        formData,
        errors,
        handleChange: handleFormChange,
        handlePasswordChange,
        disabled: isSubmitting || loading
      };

      switch (activeSection) {
        case 'general':
          return (
            <UserGeneralInformation
              {...commonProps}
              // roleOptions={roleOptions}
            />
          );
        case 'security':
          return (
            <UserAccountSecurity
              {...commonProps}
              // isNewUser={userId === 0}
            />
          );
        case 'access':
          return (
            <UserAccessPermissions
              {...commonProps}
              // roleOptions={roleOptions}
              // profileOptions={profileOptions}
              // groupOptions={groupOptions}
            />
          );
        case 'activity':
          return (
            <UserActivitySettings
              {...commonProps}
              // appOptions={[]} // You'll need to fetch app options
              // dbOptions={[]} // You'll need to fetch db options
            />
          );
        case 'integration':
          return (
            <UserSystemIntegration
              {...commonProps}
              // companyOptions={companyOptions}
            />
          );
        default:
          return (
            <UserGeneralInformation
              {...commonProps}
              // roleOptions={roleOptions}
            />
          );
      }
    };

    return (
      <div className="col-md-9">
        <div className="card shadow-sm border-0">
          <div className="card-body">
            <form id="edit-user-form" onSubmit={handleSubmitForm}>
              {renderActiveSection()}

              {/* Global form errors */}
              {errors._global && (
                <div className="alert alert-danger mt-3">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {errors._global}
                </div>
              )}

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
                Error Loading User
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
                  onClick={() => navigate('/users')}
                >
                  <i className="bi bi-arrow-left me-2"></i>
                  Back to Users
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
              <h5>Loading User Data</h5>
              <p className="text-muted">
                {userId === 0 ? 'Preparing new user form...' : 'Loading user information...'}
              </p>
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
        onCancel={() => navigate('/users')}
        isSubmitting={isSubmitting}
        isEditMode={userId !== 0}
      />
      <div className="container-fluid" style={{ marginTop: '20px' }}>
        <div className="row">
          <SectionNavigation />
          <FormContent />
        </div>

      {/*   // Debug info (development only)
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-3 p-3 border rounded bg-light">
            <small className="text-muted">
              <i className="bi bi-bug me-1"></i>
              Debug: User ID: {userId} | Loading: {loading.toString()} | Submitting: {isSubmitting.toString()}
            </small>
            <pre className="mt-2 small" style={{ maxHeight: '200px', overflow: 'auto' }}>
              {JSON.stringify(formData, null, 2)}
            </pre>
          </div>
        )} */}
      </div>
    </>
  );
};

export { EditUser };