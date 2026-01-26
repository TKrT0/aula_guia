'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (message: string, type: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addToast = useCallback((message: string, type: ToastType, duration = 4000) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    setToasts(prev => [...prev, { id, message, type, duration }]);
    
    // Auto-remove after duration
    if (duration > 0) {
      setTimeout(() => removeToast(id), duration);
    }
  }, [removeToast]);

  const success = useCallback((message: string) => addToast(message, 'success'), [addToast]);
  const error = useCallback((message: string) => addToast(message, 'error', 6000), [addToast]);
  const warning = useCallback((message: string) => addToast(message, 'warning'), [addToast]);
  const info = useCallback((message: string) => addToast(message, 'info'), [addToast]);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, success, error, warning, info }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast debe usarse dentro de ToastProvider');
  }
  return context;
}

// Toast Container Component
function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: string) => void }) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}

// Individual Toast Component
function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const config = {
    success: {
      bg: 'bg-green-500',
      icon: '✓',
      iconBg: 'bg-green-600',
    },
    error: {
      bg: 'bg-red-500',
      icon: '✕',
      iconBg: 'bg-red-600',
    },
    warning: {
      bg: 'bg-amber-500',
      icon: '⚠',
      iconBg: 'bg-amber-600',
    },
    info: {
      bg: 'bg-primary',
      icon: 'ℹ',
      iconBg: 'bg-primary/80',
    },
  };

  const { bg, icon, iconBg } = config[toast.type];

  return (
    <div
      className={`
        ${bg} text-white pl-4 pr-3 py-3 rounded-xl shadow-lg 
        flex items-center gap-3 min-w-[280px] max-w-[400px]
        pointer-events-auto
        animate-in slide-in-from-right-5 fade-in duration-300
      `}
    >
      <span className={`${iconBg} w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold`}>
        {icon}
      </span>
      <span className="flex-1 font-medium text-sm">{toast.message}</span>
      <button
        onClick={() => onRemove(toast.id)}
        className="text-white/70 hover:text-white transition-colors p-1"
      >
        <span className="text-lg leading-none">×</span>
      </button>
    </div>
  );
}
