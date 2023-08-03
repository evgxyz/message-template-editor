import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AppEnvProvider } from './hooks/appEnv';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <AppEnvProvider>
      <App />
    </AppEnvProvider>
  </React.StrictMode>
);
