import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';

// Debug log to confirm script execution in production
console.log("App Loaded Successfully - NepNews Starting");

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error("CRITICAL: Root element not found");
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);