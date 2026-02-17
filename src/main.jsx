import './index.css';
import App from './App.jsx';
import { StrictMode } from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter } from 'react-router';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './context/AuthContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename="/medfhirboot-pma">
      <AuthProvider>
        <App />
        <Toaster
          position="top-center"
          toastOptions={{
            className: "rounded-xl bg-neutral text-neutral-content shadow-xl px-7 py-5 text-lg",
            duration: 3000,
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
