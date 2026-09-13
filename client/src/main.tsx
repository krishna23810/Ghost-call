import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '@livekit/components-styles';
import App from './App';
import './index.css';

// Detect base path from Vite configured BASE_URL with root fallback
const configuredBase = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
const basename = window.location.pathname.toLowerCase().startsWith(configuredBase.toLowerCase())
  ? configuredBase
  : '/';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
