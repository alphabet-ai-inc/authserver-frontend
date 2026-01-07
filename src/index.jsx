import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { ErrorPage } from './components/ErrorPage';
import { Home } from './components/Home';
import { Apps } from './components/apps/Apps';
import { About } from './components/About';
import { Databases } from './components/Databases';
import { Roles } from './components/Roles';
import { Users } from './components/users/Users';
import { Groups } from './components/Groups';
import { Profiles } from './components/Profiles';
import { IPs } from './components/IPs';
import { Regions } from './components/Regions';
import { Biometrics } from './components/Biometrics';
import { Login } from './components/Login';
// import Logout from './components/Logout';
import { ThisApp } from './components/apps/ThisApp';
import { ThisUser } from './components/users/ThisUser';  // ADDED
// import ManageCatalogue from './components/ManageCatalogue';
import { EditApp } from './components/apps/EditApp';
import { EditUser } from './components/users/EditUser';  // ADDED
import { UserActivityLog } from './components/users/UserActivityLog.jsx';  // ADDED
import { UserProfile } from './components/users/UserProfile';  // ADDED
import { UserSettings } from './components/users/UserSettings';  // ADDED
import { UserPermissions } from './components/users/UserPermissions';  // ADDED
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from './ProtectedRoute.jsx';  // ADDED for route protection

// Override console.error to ignore websocket errors.
// websocket is important in continuous operation, so we don't want to log these errors.
// for instance, chat applications rely on websockets for real-time communication
const originalError = console.error;
console.error = function (...args) {
  if (args.some(arg => typeof arg === "string" && arg.toLowerCase().includes("websocket"))) {
    return; // Ignore websocket errors
  }
  originalError.apply(console, args);
};

// Create route configurations for better organization
const routeConfig = {
  public: [
    { path: "/", element: <Home /> },
    { path: "/about", element: <About /> },
    { path: "/login", element: <Login /> },
    { path: "/errorPage", element: <ErrorPage /> },
  ],
  protected: [
    // Dashboard & Home
    { path: "/home", element: <Home /> },

    // Application Management
    { path: "/apps", element: <Apps /> },
    { path: "/thisapp/", element: <ThisApp /> },
    { path: "/editapp/0", element: <EditApp /> },
    { path: "/thisapp/:id", element: <ThisApp /> },
    { path: "/editapp/:id", element: <EditApp /> },

    // Database Management
    { path: "/databases", element: <Databases /> },

    // User Management
    { path: "/users", element: <Users /> },
    { path: "/user/:id", element: <ThisUser /> },  // ADDED: User detail view
    { path: "/edituser/0", element: <EditUser /> }, // ADDED: Create new user
    { path: "/edituser/:id", element: <EditUser /> }, // ADDED: Edit existing user

    // User-specific routes
    { path: "/user/:id/activity", element: <UserActivityLog /> },  // ADDED: User activity log
    { path: "/user/:id/profile", element: <UserProfile /> },  // ADDED: User profile
    { path: "/user/:id/settings", element: <UserSettings /> },  // ADDED: User settings
    { path: "/user/:id/permissions", element: <UserPermissions /> },  // ADDED: User permissions

    // Access Control
    { path: "/roles", element: <Roles /> },
    { path: "/groups", element: <Groups /> },
    { path: "/profiles", element: <Profiles /> },

    // Security & Infrastructure
    { path: "/ips", element: <IPs /> },
    { path: "/regions", element: <Regions /> },
    { path: "/biometrics", element: <Biometrics /> },

    // Catch-all route (must be last)
    { path: "*", element: <App /> },
  ]
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider backendUrl={import.meta.env.VITE_BACKEND_URL}>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          {routeConfig.public.map((route, index) => (
            <Route key={`public-${index}`} path={route.path} element={route.element} />
          ))}

          {/* Protected Routes */}
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
  </React.StrictMode>
);