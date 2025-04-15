import React from 'react';
import { createRoot } from 'react-dom/client'; // Correct import for React 18
import App from './App';

// React 18 way of rendering
const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
