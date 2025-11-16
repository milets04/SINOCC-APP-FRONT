import Constants from 'expo-constants';
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";

// Usa la misma lógica que conexion.ts
const obtenerApiUrl = () => { 
  try {
    const host =
      Constants?.expoConfig?.hostUri ||
      Constants?.manifest2?.extra?.expoClient?.hostUri;

    if (host) {
      const ip = host.split(':')[0];
      return `http://${ip}:3000/api`;
    }
  } catch (error) {
    console.warn('No se pudo detectar la IP local automáticamente.');
  }

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

  // Función para obtener cierres activos
  const obtenerCierresActivos = async (): Promise<Cierre[]> => {
    console.log('🔍 Intentando conectar a:', `${API_URL}/cierres/activos`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(`${API_URL}/cierres/activos`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log('📡 Status de respuesta:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error del servidor:', errorText);
        throw new Error(`Error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Respuesta completa del servidor:', JSON.stringify(data, null, 2));
      
      // El backend puede devolver { exito: true, datos: [...] } o directamente [...]
      let cierres: Cierre[];
      
      if (data.datos && Array.isArray(data.datos)) {
        cierres = data.datos;
      } else if (Array.isArray(data)) {
        cierres = data;
      } else {
        console.error('❌ Formato inesperado de respuesta:', data);
        throw new Error('Formato de respuesta inválido');
      }
      
      console.log('✅ Cierres obtenidos:', cierres.length);
      return cierres;
    } catch (error: any) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error('Tiempo de espera agotado. Verifica tu conexión.');
      }
      
      console.error('❌ Error en fetch:', error);
      throw error;
      
    }
  };

  // Función para obtener solo el primer marcador de cada cierre
  const obtenerPrimerosMarcadores = (cierresData: Cierre[]): CierreConPrimerUbicacion[] => {
    if (!Array.isArray(cierresData)) {
      console.error('❌ obtenerPrimerosMarcadores recibió datos no válidos:', cierresData);
      return [];
    }
    
    return cierresData
      .filter(cierre => cierre.ubicaciones && Array.isArray(cierre.ubicaciones) && cierre.ubicaciones.length > 0)
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
      
      console.log('🔄 Recargando cierres...');
      
      const cierresActivos = await obtenerCierresActivos();
      const primerosMarcadores = obtenerPrimerosMarcadores(cierresActivos);
      
      setCierres(primerosMarcadores);
      console.log('✅ Cierres cargados exitosamente:', primerosMarcadores.length);
    } catch (err: any) {
      console.error('❌ Error al cargar cierres:', err);
      
      let mensajeError = 'No se pudieron cargar los cierres';
      
      if (err.message?.includes('Network request failed')) {
        mensajeError = 'Error de conexión. Verifica tu red y que el backend esté corriendo.';
      } else if (err.message?.includes('Tiempo de espera agotado')) {
        mensajeError = err.message;
      } else if (err.message) {
        mensajeError = err.message;
      }
      
      setErrorCierres(mensajeError);
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
    <CierresContext.Provider value={{ 
      cierres,
      cargandoCierres,
      errorCierres,
      recargarCierres,
    }}>
      {children}
    </CierresContext.Provider>
  );
};

export const useCierres = () => {
  const context = useContext(CierresContext);
  if (!context) {
    throw new Error('useCierres debe ser usado dentro de un CierresProvider');
  }
  return context;
};