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
import { NavBar } from './NavBar.jsx';

// Define FIELD_GROUPS according to your form validation requirements
const FIELD_GROUPS = [
  'GeneralInformation',
  'TechnicalSpecifications',
  'BusinessModel',
  'DevelopmentStack',
  'AnalyticsMetrics',
  'ComplianceOperations',
  'ImpactStrategy'
];

const INITIAL_STATE = {
  id: 0,
	name: '',
	release: '',
	path: '',
	init: '',
	web: '',
	title: '',
	created: '',
	updated: '',
	description: '',
	positioningStmt: '',
	logo: '',
	category: '',
	platform: '',
	developer: '',
	licenseType: '',
	size: '',
	compatibility: '',
	integrationCapabilities: '',
	developmentStack: '',
	apiDocumentation: '',
	securityFeatures: '',
	regulatoryCompliance: '',
	revenueStreams: '',
	customerSegments: '',
	channels: '',
	valueProposition: '',
	pricingTiers: '',
	partnerships: '',
	costStructure: '',
	customerRelationships: '',
	unfairAdvantage: '',
	roadmap: '',
	versionControl: '',
	errorRate: '',
	averageResponseTime: '',
	uptimePercentage: '',
	keyActivities: '',
	activeUsers: '',
	userRetentionRate: '',
	userAcquisitionCost: '',
	churnRate: '',
	monthlyRecurringRevenue: '',
	userFeedback: '',
	backupRecoveryOptions: '',
	localizationSupport: '',
	accessibilityFeatures: '',
	teamStructure: '',
	dataBackupLocation: '',
	environmentalImpact: '',
	socialImpact: '',
	intellectualProperty: '',
	fundingsInvestment: '',
	exitStrategy: '',
	analyticsTools: '',
	keyMetrics: '',
	url: '',
	landingPage: '',
};

// Simple error handler for demonstration; customize as needed
const handleError = (error) => {
  console.error(error);
  alert('An error occurred. Please try again.');
};

const EditApp = () => {
  const { jwtToken, sessionChecked } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const appId = parseInt(id || "0", 10);

  const [ formData, setFormData ] = useState({INITIAL_STATE});
  const [ releaseOptions, setReleaseOptions ] = useState([]);
  const [errors, setErrors] = useState({});

  const fetchReleases = useCallback(async (token) => {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/releases`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error('Failed to fetch releases');

    // return (await response.json() || []).map(item => ({
    //   value: item.value ?? item.id ?? '',
    //   label: item.label ?? item.value ?? item.id ?? '',
    // }));
    return (await response.json() || []).map(item => ({
      value: item.id || '',
      label: item.value || '',
    }));
  }, []);

  useEffect(() => {
    if (!sessionChecked || !jwtToken) return;
    if (typeof setReleaseOptions !== 'function') {
      console.log("setReleaseOptions type:", typeof setReleaseOptions);
      console.error("setReleaseOptions is not a function");
      return;
    }
    fetchReleases(jwtToken)
      .then(options => setReleaseOptions(options))
      .catch(handleError);
  }, [jwtToken, sessionChecked, fetchReleases, setReleaseOptions]);


  const fetchAppData = useCallback(async (token, id) => {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/apps/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) throw new Error('Failed to fetch app details');

    return response.json();
  }, []);

  useEffect(() => {
    if (!sessionChecked || !jwtToken) return;
    if (appId === 0) {
      setFormData(INITIAL_STATE);
      return;
    }
    if (isNaN(appId) || appId < 0) {
      handleError(new Error('Invalid application ID'));
      return;
    }
    // Fetch app details if editing an existing app

    fetchAppData(jwtToken, appId)
      .then(data => {
        // Additional processing if needed
        console.log("Fetched app data:", data);
        setFormData(data || INITIAL_STATE);
      })
      .catch(handleError);
  }, [appId, jwtToken, sessionChecked, fetchAppData]);

  // console.log("FORM DATA:", formData);

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitForm = async (event) => {
    event.preventDefault();

    const validationErrors = validateForm(formData, FIELD_GROUPS);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    console.log("Form data to submit:", formData);
    try {
      await submitAppForm(formData, appId, jwtToken);
      navigate('/apps');
    } catch (error) {
      handleError(error);
    }
  };

  return (
  <>
    <NavBar />
    <form onSubmit={handleSubmitForm} className="container-lg my-4">
      <GeneralInformation
        formData={formData}
        handleChange={handleFormChange}
        errors={errors}
        releaseOptions={releaseOptions}
      />

      <TechnicalSpecifications
        formData={formData}
        handleChange={handleFormChange}
        errors={errors}
      />

      <BusinessModel
        formData={formData}
        handleChange={handleFormChange}
        errors={errors}
      />

      <DevelopmentStack
        formData={formData}
        handleChange={handleFormChange}
        errors={errors}
      />

      <AnalyticsMetrics
        formData={formData}
        handleChange={handleFormChange}
        errors={errors}
      />

      <ComplianceOperations
        formData={formData}
        handleChange={handleFormChange}
        errors={errors}
      />

      <ImpactStrategy
        formData={formData}
        handleChange={handleFormChange}
        errors={errors}
      />

      <div className="d-flex justify-content-end gap-3 mt-4">
        <button type="submit" className="btn btn-primary btn-lg">
          <i className="bi bi-save me-2"></i>
          Save Application
        </button>
      </div>
    </form>
  </>
  );
};

export { EditApp };
