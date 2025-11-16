import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";

export interface Zona {
  id: string;       
  name: string;    
  enabled: boolean;
}

interface ZonasContextType {
  zonas: Zona[];
  notificationsEnabled: boolean;
  toggleZona: (id: string, enabled: boolean) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
}

const ZonasContext = createContext<ZonasContextType | undefined>(undefined);

const STORAGE_KEY = "zonas_config";
const NOTIFICATIONS_KEY = "notifications_enabled";

export const ZonasProvider = ({ children }: { children: ReactNode }) => {
  const [zonas, setZonas] = useState<Zona[]>([
    { id: "1", name: "Quillacollo", enabled: false },
    { id: "2", name: "Sacaba", enabled: false },
    { id: "3", name: "Zona Centro", enabled: false },
  ]);

  const [notificationsEnabled, setNotificationsEnabledState] = useState(false);

  // Cargar configuraciones al iniciar
  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const [zonasJson, notifValue] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEY),
          AsyncStorage.getItem(NOTIFICATIONS_KEY)
        ]);
        
        if (zonasJson) {
          setZonas(JSON.parse(zonasJson));
        }
        
        if (notifValue !== null) {
          setNotificationsEnabledState(JSON.parse(notifValue));
        }
      } catch {
        console.warn("No se pudieron cargar las configuraciones guardadas");
      }
    };

    loadStoredData();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(zonas));
  }, [zonas]);

  useEffect(() => {
    AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notificationsEnabled));
  }, [notificationsEnabled]);

  const toggleZona = (id: string, enabled: boolean) => {
    setZonas(prev =>
      prev.map(z => (z.id === id ? { ...z, enabled } : z))
    );
  };

  const setNotificationsEnabled = (enabled: boolean) => {
    setNotificationsEnabledState(enabled);
    
    if (!enabled) {
      setZonas(prev => prev.map(z => ({ ...z, enabled: false })));
    }
  };

  return (
    <ZonasContext.Provider value={{ 
      zonas, 
      notificationsEnabled,
      toggleZona,
      setNotificationsEnabled 
    }}>
      {children}
    </ZonasContext.Provider>
  );
};

export const useZonas = () => {
  const ctx = useContext(ZonasContext);
  if (!ctx) throw new Error("useZonas debe usarse dentro de ZonasProvider");
  return ctx;
};