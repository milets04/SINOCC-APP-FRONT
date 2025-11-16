import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

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

export interface UbicacionCierre {
  latitud: number;
  longitud: number;
}

export interface Cierre {
  id: number;
  categoria: string;
  lugarCierre: string;
  idZona: number;
  fechaInicio: string | null;
  fechaFin: string | null;
  horaInicio: string | null;
  horaFin: string | null;
  descripcion: string;
  ubicaciones: UbicacionCierre[];
  estado?: boolean;
}

export interface CierreConPrimerUbicacion extends Omit<Cierre, 'ubicaciones'> {
  ubicacion: UbicacionCierre;
}

interface UbicacionesContextType {
  ubicaciones: UbicacionData[];
  setUbicaciones: React.Dispatch<React.SetStateAction<UbicacionData[]>>;
  datosFormularioTemp: DatosFormularioTemp | null;
  setDatosFormularioTemp: React.Dispatch<React.SetStateAction<DatosFormularioTemp | null>>;
  cierres: CierreConPrimerUbicacion[];
  cargandoCierres: boolean;
  errorCierres: string | null;
  recargarCierres: () => Promise<void>;
}

const UbicacionesContext = createContext<UbicacionesContextType | undefined>(undefined);

const API_BASE_URL = 'TU_URL_BASE_API'; // Reemplaza con tu URL real

export const UbicacionesProvider = ({ children }: { children: ReactNode }) => {
  const [ubicaciones, setUbicaciones] = useState<UbicacionData[]>([]);
  const [datosFormularioTemp, setDatosFormularioTemp] = useState<DatosFormularioTemp | null>(null);
  const [cierres, setCierres] = useState<CierreConPrimerUbicacion[]>([]);
  const [cargandoCierres, setCargandoCierres] = useState(false);
  const [errorCierres, setErrorCierres] = useState<string | null>(null);

  // Función para obtener cierres activos
  const obtenerCierresActivos = async (): Promise<Cierre[]> => {
    const response = await fetch(`${API_BASE_URL}/api/cierres/activos`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener cierres: ${response.status}`);
    }

    return await response.json();
  };

  // Función para obtener solo el primer marcador de cada cierre
  const obtenerPrimerosMarcadores = (cierresData: Cierre[]): CierreConPrimerUbicacion[] => {
    return cierresData
      .filter(cierre => cierre.ubicaciones && cierre.ubicaciones.length > 0)
      .map(cierre => ({
        id: cierre.id,
        categoria: cierre.categoria,
        lugarCierre: cierre.lugarCierre,
        idZona: cierre.idZona,
        fechaInicio: cierre.fechaInicio,
        fechaFin: cierre.fechaFin,
        horaInicio: cierre.horaInicio,
        horaFin: cierre.horaFin,
        descripcion: cierre.descripcion,
        estado: cierre.estado,
        ubicacion: cierre.ubicaciones[0],
      }));
  };

  // Función para cargar cierres
  const recargarCierres = async () => {
    try {
      setCargandoCierres(true);
      setErrorCierres(null);
      
      const cierresActivos = await obtenerCierresActivos();
      const primerosMarcadores = obtenerPrimerosMarcadores(cierresActivos);
      
      setCierres(primerosMarcadores);
    } catch (err) {
      console.error('Error al cargar cierres:', err);
      setErrorCierres('No se pudieron cargar los cierres');
      setCierres([]);
    } finally {
      setCargandoCierres(false);
    }
  };

  // Cargar cierres al montar el componente
  useEffect(() => {
    recargarCierres();
  }, []);

  return (
    <UbicacionesContext.Provider value={{ 
      ubicaciones, 
      setUbicaciones,
      datosFormularioTemp,
      setDatosFormularioTemp,
      cierres,
      cargandoCierres,
      errorCierres,
      recargarCierres,
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