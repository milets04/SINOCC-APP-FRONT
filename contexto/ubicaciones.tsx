import React, { createContext, ReactNode, useContext, useState } from 'react';

export interface UbicacionData {
  id: string | number;
  direccion: string; 
  latitud: number;
  longitud: number;
}

export interface DatosFormularioTemp {
  categoria: string | number;
  lugarCierre: string;
  zona: string | number;
  horaInicio: string;
  horaFin: string;
  fechaInicio: string;
  fechaFin: string;
  motivo: string;
}

interface UbicacionesContextType {
  ubicaciones: UbicacionData[];
  setUbicaciones: React.Dispatch<React.SetStateAction<UbicacionData[]>>;
  datosFormularioTemp: DatosFormularioTemp | null;
  setDatosFormularioTemp: React.Dispatch<React.SetStateAction<DatosFormularioTemp | null>>;
}

const UbicacionesContext = createContext<UbicacionesContextType | undefined>(undefined);

export const UbicacionesProvider = ({ children }: { children: ReactNode }) => {
  const [ubicaciones, setUbicaciones] = useState<UbicacionData[]>([]);
  const [datosFormularioTemp, setDatosFormularioTemp] = useState<DatosFormularioTemp | null>(null);

  return (
    <UbicacionesContext.Provider value={{ 
      ubicaciones, 
      setUbicaciones,
      datosFormularioTemp,
      setDatosFormularioTemp
    }}>
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