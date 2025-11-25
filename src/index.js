import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { ErrorPage } from './components/ErrorPage';
import { Home } from './components/Home';
import { Apps } from './components/Apps';
import { About } from './components/About';
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
import { ThisApp } from './components/ThisApp';
// import ManageCatalogue from './components/ManageCatalogue';
import { EditApp } from './components/EditApp';
import { AuthProvider } from "./context/AuthContext";

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

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider backendUrl={process.env.REACT_APP_BACKEND_URL}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/apps" element={<Apps />} />
          <Route path="/about" element={<About />} />
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
          <Route path="/thisapp/" element={<ThisApp />} />
          <Route path="/editapp/0" element={<EditApp />} />
          <Route path="/thisapp/:id" element={<ThisApp />} />
          <Route path="/editapp/:id" element={<EditApp />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<App />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
