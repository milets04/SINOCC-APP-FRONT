import React, { createContext, ReactNode, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Zona {
  id: string;       
  name: string;    
  enabled: boolean;
}

interface ZonasContextType {
  zonas: Zona[];
  toggleZona: (id: string, enabled: boolean) => void;
}

const ZonasContext = createContext<ZonasContextType | undefined>(undefined);

const STORAGE_KEY = "zonas_config";

export const ZonasProvider = ({ children }: { children: ReactNode }) => {
  const [zonas, setZonas] = useState<Zona[]>([
    { id: "1", name: "Quillacollo", enabled: false },
    { id: "2", name: "Sacaba", enabled: false },
    { id: "3", name: "Zona Centro", enabled: false },
  ]);

  useEffect(() => {
    const loadStoredZones = async () => {
      try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        if (json) {
          setZonas(JSON.parse(json));
        }
      } catch {
        console.warn("No se pudieron cargar las zonas guardadas");
      }
    };

    loadStoredZones();
  }, []);

  // Guardar automáticamente
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(zonas));
  }, [zonas]);

  // Actualizar 
  const toggleZona = (id: string, enabled: boolean) => {
    setZonas(prev =>
      prev.map(z => (z.id === id ? { ...z, enabled } : z))
    );
  };

  return (
    <ZonasContext.Provider value={{ zonas, toggleZona }}>
      {children}
    </ZonasContext.Provider>
  );
};

export const useZonas = () => {
  const ctx = useContext(ZonasContext);
  if (!ctx) throw new Error("useZonas debe usarse dentro de ZonasProvider");
  return ctx;
};
