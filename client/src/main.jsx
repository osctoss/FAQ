import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { QPProvider } from './context/QPContext';
import './index.css';

const futureConfig = {
  v7_startTransition: true,
  v7_relativeSplatPath: true,
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter future={futureConfig}>
      <AuthProvider>
        <QPProvider>
          <App />
        </QPProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);