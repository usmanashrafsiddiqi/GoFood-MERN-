import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

// Ensure that the root element exists
const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
} else {
  console.error("Root element not found. Make sure there's an element with id 'root' in your HTML.");
}
