import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import * as Sentry from '@sentry/react';
import { name, version } from '../package.json';

const DSN = process.env.REACT_APP_SENTRY_DSN;
if (DSN) {
  Sentry.init({
    dsn: DSN,
    release: `${name}@${version}`,
    environment: process.env.REACT_APP_ENV || process.env.NODE_ENV,
    integrations: [Sentry.browserTracingIntegration()],
    tracesSampleRate: 0.2
  });
  Sentry.setTag('app', name);
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
