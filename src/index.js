import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ErrorPage from './components/ErrorPage';
import Home from './components/Home';
import Apps from './components/Apps';
import Databases from './components/Databases';
import Roles from './components/Roles';
import Users from './components/Users';
import Groups from './components/Groups';
import Profiles from './components/Profiles';
import IPs from './components/IPs';
import Regions from './components/Regions';
import Biometrics from './components/Biometrics';
import Login from './components/Login';
// import Logout from './components/Logout';
import Thisapp from './components/ThisApp';
// import ManageCatalogue from './components/ManageCatalogue';
import EditApp from './components/EditApp';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {index: true, element: <Home /> },
      {
        path: "/apps",
        element: <Apps />,
      },
      {
        path: "/apps/:id",
        element: <Thisapp />,
      },
      {
        path: "/databases",
        element: <Databases />,
      },
      {
        path: "/roles",
        element: <Roles />,
      },
      {
        path: "/users",
        element: <Users />,
      },
      {
        path: "/groups",
        element: <Groups />,
      },
      {
        path: "/profiles",
        element: <Profiles />,
      },
      {
        path: "/ips",
        element: <IPs />,
      },
      {
        path: "/regions",
        element: <Regions />,
      },
      {
        path: "/biometrics",
        element: <Biometrics />,
      },
      {
        path: "login",
        element: <Login />,
      },
      // {
      //   path: "/logout",
      //   element: <Logout />,
      // },
      // {
      //   path: "/manage-catalogue",
      //   element: <ManageCatalogue />,
      // },
      {
        path: "/thisapp/:id",
        element: <EditApp />,
      },
      {
        path: "/admin/thisapp/0",
        element: <EditApp />,
      },
    ]
  }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);