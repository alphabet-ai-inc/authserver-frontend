import { render, screen, waitFor } from '@testing-library/react';
import { EditApp } from './EditApp';
import { MemoryRouter } from 'react-router-dom';

// Mock useAuth
jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    jwtToken: 'test-token',
    sessionChecked: true,
  }),
}));

// Mock useParams and useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: '1' }),
  useNavigate: () => mockNavigate,
}));

// Mock NavBar
jest.mock('./NavBar', () => ({
  NavBar: () => <div data-testid="navbar" />,
}));

// Mock Input, Select, TextArea
jest.mock('./form/Input', () => ({
  Input: (props) => <input {...props} data-testid={props.id} />,
}));
jest.mock('./form/Select', () => ({
  Select: (props) => <select {...props} data-testid={props.id} />,
}));
jest.mock('./form/TextArea', () => ({
  TextArea: (props) => <textarea {...props} data-testid={props.id} />,
}));

// Mock SweetAlert2
jest.mock('sweetalert2', () => ({
  fire: jest.fn(() => Promise.resolve({ then: (cb) => cb && cb() })),
}));

// Mock fetch
beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        id: 1,
        name: 'Test App',
        release: 'A',
        path: '/test',
        init: 'init',
        web: 'https://example.com',
        title: 'Test Title',
        created: 1234567890,
        updated: 1234567890,
      }),
    })
  );
});
afterEach(() => {
  global.fetch.mockRestore();
});

test('renders EditApp form and loads app data', async () => {
  render(<EditApp />, { wrapper: MemoryRouter });

  // NavBar should be present
  expect(screen.getByTestId('navbar')).toBeInTheDocument();

  // Wait for the app name to be loaded into the input
  await waitFor(() => {
    expect(screen.getByDisplayValue('Test App')).toBeInTheDocument();
  });
  await waitFor(() => {
    expect(screen.getByDisplayValue('/test')).toBeInTheDocument();
  });
  await waitFor(() => {
    expect(screen.getByDisplayValue('init')).toBeInTheDocument();
  });
  await waitFor(() => {
    expect(screen.getByDisplayValue('https://example.com')).toBeInTheDocument();
  });
  await waitFor(() => {
    expect(screen.getByDisplayValue('Test Title')).toBeInTheDocument();
  });

  // The form should have a save button
  expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
});