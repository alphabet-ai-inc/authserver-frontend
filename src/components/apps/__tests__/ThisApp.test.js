// src/components/apps/__tests__/ThisApp.test.js
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ThisApp } from '../ThisApp';
import { useAuth } from '../../../context/AuthContext';
import Swal from 'sweetalert2';
import { useHandleDelete } from '../../../utils/HandleDel';
import { formatUnixTimestamp } from '../../../utils/Unix2Ymd';

// Mock all dependencies
jest.mock('../../../context/AuthContext');
jest.mock('../../../utils/HandleDel');
jest.mock('../../../utils/Unix2Ymd');
jest.mock('sweetalert2');
jest.mock('../../NavBar', () => () => <div data-testid="navbar">NavBar</div>);

// Mock react-router-dom hooks
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: '1' }),
  useNavigate: () => mockNavigate,
}));

// Mock fetch globally
global.fetch = jest.fn();

// Mock window.history.back
const mockBack = jest.fn();
Object.defineProperty(window, 'history', {
  value: {
    back: mockBack
  }
});

// Mock console.log to keep test output clean
global.console.log = jest.fn();

describe('ThisApp Component', () => {
  const mockSetJwtToken = jest.fn();
  const mockHandleDelete = jest.fn();

  const mockAppData = {
    id: 1,
    title: 'Test Application',
    name: 'Test App',
    category: 'Productivity',
    platform: ['Web', 'Mobile'],
    release: 'v2.0',
    updated: 1672531200,
    created: 1672531200,
    description: 'A test application for demonstration',
    positioning_stmt: 'Best test app in the market',
    developer: 'Test Developer Inc.',
    license_type: 'MIT',
    size: '1024000',
    web: 'https://example.com',
    url: 'https://app.example.com',
    landing_page: 'https://landing.example.com',
    path: '/usr/local/app',
    init: 'npm start',
    compatibility: ['Windows', 'macOS', 'Linux'],
    integration_capabilities: ['API', 'Webhooks'],
    development_stack: ['React', 'Node.js', 'PostgreSQL'],
    api_documentation: 'https://docs.example.com',
    security_features: ['SSL', '2FA'],
    regulatory_compliance: ['GDPR', 'HIPAA'],
    version_control: 'Git',
    revenue_streams: ['Subscription', 'One-time purchase'],
    customer_segments: ['Enterprise', 'SMB'],
    channels: ['Web', 'Mobile App'],
    value_proposition: 'Increase productivity by 50%',
    pricing_tiers: ['Free', 'Pro', 'Enterprise'],
    partnerships: ['AWS', 'Google Cloud'],
    cost_structure: ['Infrastructure', 'Development'],
    customer_relationships: ['Email Support', 'Chat'],
    unfair_advantage: 'Patented algorithm',
    error_rate: '0.01%',
    average_response_time: '200ms',
    uptime_percentage: '99.9%',
    key_activities: ['Development', 'Support'],
    roadmap: 'Q1 2024: New features',
    active_users: '10000',
    user_retention_rate: '85%',
    user_acquisition_cost: '$5.00',
    churn_rate: '2%',
    monthly_recurring_revenue: '$50000',
    user_feedback: ['Great app!', 'Needs dark mode'],
    backup_recovery_options: ['Daily Backup', 'Disaster Recovery'],
    localization_support: ['English', 'Spanish', 'French'],
    accessibility_features: ['Screen Reader', 'Keyboard Navigation'],
    team_structure: ['Dev Team', 'Support Team'],
    data_backup_location: 'US East',
    analytics_tools: ['Google Analytics', 'Mixpanel'],
    key_metrics: ['DAU', 'MAU'],
    environmental_impact: 'Carbon neutral',
    social_impact: 'Supports education',
    intellectual_property: ['Patent #12345', 'Trademark'],
    fundings_investment: '$2M',
    exit_strategy: 'Acquisition'
  };

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Mock Auth Context
    useAuth.mockReturnValue({
      jwtToken: 'test-token',
      sessionChecked: true,
      setJwtToken: mockSetJwtToken
    });

    // Mock HandleDelete hook
    useHandleDelete.mockReturnValue(mockHandleDelete);

    // Mock formatUnixTimestamp
    formatUnixTimestamp.mockReturnValue('2023-01-01 00:00:00');

    // Mock fetch response
    fetch.mockResolvedValue({
      json: () => Promise.resolve(mockAppData)
    });

    // Mock Swal
    Swal.fire.mockResolvedValue({ isConfirmed: true });
  });

  const renderComponent = () => {
    return render(
      <MemoryRouter initialEntries={['/app/1']}>
        <Routes>
          <Route path="/app/:id" element={<ThisApp />} />
        </Routes>
      </MemoryRouter>
    );
  };

  describe('Action Bar Functionality', () => {
    it('should navigate to edit page on Edit button click', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Test Application')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Edit Application'));
      expect(mockNavigate).toHaveBeenCalledWith('/editapp/1');
    });

    it('should call delete handler on Delete button click', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Test Application')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Delete'));
      expect(mockHandleDelete).toHaveBeenCalled();
    });
  });
});