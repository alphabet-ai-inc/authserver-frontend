// config/selectOptions.js
export const CUSTOMER_SEGMENTS = [
  { value: 'enterprise', label: 'Enterprise Businesses' },
  { value: 'smb', label: 'Small & Medium Businesses' },
  { value: 'startups', label: 'Startups' },
  { value: 'developers', label: 'Developers' },
  { value: 'consumers', label: 'Individual Consumers' },
  { value: 'education', label: 'Educational Institutions' },
  { value: 'government', label: 'Government Agencies' },
  { value: 'non_profit', label: 'Non-Profit Organizations' }
];

export const PLATFORMS = [
  { value: 'web', label: 'Web' },
  { value: 'mobile_ios', label: 'Mobile iOS' },
  { value: 'mobile_android', label: 'Mobile Android' },
  { value: 'desktop_windows', label: 'Desktop Windows' },
  { value: 'desktop_mac', label: 'Desktop macOS' },
  { value: 'desktop_linux', label: 'Desktop Linux' },
  { value: 'cloud', label: 'Cloud' },
  { value: 'saas', label: 'SaaS' },
  { value: 'on_premise', label: 'On-Premise' }
];

export const LICENSE_TYPES = [
  { value: 'proprietary', label: 'Proprietary' },
  { value: 'open_source', label: 'Open Source' },
  { value: 'freeware', label: 'Freeware' },
  { value: 'shareware', label: 'Shareware' },
  { value: 'subscription', label: 'Subscription' },
  { value: 'freemium', label: 'Freemium' }
];

// Add more option sets as needed...