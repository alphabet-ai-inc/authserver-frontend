import { render, screen } from '@testing-library/react';
import { ThisApp } from './ThisApp';
import { MemoryRouter } from 'react-router-dom';

// Mock useAuth
jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    jwtToken: 'test-token',
    sessionChecked: true,
    setJwtToken: jest.fn(),
  }),
}));

// Mock useParams and useNavigate
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: '1' }),
  useNavigate: () => jest.fn(),
}));

// Mock NavBar
jest.mock('./NavBar', () => ({
  NavBar: () => <div data-testid="navbar" />,
}));

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({
        name: 'prueba',
        release: '1.0.0',
        appid: 1,
        title: 'test app',
        created: 1234567890,
        updated: 1234567890,
        description: 'This is a test app',
        positioningStmt: 'Test positioning statement',
        logo: 'https://example.com/logo.png',
        web: 'https://example.com',
        landingPage: 'https://example.com/landing',
        url: 'https://example.com/test',
        category: 'utility',
        platform: 'web',
        developer: 'Test Dev',
        license: 'MIT',
        size: '100MB',
        init: 'init',
        path: '/test',
        compatibility: 'all',
        integrationCapabilities: 'none',
        developmentStack: 'React',
        apiDocumentation: 'https://api.example.com/docs',
        securityFeatures: 'OAuth2',
        regulatoryCompliance: 'GDPR',
        revenuesStreams: 'subscription',
        customerSegments: 'general',
        channels: 'online',
        valueProposition: 'Useful app',
        pricingTiers: 'free, premium',
        partnerships: 'none',
        costStructure: 'low',
        customerRelationships: 'automated',
        unfairAdvantage: 'unique feature',
        roadMap: 'v1.0, v2.0',
        versionControl: 'git',
        errorRate: '0.01%',
        averageResponseTime: '200ms',
        uptimePercentage: '99.9%',
        keyActivities: 'development, marketing',
        activeUsers: 1000,
        userRetentionRate: '85%',
        userAcquesitionCost: '$10',
        churnRate: '5%',
        monthlyRecurringRevenue: '$5000',
        userFeedback: '$60000',
        backupRecoveryOptions: 'daily backups',
        localizationSupport: 'multi-language',
        accessibilityFeatures: 'screen reader support',
        teamStructure: '5 developers',
        dataBackupLocation: 'EU',
        environmentalImpact: 'low',
        socialImpact: 'community support',
        intellectualProperty: 'patents',
        fundingInvestment: 'seed funding',
        exitStrategy: 'acquisition',
        analyticsTools: 'Google Analytics',
      }),
    })
  );
});

afterEach(() => {
  global.fetch.mockRestore();
});

test('renders ThisApp with fetched data', async () => {
  render(<ThisApp />, { wrapper: MemoryRouter });
  expect(await screen.findByText(/test app/i)).toBeInTheDocument();
  expect(screen.getByText(/prueba/i)).toBeInTheDocument();
});