import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { ConfigProvider } from './context/ConfigContext.jsx';
import { NotificationProvider } from './context/NotificationContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { HRMSProvider } from './context/HRMSContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ConfigProvider>
      <NotificationProvider>
        <AuthProvider>
          <HRMSProvider>
            <App />
          </HRMSProvider>
        </AuthProvider>
      </NotificationProvider>
    </ConfigProvider>
  </React.StrictMode>
);
