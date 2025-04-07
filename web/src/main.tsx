import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import { theme } from './theme/theme';

import App from './components/App';

import '@mantine/core/styles.css';
import './index.scss';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider forceColorScheme='dark' theme={theme}>
      <App />
    </MantineProvider>
  </StrictMode>,
)
