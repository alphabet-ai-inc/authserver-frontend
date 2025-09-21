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
        id: 1,
        title: 'Test App',
        created: 1234567890,
        name: 'Test Name',
        init: 'init',
        path: '/test',
        release: '1.0.0',
        updated: 1234567890,
        web: 'https://example.com'
      }),
    })
  );
});

afterEach(() => {
  global.fetch.mockRestore();
});

test('renders ThisApp with fetched data', async () => {
  render(<ThisApp />, { wrapper: MemoryRouter });
  expect(await screen.findByText(/Test App/)).toBeInTheDocument();
  expect(screen.getByText(/Test Name/)).toBeInTheDocument();
});