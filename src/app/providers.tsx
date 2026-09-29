import type { ReactNode } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from '../theme/theme';
import { RoleProvider } from '../context/RoleContext';
import { SnackbarProvider } from '../context/SnackbarContext';
import { ConversationsProvider } from '../context/ConversationsContext';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RoleProvider>
        <SnackbarProvider>
          <ConversationsProvider>{children}</ConversationsProvider>
        </SnackbarProvider>
      </RoleProvider>
    </ThemeProvider>
  );
}
