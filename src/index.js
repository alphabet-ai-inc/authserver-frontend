import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { ErrorPage } from './components/ErrorPage';
import { Home } from './components/Home';
import { Apps } from './components/Apps';
import { Databases } from './components/Databases';
import { Roles } from './components/Roles';
import { Users } from './components/Users';
import { Groups } from './components/Groups';
import { Profiles } from './components/Profiles';
import { IPs } from './components/IPs';
import { Regions } from './components/Regions';
import { Biometrics } from './components/Biometrics';
import { Login } from './components/Login';
// import Logout from './components/Logout';
import { Thisapp } from './components/ThisApp';
// import ManageCatalogue from './components/ManageCatalogue';
import { EditApp } from './components/EditApp';
import { AuthProvider } from "./context/AuthContext";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider backendUrl={process.env.REACT_APP_BACKEND_URL}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/apps" element={<Apps />} />
          <Route path="/errorPage" element={<ErrorPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/databases" element={<Databases />} />
          <Route path="/roles" element={<Roles />} />
          <Route path="/users" element={<Users />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/profiles" element={<Profiles />} />
          <Route path="/ips" element={<IPs />} />
          <Route path="/regions" element={<Regions />} />
          <Route path="/biometrics" element={<Biometrics />} />
          <Route path="/thisapp/" element={<Thisapp />} />
          <Route path="/thisapp/0" element={<Thisapp />} />
          <Route path="/thisapp/:id" element={<Thisapp />} />
          <Route path="/editapp/:id" element={<EditApp />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<App />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
// children: [
//   { index: true, element: <Home /> },
//   {
//     path: "/home",
//     element: <Home />,
//   },
//   {
//     path: "/apps",
//     element: <Apps />,
//   },
//   {
//     path: "/apps/:id",
//     element: <Thisapp />,
//   },
//   {
//     path: "/databases",
//     element: <Databases />,
//   },
//   {
//     path: "/roles",
//     element: <Roles />,
//   },
//   {
//     path: "/users",
//     element: <Users />,
//   },
//   {
//     path: "/groups",
//     element: <Groups />,
//   },
//   {
//     path: "/profiles",
//     element: <Profiles />,
//   },
//   {
//     path: "/ips",
//     element: <IPs />,
//   },
//   {
//     path: "/regions",
//     element: <Regions />,
//   },
//   {
//     path: "/biometrics",
//     element: <Biometrics />,
//   },
//   {
//     path: "login",
//     element: <Login />,
//   },
// {
//   path: "/logout",
//   element: <Logout />,
// },
// {
//   path: "/manage-catalogue",
//   element: <ManageCatalogue />,
// },
// {
//   path: "/thisapp/:id",
//   element: <EditApp />,
// },
// {
//   path: "/admin/thisapp/0",
//   element: <EditApp />,
// },
//     ],
//   },
// ]);

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <RouterProvider router={router} />
//   </React.StrictMode>
// );