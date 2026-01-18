import './index.css';

import App from './App.tsx';
import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import { StrictMode } from 'react';
import { ThemeModeProvider } from '@styles/ThemeContext.tsx';
import { createRoot } from 'react-dom/client';
import { theme } from '@styles/theme.ts';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeModeProvider>
      <EmotionThemeProvider theme={theme}>
        <App />
      </EmotionThemeProvider>
    </ThemeModeProvider>
  </StrictMode>
);
