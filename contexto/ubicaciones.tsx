import React, { createContext, ReactNode, useContext, useState } from 'react';

// Re-usa la interfaz que ya definiste en tu formulario
export interface UbicacionData {
  id: string | number;
  direccion: string; // Haremos un placeholder para esto
  latitud: number;
  longitud: number;
}

interface UbicacionesContextType {
  ubicaciones: UbicacionData[];
  setUbicaciones: React.Dispatch<React.SetStateAction<UbicacionData[]>>;
}

// 1. Crear el Contexto
const UbicacionesContext = createContext<UbicacionesContextType | undefined>(undefined);

// 2. Crear el Proveedor (Provider)
export const UbicacionesProvider = ({ children }: { children: ReactNode }) => {
  const [ubicaciones, setUbicaciones] = useState<UbicacionData[]>([]);

  return (
    <UbicacionesContext.Provider value={{ ubicaciones, setUbicaciones }}>
      {children}
    </UbicacionesContext.Provider>
  );
};

// 3. Crear un Hook personalizado (para usarlo fácil)
export const useUbicaciones = () => {
  const context = useContext(UbicacionesContext);
  if (!context) {
    throw new Error('useUbicaciones debe ser usado dentro de un UbicacionesProvider');
  }
  return context;
};