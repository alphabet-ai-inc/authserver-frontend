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

export const ROLES = [
  { id: 'admin', name: 'Administrator', description: 'Full system access' },
  { id: 'manager', name: 'Manager', description: 'Department management access' },
  { id: 'user', name: 'Standard User', description: 'Regular user access' },
  { id: 'viewer', name: 'Viewer', description: 'Read-only access' },
  { id: 'guest', name: 'Guest', description: 'Limited temporary access' },
];

export const PROFILES = [
  { id: 1, name: 'System Admin', permissions: 255 },
  { id: 2, name: 'Content Manager', permissions: 127 },
  { id: 3, name: 'Data Analyst', permissions: 63 },
  { id: 4, name: 'Support Agent', permissions: 31 },
  { id: 5, name: 'Regular User', permissions: 15 },
];

export const GROUPS = [
  { id: 1, name: 'Administrators', type: 'System' },
  { id: 2, name: 'Managers', type: 'Management' },
  { id: 3, name: 'Developers', type: 'Technical' },
  { id: 4, name: 'Support', type: 'Customer Service' },
  { id: 5, name: 'Guests', type: 'Temporary' },
];

export const LANGUAGE_OPTIONS = [
    { value: 'en', label: 'English', flag: '🇺🇸' },
    { value: 'es', label: 'Spanish', flag: '🇪🇸' },
    { value: 'fr', label: 'French', flag: '🇫🇷' },
    { value: 'de', label: 'German', flag: '🇩🇪' },
    { value: 'it', label: 'Italian', flag: '🇮🇹' },
    { value: 'pt', label: 'Portuguese', flag: '🇵🇹' },
    { value: 'zh', label: 'Chinese', flag: '🇨🇳' },
    { value: 'ja', label: 'Japanese', flag: '🇯🇵' },
    { value: 'ru', label: 'Russian', flag: '🇷🇺' },
    { value: 'ar', label: 'Arabic', flag: '🇸🇦' },
];
// export const COMPANY_OPTIONS = [
//     { id: 1, name: 'Main Company', code: 'MAIN' },
//     { id: 2, name: 'Subsidiary A', code: 'SUB-A' },
//     { id: 3, name: 'Subsidiary B', code: 'SUB-B' },
//     { id: 4, name: 'Partner Company', code: 'PARTNER' },
//     { id: 5, name: 'Test Company', code: 'TEST' },
// ];

export const DBSAUTH_ID = [
  { value: 'authserver', label: 'Authentication Server' }
]

export const APP_OPTIONS = [
  { value: 'bank-zero', label: 'BankZero' },
  { value: 'netaget', label:'NETAGET' },
]