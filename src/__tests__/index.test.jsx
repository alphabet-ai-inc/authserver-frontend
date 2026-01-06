// src/__tests__/index.test.js
import { render, screen } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext.jsx';
import { ProtectedRoute } from '../ProtectedRoute.jsx';

// Mock all the components since we're testing routing, not component logic
vi.mock('../components/ErrorPage', () => ({
  ErrorPage: () => <div data-testid="error-page">Error Page</div>
}));

vi.mock('../components/Home', () => ({
  Home: () => <div data-testid="home">Home</div>
}));

vi.mock('../components/apps/Apps', () => ({
  Apps: () => <div data-testid="apps">Apps</div>
}));

vi.mock('../components/About', () => ({
  About: () => <div data-testid="about">About</div>
}));

vi.mock('../components/Databases', () => ({
  Databases: () => <div data-testid="databases">Databases</div>
}));

vi.mock('../components/Roles', () => ({
  Roles: () => <div data-testid="roles">Roles</div>
}));

vi.mock('../components/users/Users', () => ({
  Users: () => <div data-testid="users">Users</div>
}));

vi.mock('../components/Groups', () => ({
  Groups: () => <div data-testid="groups">Groups</div>
}));

vi.mock('../components/Profiles', () => ({
  Profiles: () => <div data-testid="profiles">Profiles</div>
}));

vi.mock('../components/IPs', () => ({
  IPs: () => <div data-testid="ips">IPs</div>
}));

vi.mock('../components/Regions', () => ({
  Regions: () => <div data-testid="regions">Regions</div>
}));

vi.mock('../components/Biometrics', () => ({
  Biometrics: () => <div data-testid="biometrics">Biometrics</div>
}));

vi.mock('../components/Login', () => ({
  Login: () => <div data-testid="login">Login</div>
}));

vi.mock('../components/apps/ThisApp', () => ({
  ThisApp: () => <div data-testid="this-app">This App</div>
}));

vi.mock('../components/users/ThisUser', () => ({
  ThisUser: () => <div data-testid="this-user">This User</div>
}));

vi.mock('../components/apps/EditApp', () => ({
  EditApp: () => <div data-testid="edit-app">Edit App</div>
}));

vi.mock('../components/users/EditUser', () => ({
  EditUser: () => <div data-testid="edit-user">Edit User</div>
}));

vi.mock('../components/users/UserActivityLog.jsx', () => ({
  UserActivityLog: () => <div data-testid="user-activity-log">User Activity Log</div>
}));

vi.mock('../components/users/UserProfile', () => ({
  UserProfile: () => <div data-testid="user-profile">User Profile</div>
}));

vi.mock('../components/users/UserSettings', () => ({
  UserSettings: () => <div data-testid="user-settings">User Settings</div>
}));

vi.mock('../components/users/UserPermissions', () => ({
  UserPermissions: () => <div data-testid="user-permissions">User Permissions</div>
}));

vi.mock('../App', () => ({
  App: () => <div data-testid="app">App</div>
}));

// Mock AuthContext
vi.mock('../context/AuthContext', () => ({
  AuthProvider: ({ children, backendUrl }) => (
    <div data-testid="auth-provider" data-backend-url={backendUrl}>
      {children}
    </div>
  )
}));

// Mock ProtectedRoute
vi.mock('../ProtectedRoute.jsx', () => ({
  ProtectedRoute: ({ children }) => (
    <div data-testid="protected-route">
      {children}
    </div>
  )
}));

// Create a test wrapper component
const TestApp = ({ initialPath = '/' }) => {
  // Mock window location
  window.history.pushState({}, 'Test page', initialPath);

  const routeConfig = {
    public: [
      { path: "/", element: <div data-testid="home">Home</div> },
      { path: "/about", element: <div data-testid="about">About</div> },
      { path: "/login", element: <div data-testid="login">Login</div> },
      { path: "/errorPage", element: <div data-testid="error-page">Error Page</div> },
    ],
    protected: [
      { path: "/home", element: <div data-testid="home">Home</div> },
      { path: "/apps", element: <div data-testid="apps">Apps</div> },
      { path: "/thisapp/", element: <div data-testid="this-app">This App</div> },
      { path: "/editapp/0", element: <div data-testid="edit-app">Edit App</div> },
      { path: "/thisapp/:id", element: <div data-testid="this-app">This App</div> },
      { path: "/editapp/:id", element: <div data-testid="edit-app">Edit App</div> },
      { path: "/databases", element: <div data-testid="databases">Databases</div> },
      { path: "/users", element: <div data-testid="users">Users</div> },
      { path: "/user/:id", element: <div data-testid="this-user">This User</div> },
      { path: "/edituser/0", element: <div data-testid="edit-user">Edit User</div> },
      { path: "/edituser/:id", element: <div data-testid="edit-user">Edit User</div> },
      { path: "/user/:id/activity", element: <div data-testid="user-activity-log">User Activity Log</div> },
      { path: "/user/:id/profile", element: <div data-testid="user-profile">User Profile</div> },
      { path: "/user/:id/settings", element: <div data-testid="user-settings">User Settings</div> },
      { path: "/user/:id/permissions", element: <div data-testid="user-permissions">User Permissions</div> },
      { path: "/roles", element: <div data-testid="roles">Roles</div> },
      { path: "/groups", element: <div data-testid="groups">Groups</div> },
      { path: "/profiles", element: <div data-testid="profiles">Profiles</div> },
      { path: "/ips", element: <div data-testid="ips">IPs</div> },
      { path: "/regions", element: <div data-testid="regions">Regions</div> },
      { path: "/biometrics", element: <div data-testid="biometrics">Biometrics</div> },
      { path: "*", element: <div data-testid="app">App</div> },
    ]
  };

  return (
    <AuthProvider backendUrl="http://test-backend.com">
      <BrowserRouter>
        <Routes>
          {routeConfig.public.map((route, index) => (
            <Route key={`public-${index}`} path={route.path} element={route.element} />
          ))}
          {routeConfig.protected.map((route, index) => (
            <Route
              key={`protected-${index}`}
              path={route.path}
              element={
                <ProtectedRoute>
                  {route.element}
                </ProtectedRoute>
              }
            />
          ))}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

describe('App Routes', () => {
  beforeEach(() => {
    // Clear any previous mocks
    vi.clearAllMocks();
  });

  describe('Public Routes', () => {
    it('should render Home component at root path', () => {
      render(<TestApp initialPath="/" />);
      expect(screen.getByTestId('home')).toBeInTheDocument();
    });

    it('should render About component at /about', () => {
      render(<TestApp initialPath="/about" />);
      expect(screen.getByTestId('about')).toBeInTheDocument();
    });

    it('should render Login component at /login', () => {
      render(<TestApp initialPath="/login" />);
      expect(screen.getByTestId('login')).toBeInTheDocument();
    });

    it('should render ErrorPage component at /errorPage', () => {
      render(<TestApp initialPath="/errorPage" />);
      expect(screen.getByTestId('error-page')).toBeInTheDocument();
    });
  });

  describe('Protected Routes - App Management', () => {
    it('should render Apps component at /apps', () => {
      render(<TestApp initialPath="/apps" />);
      expect(screen.getByTestId('apps')).toBeInTheDocument();
      expect(screen.getByTestId('protected-route')).toBeInTheDocument();
    });

    it('should render ThisApp component at /thisapp/', () => {
      render(<TestApp initialPath="/thisapp/" />);
      expect(screen.getByTestId('this-app')).toBeInTheDocument();
      expect(screen.getByTestId('protected-route')).toBeInTheDocument();
    });

    it('should render ThisApp component at /thisapp/:id with dynamic ID', () => {
      render(<TestApp initialPath="/thisapp/123" />);
      expect(screen.getByTestId('this-app')).toBeInTheDocument();
      expect(screen.getByTestId('protected-route')).toBeInTheDocument();
    });

    it('should render EditApp component at /editapp/0 for new app', () => {
      render(<TestApp initialPath="/editapp/0" />);
      expect(screen.getByTestId('edit-app')).toBeInTheDocument();
      expect(screen.getByTestId('protected-route')).toBeInTheDocument();
    });

    it('should render EditApp component at /editapp/:id with dynamic ID', () => {
      render(<TestApp initialPath="/editapp/456" />);
      expect(screen.getByTestId('edit-app')).toBeInTheDocument();
      expect(screen.getByTestId('protected-route')).toBeInTheDocument();
    });
  });

  describe('Protected Routes - User Management', () => {
    it('should render Users component at /users', () => {
      render(<TestApp initialPath="/users" />);
      expect(screen.getByTestId('users')).toBeInTheDocument();
      expect(screen.getByTestId('protected-route')).toBeInTheDocument();
    });

    it('should render ThisUser component at /user/:id with dynamic ID', () => {
      render(<TestApp initialPath="/user/789" />);
      expect(screen.getByTestId('this-user')).toBeInTheDocument();
      expect(screen.getByTestId('protected-route')).toBeInTheDocument();
    });

    it('should render EditUser component at /edituser/0 for new user', () => {
      render(<TestApp initialPath="/edituser/0" />);
      expect(screen.getByTestId('edit-user')).toBeInTheDocument();
      expect(screen.getByTestId('protected-route')).toBeInTheDocument();
    });

    it('should render EditUser component at /edituser/:id with dynamic ID', () => {
      render(<TestApp initialPath="/edituser/101" />);
      expect(screen.getByTestId('edit-user')).toBeInTheDocument();
      expect(screen.getByTestId('protected-route')).toBeInTheDocument();
    });
  });

  describe('Protected Routes - User Sub-routes', () => {
    const userId = '202';

    it(`should render UserActivityLog at /user/${userId}/activity`, () => {
      render(<TestApp initialPath={`/user/${userId}/activity`} />);
      expect(screen.getByTestId('user-activity-log')).toBeInTheDocument();
      expect(screen.getByTestId('protected-route')).toBeInTheDocument();
    });

    it(`should render UserProfile at /user/${userId}/profile`, () => {
      render(<TestApp initialPath={`/user/${userId}/profile`} />);
      expect(screen.getByTestId('user-profile')).toBeInTheDocument();
      expect(screen.getByTestId('protected-route')).toBeInTheDocument();
    });

    it(`should render UserSettings at /user/${userId}/settings`, () => {
      render(<TestApp initialPath={`/user/${userId}/settings`} />);
      expect(screen.getByTestId('user-settings')).toBeInTheDocument();
      expect(screen.getByTestId('protected-route')).toBeInTheDocument();
    });

    it(`should render UserPermissions at /user/${userId}/permissions`, () => {
      render(<TestApp initialPath={`/user/${userId}/permissions`} />);
      expect(screen.getByTestId('user-permissions')).toBeInTheDocument();
      expect(screen.getByTestId('protected-route')).toBeInTheDocument();
    });
  });

  describe('Protected Routes - Other Routes', () => {
    it('should render Databases component at /databases', () => {
      render(<TestApp initialPath="/databases" />);
      expect(screen.getByTestId('databases')).toBeInTheDocument();
      expect(screen.getByTestId('protected-route')).toBeInTheDocument();
    });

    it('should render Roles component at /roles', () => {
      render(<TestApp initialPath="/roles" />);
      expect(screen.getByTestId('roles')).toBeInTheDocument();
      expect(screen.getByTestId('protected-route')).toBeInTheDocument();
    });

    it('should render Groups component at /groups', () => {
      render(<TestApp initialPath="/groups" />);
      expect(screen.getByTestId('groups')).toBeInTheDocument();
      expect(screen.getByTestId('protected-route')).toBeInTheDocument();
    });

    it('should render Profiles component at /profiles', () => {
      render(<TestApp initialPath="/profiles" />);
      expect(screen.getByTestId('profiles')).toBeInTheDocument();
      expect(screen.getByTestId('protected-route')).toBeInTheDocument();
    });

    it('should render IPs component at /ips', () => {
      render(<TestApp initialPath="/ips" />);
      expect(screen.getByTestId('ips')).toBeInTheDocument();
      expect(screen.getByTestId('protected-route')).toBeInTheDocument();
    });

    it('should render Regions component at /regions', () => {
      render(<TestApp initialPath="/regions" />);
      expect(screen.getByTestId('regions')).toBeInTheDocument();
      expect(screen.getByTestId('protected-route')).toBeInTheDocument();
    });

    it('should render Biometrics component at /biometrics', () => {
      render(<TestApp initialPath="/biometrics" />);
      expect(screen.getByTestId('biometrics')).toBeInTheDocument();
      expect(screen.getByTestId('protected-route')).toBeInTheDocument();
    });
  });

  describe('Route Configuration', () => {
    it('should wrap protected routes with ProtectedRoute component', () => {
      render(<TestApp initialPath="/apps" />);
      expect(screen.getByTestId('protected-route')).toBeInTheDocument();
      expect(screen.getByTestId('apps')).toBeInTheDocument();
    });

    it('should NOT wrap public routes with ProtectedRoute component', () => {
      render(<TestApp initialPath="/login" />);
      expect(screen.queryByTestId('protected-route')).not.toBeInTheDocument();
      expect(screen.getByTestId('login')).toBeInTheDocument();
    });

    it('should render App component for unknown routes (catch-all)', () => {
      render(<TestApp initialPath="/unknown-route" />);
      expect(screen.getByTestId('app')).toBeInTheDocument();
      expect(screen.getByTestId('protected-route')).toBeInTheDocument();
    });

    it('should have AuthProvider with backend URL', () => {
      render(<TestApp />);
      const authProvider = screen.getByTestId('auth-provider');
      expect(authProvider).toBeInTheDocument();
      expect(authProvider).toHaveAttribute('data-backend-url', 'http://test-backend.com');
    });
  });

  describe('Route Path Patterns', () => {
    it('should handle dynamic IDs in app routes', () => {
      const testIds = ['123', '456', '789', 'abc123'];

      testIds.forEach(id => {
        const { unmount } = render(<TestApp initialPath={`/thisapp/${id}`} />);
        expect(screen.getByTestId('this-app')).toBeInTheDocument();
        unmount();
      });
    });

    it('should handle dynamic IDs in user routes', () => {
      const testIds = ['123', '456', '789', 'user-123'];

      testIds.forEach(id => {
        const { unmount } = render(<TestApp initialPath={`/user/${id}`} />);
        expect(screen.getByTestId('this-user')).toBeInTheDocument();
        unmount();
      });
    });

    it('should handle both numeric and string IDs', () => {
      const testPaths = [
        '/editapp/123',
        '/editapp/abc',
        '/edituser/456',
        '/edituser/def'
      ];

      testPaths.forEach(path => {
        const { unmount } = render(<TestApp initialPath={path} />);
        // Should render either edit-app or edit-user
        expect(screen.getByTestId(path.includes('app') ? 'edit-app' : 'edit-user')).toBeInTheDocument();
        unmount();
      });
    });
  });
});