import { BaseConverter } from './BaseConverter';

export class AppConverter extends BaseConverter {
  constructor() {
    super({
      numberFields: [
        'id', 'size', 'error_rate', 'average_response_time', 'uptime_percentage',
        'active_users', 'user_retention_rate', 'user_acquisition_cost',
        'churn_rate', 'monthly_recurring_revenue', 'fundings_investment',
        'created', 'updated' // ADD THESE - they're int64 in backend
      ],
      arrayFields: [
        'platform', 'compatibility', 'integration_capabilities', 'development_stack',
        'security_features', 'regulatory_compliance', 'revenue_streams',
        'customer_segments', 'channels', 'pricing_tiers', 'partnerships',
        'cost_structure', 'customer_relationships', 'key_activities',
        'user_feedback', 'backup_recovery_options', 'localization_support',
        'accessibility_features', 'team_structure', 'intellectual_property',
        'analytics_tools', 'key_metrics'
      ],
      fileFields: ['logo'], // ONLY logo - backend doesn't have image/thumbnail/icon

      removeOnCreate: ['id'], // Keep created for new apps

      // App-specific transformations
      afterConvert: (data, isCreate) => {
        const result = { ...data };

        // Remove any remaining unwanted fields
        ['image', 'thumbnail', 'icon'].forEach(field => {
          delete result[field];
        });

        return result;
      },

      fieldTransformations: {
        // Ensure platform is always an array
        platform: (value) => {
          if (value && !Array.isArray(value)) {
            return [value];
          }
          return value;
        }
      }
    });
  }
}

// Convenience function
export const convertAppData = (formData, isCreate = false) => {
  const converter = new AppConverter();
  return converter.convert(formData, isCreate);
};