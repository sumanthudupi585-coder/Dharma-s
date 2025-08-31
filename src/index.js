import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import * as Sentry from '@sentry/react';
import pkg from '../package.json';

const DSN = process.env.REACT_APP_SENTRY_DSN;
if (DSN) {
  Sentry.init({
    dsn: DSN,
    release: `${pkg.name}@${pkg.version}`,
    environment: process.env.REACT_APP_ENV || process.env.NODE_ENV,
    integrations: [Sentry.browserTracingIntegration()],
    tracesSampleRate: 0.2
  });
  Sentry.setTag('app', pkg.name);
  // Global error capture
  window.addEventListener('error', (e) => {
    try { Sentry.captureException(e.error || e.message || e); } catch (_) {}
  });
  window.addEventListener('unhandledrejection', (e) => {
    try { Sentry.captureException(e.reason || e); } catch (_) {}
  });
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
