import React, { createContext, ReactNode, useContext, useState } from 'react';
export interface UbicacionData {
  id: string | number;
  direccion: string; 
  latitud: number;
  longitud: number;
}

interface UbicacionesContextType {
  ubicaciones: UbicacionData[];
  setUbicaciones: React.Dispatch<React.SetStateAction<UbicacionData[]>>;
}

const UbicacionesContext = createContext<UbicacionesContextType | undefined>(undefined);

export const UbicacionesProvider = ({ children }: { children: ReactNode }) => {
  const [ubicaciones, setUbicaciones] = useState<UbicacionData[]>([]);

  return (
    <UbicacionesContext.Provider value={{ ubicaciones, setUbicaciones }}>
      {children}
    </UbicacionesContext.Provider>
  );
};

export const useUbicaciones = () => {
  const context = useContext(UbicacionesContext);
  if (!context) {
    throw new Error('useUbicaciones debe ser usado dentro de un UbicacionesProvider');
  }
  return context;
};