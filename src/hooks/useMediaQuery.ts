'use client';

import { useState, useEffect } from 'react';

/**
 * Hook para detectar si estamos en viewport móvil
 * @param breakpoint - Ancho máximo para considerar móvil (default: 768px)
 */
export function useIsMobile(breakpoint: number = 768): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // Check inicial
    checkMobile();

    // Listener para resize
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [breakpoint]);

  return isMobile;
}

/**
 * Hook para detectar viewport tablet
 */
export function useIsTablet(): boolean {
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const check = () => {
      const width = window.innerWidth;
      setIsTablet(width >= 768 && width < 1024);
    };

    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return isTablet;
}
