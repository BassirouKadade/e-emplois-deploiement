import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { QueryClient, QueryClientProvider } from 'react-query';
import ErrorBoundary from './services/ErrorBoundary.jsx';
import EmploisPDF from './pdf/emplois/EmploisPDF';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <ErrorBoundary>
      <App />
      <EmploisPDF />
    </ErrorBoundary>
  </QueryClientProvider>
);