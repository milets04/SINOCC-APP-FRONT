import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  token: string | null;
  rol: string | null;
  login: (token: string, rol: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  isInitializing: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [rol, setRol] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true); // <- Para cargar datos al inicio

  // 🔄 Cargar token y rol almacenados cuando inicia la app
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('userToken');
        const storedRol = await AsyncStorage.getItem('userRol');

        if (storedToken) {
          setToken(storedToken);
          console.log("🔑 Token cargado desde almacenamiento:", storedToken);
        }
        if (storedRol) {
          setRol(storedRol);
          console.log("👤 Rol cargado desde almacenamiento:", storedRol);
        }
      } catch (e) {
        console.error("❌ Error al recuperar datos de autenticación:", e);
      } finally {
        setIsInitializing(false);
      }
    };

    cargarDatos();
  }, []);

  // 🟢 Iniciar sesión y guardar datos
  const login = async (newToken: string, newRol: string) => {
    setIsLoading(true);
    try {
      if (!newToken) {
        console.warn("⚠️ No se recibió un token válido en login()");
        setIsLoading(false);
        return;
      }

      await AsyncStorage.setItem('userToken', newToken);
      await AsyncStorage.setItem('userRol', newRol);

      setToken(newToken);
      setRol(newRol);

      console.log("✅ Token guardado correctamente:", newToken);
      console.log("👤 Rol asignado:", newRol);
    } catch (e) {
      console.error("❌ Error guardando el token en AsyncStorage:", e);
    } finally {
      setIsLoading(false);
    }
  };

  // 🔴 Cerrar sesión
  const logout = async () => {
  setIsLoading(true);
  try {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userRol');
    await AsyncStorage.getAllKeys(); 
    setToken(null);
    setRol(null);
    console.log("🚪 Sesión cerrada correctamente");
  } catch (e) {
    console.error("❌ Error borrando el token de AsyncStorage:", e);
  } finally {
    setIsLoading(false);
  }
};

  return (
    <AuthContext.Provider value={{ token, rol, login, logout, isLoading, isInitializing }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
