import './index.css';

import App from './App.tsx';
import { StrictMode } from 'react';
import { ThemeProvider } from '@emotion/react';
import { createRoot } from 'react-dom/client';
import { theme } from '@styles/theme.ts';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </StrictMode>
);
