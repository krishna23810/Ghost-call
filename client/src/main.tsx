import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '@livekit/components-styles';
import App from './App';
import './index.css';

// Automatically detect /Ghost-call base path in production on kktechsolution.app
const basename = window.location.pathname.startsWith('/Ghost-call') ? '/Ghost-call' : '/';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
