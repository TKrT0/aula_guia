'use client';

import { CarreraProvider } from '@/src/contexts/CarreraContext';
import { ThemeProvider } from '@/src/contexts/ThemeContext';
import { ToastProvider } from '@/src/contexts/ToastContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ToastProvider>
        <CarreraProvider>
          {children}
        </CarreraProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
