import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'sonner';
import { AuthProvider } from './lib/AuthContext';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <AuthProvider>
    <App />
    <Toaster duration={1500} position='top-center' richColors />
  </AuthProvider>
  // </StrictMode>
);
