'use client';

import { CarreraProvider } from '@/src/contexts/CarreraContext';
import { ThemeProvider } from '@/src/contexts/ThemeContext';
import { ToastProvider } from '@/src/contexts/ToastContext';
import { Toaster } from '@/components/ui/sonner';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ToastProvider>
        <CarreraProvider>
          {children}
          <Toaster />
        </CarreraProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
