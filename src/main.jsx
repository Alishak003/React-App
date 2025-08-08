import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './contexts/authContext';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create the query client instance
const queryClient = new QueryClient();
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
          <QueryClientProvider client={queryClient}>
                <App />
    
          </QueryClientProvider>

    </AuthProvider>
  </StrictMode>,
)
