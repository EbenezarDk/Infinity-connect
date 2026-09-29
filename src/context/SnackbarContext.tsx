import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import type { AlertColor } from '@mui/material/Alert';

interface ToastState {
  open: boolean;
  message: string;
  severity: AlertColor;
}

interface SnackbarContextValue {
  notify: (message: string, severity?: AlertColor) => void;
}

const SnackbarContext = createContext<SnackbarContextValue | undefined>(undefined);

export function SnackbarProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState>({ open: false, message: '', severity: 'success' });

  const notify = useCallback((message: string, severity: AlertColor = 'success') => {
    setToast({ open: true, message, severity });
  }, []);

  const handleClose = () => setToast((t) => ({ ...t, open: false }));

  return (
    <SnackbarContext.Provider value={{ notify }}>
      {children}
      <Snackbar
        open={toast.open}
        autoHideDuration={3200}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={handleClose} severity={toast.severity} variant="filled" sx={{ borderRadius: 1.5 }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
}

export function useSnackbar(): SnackbarContextValue {
  const ctx = useContext(SnackbarContext);
  if (!ctx) throw new Error('useSnackbar must be used within SnackbarProvider');
  return ctx;
}
