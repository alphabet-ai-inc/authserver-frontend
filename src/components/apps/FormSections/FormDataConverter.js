// apps/FormSections/FormDataConverter.js
// Main conversion function
// Field type definitions - UPDATED TO MATCH NewApp MODEL
const NUMBER_FIELDS = [
  'id', 'created', 'updated', 'size', 'error_rate', 'average_response_time',
  'uptime_percentage', 'active_users', 'user_retention_rate',
  'user_acquisition_cost', 'churn_rate', 'monthly_recurring_revenue',
  'fundings_investment'
];

const BOOLEAN_FIELDS = [
  // No boolean fields in NewApp model - add if you add any later
];

const ARRAY_FIELDS = [
  'platform', 'compatibility', 'integration_capabilities', 'development_stack',
  'security_features', 'regulatory_compliance', 'revenue_streams',
  'customer_segments', 'channels', 'pricing_tiers', 'partnerships',
  'cost_structure', 'customer_relationships', 'key_activities',
  'user_feedback', 'backup_recovery_options', 'localization_support',
  'accessibility_features', 'team_structure', 'intellectual_property',
  'analytics_tools', 'key_metrics'
];

const DATE_FIELDS = [
  'created', 'updated' // These are int64 timestamps in your model
];

const FILE_FIELDS = [
  'logo' // URL or path in your model
];

const STRING_FIELDS = [
  'name', 'release', 'path', 'init', 'web', 'title', 'description',
  'positioning_stmt', 'logo', 'category', 'developer', 'license_type',
  'api_documentation', 'value_proposition', 'unfair_advantage', 'roadmap',
  'version_control', 'data_backup_location', 'environmental_impact',
  'social_impact', 'exit_strategy', 'url', 'landing_page'
];
export const convertFormDataForAPI = (formData, isCreate = false) => {
  const converted = { ...formData };

  // Remove id for create operations
  if (isCreate) {
    delete converted.id;
  }

  // Convert number fields - handle empty strings properly
  NUMBER_FIELDS.forEach(field => {
    if (converted[field] !== undefined && converted[field] !== null && converted[field] !== '') {
      if (typeof converted[field] === 'string') {
        const num = Number(converted[field]);
        converted[field] = isNaN(num) ? null : num;
      }
      // If it's already a number, keep it
    } else if (converted[field] === '') {
      // Empty string should become null for number fields
      converted[field] = null;
    }
    // If undefined or null, leave as is
  });

  // Handle created and updated fields specifically
  if (isCreate && (!converted.created || converted.created === '')) {
    // For new records, set created to current timestamp if empty
    converted.created = Math.floor(Date.now() / 1000);
  }

  if (!converted.updated || converted.updated === '') {
    // Always set updated to current timestamp if empty
    converted.updated = Math.floor(Date.now() / 1000);
  }

  // Convert boolean fields
  BOOLEAN_FIELDS.forEach(field => {
    if (converted[field] !== undefined && converted[field] !== null) {
      converted[field] = Boolean(converted[field]);
    }
  });

  // Convert array fields
  ARRAY_FIELDS.forEach(field => {
    if (converted[field] !== undefined && converted[field] !== null) {
      if (typeof converted[field] === 'string') {
        converted[field] = converted[field]
          .split('\n')
          .map(item => item.trim())
          .filter(item => item.length > 0);
      } else if (!Array.isArray(converted[field])) {
        converted[field] = [];
      }
    } else {
      converted[field] = [];
    }
  });

  // Handle file fields - specifically the logo issue
  FILE_FIELDS.forEach(field => {
    if (converted[field] instanceof File) {
      // Files need separate handling - set to null for now
      converted[field] = null;
    } else if (converted[field] && typeof converted[field] === 'object' && Object.keys(converted[field]).length === 0) {
      // Empty object should be null
      converted[field] = null;
    } else if (typeof converted[field] === 'string' &&
               !converted[field].startsWith('http') &&
               !converted[field].startsWith('data:') &&
               converted[field].trim() !== '') {
      converted[field] = null;
    }
  });

  return converted;
};

// Export field type definitions for use elsewhere
export {
  NUMBER_FIELDS,
  BOOLEAN_FIELDS,
  ARRAY_FIELDS,
  DATE_FIELDS,
  FILE_FIELDS,
  STRING_FIELDS
};