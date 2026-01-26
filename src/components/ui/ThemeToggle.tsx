'use client';

import { useTheme } from '@/src/contexts/ThemeContext';

export default function ThemeToggle() {
  const { theme, setTheme, mounted } = useTheme();

  const buttons = [
    { id: 'system' as const, icon: 'desktop_windows', label: 'Sistema', fill: false },
    { id: 'light' as const, icon: 'light_mode', label: 'Claro', fill: true },
    { id: 'dark' as const, icon: 'dark_mode', label: 'Oscuro', fill: false },
  ];

  // Evitar flash de hidratación
  if (!mounted) {
    return (
      <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-full border border-slate-200 dark:border-slate-700 w-[104px] h-10" />
    );
  }

  return (
    <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-full border border-slate-200 dark:border-slate-700">
      {buttons.map((btn) => {
        const isActive = theme === btn.id;
        
        return (
          <button
            key={btn.id}
            onClick={() => setTheme(btn.id)}
            title={btn.label}
            className={`
              flex size-8 items-center justify-center rounded-full transition-all
              ${isActive 
                ? 'bg-white dark:bg-slate-600 text-primary dark:text-white shadow-sm' 
                : 'text-slate-400 dark:text-slate-500 hover:text-primary dark:hover:text-white'
              }
            `}
          >
            <span 
              className="material-symbols-outlined text-[18px]"
              style={btn.fill && isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              {btn.icon}
            </span>
          </button>
        );
      })}
    </div>
  );
}
