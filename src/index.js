import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import * as Sentry from '@sentry/react';

const DSN = process.env.REACT_APP_SENTRY_DSN;
if (DSN) {
  Sentry.init({ dsn: DSN, tracesSampleRate: 0.15 });
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
