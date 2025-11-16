import Constants from 'expo-constants';
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";

const obtenerApiUrl = () => { 
  try {
    const host =
      Constants?.expoConfig?.hostUri ||
      Constants?.manifest2?.extra?.expoClient?.hostUri;

    if (host) {
      const ip = host.split(':')[0];
      return `http://${ip}:3000/api`;
    }
  } catch {}
  return 'http://localhost:3000/api';
};

const API_URL = obtenerApiUrl();

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

interface CierresContextType {
  cierres: CierreConPrimerUbicacion[];
  cargandoCierres: boolean;
  errorCierres: string | null;
  recargarCierres: () => Promise<void>;
}

const CierresContext = createContext<CierresContextType | undefined>(undefined);

export const CierresProvider = ({ children }: { children: ReactNode }) => {
  const [cierres, setCierres] = useState<CierreConPrimerUbicacion[]>([]);
  const [cargandoCierres, setCargandoCierres] = useState(false);
  const [errorCierres, setErrorCierres] = useState<string | null>(null);

  const obtenerCierresActivos = async (): Promise<Cierre[]> => {
    const response = await fetch(`${API_URL}/cierres`);
    if (!response.ok) throw new Error("Error al obtener cierres");
    const data = await response.json();
    return data.datos ?? data;
  };

  const obtenerPrimerosMarcadores = (data: Cierre[]): CierreConPrimerUbicacion[] =>
    data
      .filter(c => c.ubicaciones?.length > 0)
      .map(c => ({
        id: c.id,
        categoria: c.categoria,
        lugarCierre: c.lugarCierre,
        idZona: c.idZona,
        fechaInicio: c.fechaInicio,
        fechaFin: c.fechaFin,
        horaInicio: c.horaInicio,
        horaFin: c.horaFin,
        descripcion: c.descripcion,
        estado: c.estado,
        ubicacion: c.ubicaciones[0],
      }));

  const recargarCierres = async () => {
    try {
      setCargandoCierres(true);
      setErrorCierres(null);
      const data = await obtenerCierresActivos(); // 

      // ----- PASO 1: VER DATOS CRUDOS -----
      // Revisa en la consola de tu terminal (donde corre 'expo start')
      // qué es lo que realmente llega de la API.
      console.log('DATOS CRUDOS DE /api/cierres:', JSON.stringify(data, null, 2));
      // ------------------------------------

      const primerosMarcadores = obtenerPrimerosMarcadores(data); // 

      // ----- PASO 2: VER DATOS FILTRADOS -----
      // Revisa si esta lista está vacía. Si lo está, confirma el diagnóstico.
      console.log('DATOS FILTRADOS (primeros marcadores):', JSON.stringify(primerosMarcadores, null, 2));
      // ------------------------------------
      
      setCierres(primerosMarcadores);
    } catch (e: any) {
      setErrorCierres(e.message);
      setCierres([]); 
    } finally {
      setCargandoCierres(false); 
    }
  };

  useEffect(() => {
    recargarCierres();
  }, []);

  return (
    <CierresContext.Provider value={{ cierres, cargandoCierres, errorCierres, recargarCierres }}>
      {children}
    </CierresContext.Provider>
  );
};

export const useCierres = () => {
  const ctx = useContext(CierresContext);
  if (!ctx) throw new Error("useCierres debe ser usado dentro de un CierresProvider");
  return ctx;
};
