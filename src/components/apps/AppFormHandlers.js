import { handleError } from "../../utils/fetchHandling";

export const fetchAppDetails = async (jwtToken) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/releases`, {
      headers: { Authorization: `Bearer ${jwtToken}` }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch releases');
    }

    const releases = await response.json();

    return {
      release: releases.map(r => ({ value: r.id, label: r.value }))
    };
  } catch (error) {
    handleError(error);
    return {};
  }
};


// In AppFormHandlers.js
export const submitAppForm = async (formData, appId, jwtToken) => {
  try {
    // Transform the data to match backend expectations
    const transformedData = { ...formData };

    // List of fields that should be arrays but might come as strings
    const arrayFields = [
      'platform',
      'compatibility',
      'integration_capabilities',
      'development_stack',
      'regulatory_compliance',
      'revenue_streams',
      'customer_segments',
      'channels',
      'pricing_tiers',
      'partnerships',
      'cost_structure',
      'customer_relationships',
      'key_activities',
      'user_feedback',
      'backup_recovery_options',
      'localization_support',
      'accessibility_features',
      'team_structure',
      'intellectual_property',
      'analytics_tools',
      'key_metrics',
    ];

    // Convert string fields to arrays
    arrayFields.forEach(field => {
      if (transformedData[field]) {
        if (typeof transformedData[field] === 'string') {
          try {
            const parsed = JSON.parse(transformedData[field]);
            if (Array.isArray(parsed)) {
              transformedData[field] = parsed;
            }
          } catch {
            transformedData[field] = transformedData[field]
              .split(',')
              .map(item => item.trim())
              .filter(item => item.length > 0);
          }
        }
      } else {
        transformedData[field] = [];
      }
    });

    // console.log("🔄 Transformed data for backend:", transformedData);

    const url = appId === 0
      ? `${process.env.REACT_APP_BACKEND_URL}/admin/apps/0`
      : `${process.env.REACT_APP_BACKEND_URL}/admin/apps/${appId}`;

    const method = appId === 0 ? 'PUT' : 'PATCH';

    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(transformedData),
    });

    // 🚨 PROPER ERROR HANDLING
    if (!response.ok) {
      const errorText = await response.text();

      // Handle token expiration specifically
      if (response.status === 401) {
        throw new Error('SESSION_EXPIRED');
      }

      throw new Error(`Server error: ${response.status} - ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error submitting form:', error);
    throw error; // Re-throw to handle in the component
  }
};