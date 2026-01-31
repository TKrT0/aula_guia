'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { CarreraProvider } from '@/src/contexts/CarreraContext';
import { ThemeProvider } from '@/src/contexts/ThemeContext';
import { ToastProvider } from '@/src/contexts/ToastContext';
import { Toaster } from '@/components/ui/sonner';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { queryClient } from '@/src/lib/query/queryClient';
import { KeyboardShortcutsHelp } from '@/src/components/ui/KeyboardShortcutsHelp';
import MobileBottomNav from '@/src/components/layout/MobileBottomNav';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <NuqsAdapter>
        <ThemeProvider>
          <ToastProvider>
            <CarreraProvider>
              {children}
              <Toaster />
              <KeyboardShortcutsHelp />
              <MobileBottomNav />
            </CarreraProvider>
          </ToastProvider>
        </ThemeProvider>
      </NuqsAdapter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
