import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { CategoryProvider } from './context/CategoryContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CategoryProvider>
      <App />
    </CategoryProvider>
  </StrictMode>
);
