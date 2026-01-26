'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface Carrera {
  id: string;
  nombre: string;
}

interface CarreraContextType {
  carreraId: string | null;
  carreraNombre: string | null;
  carreras: Carrera[];
  setCarrera: (id: string) => void;
  isLoading: boolean;
}

const CARRERAS: Carrera[] = [
  { id: 'ICC', nombre: 'Ing. en Ciencias de la Computación' },
  { id: 'LICC', nombre: 'Lic. en Ciencias de la Computación' },
  { id: 'ITI', nombre: 'Ing. en Tecnologías de la Información' },
];

const COOKIE_NAME = 'aula_guia_carrera';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 año

const CarreraContext = createContext<CarreraContextType | undefined>(undefined);

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
}

function setCookie(name: string, value: string, maxAge: number) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function CarreraProvider({ children }: { children: React.ReactNode }) {
  const [carreraId, setCarreraId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar carrera de cookie al iniciar
  useEffect(() => {
    const savedCarrera = getCookie(COOKIE_NAME);
    if (savedCarrera && CARRERAS.some(c => c.id === savedCarrera)) {
      setCarreraId(savedCarrera);
    }
    setIsLoading(false);
  }, []);

  const setCarrera = (id: string) => {
    setCarreraId(id);
    setCookie(COOKIE_NAME, id, COOKIE_MAX_AGE);
  };

  const carreraNombre = carreraId 
    ? CARRERAS.find(c => c.id === carreraId)?.nombre || null 
    : null;

  return (
    <CarreraContext.Provider value={{
      carreraId,
      carreraNombre,
      carreras: CARRERAS,
      setCarrera,
      isLoading
    }}>
      {children}
    </CarreraContext.Provider>
  );
}

export function useCarrera() {
  const context = useContext(CarreraContext);
  if (context === undefined) {
    throw new Error('useCarrera debe usarse dentro de CarreraProvider');
  }
  return context;
}
