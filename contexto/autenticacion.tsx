import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useState } from 'react';

interface AuthContextType {
  token: string | null;
  rol: string | null;
  login: (token: string, rol: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [rol, setRol] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // (Podrías agregar aquí una función para cargar el token desde AsyncStorage al iniciar)

  const login = async (newToken: string, newRol: string) => {
    setIsLoading(true);
    setToken(newToken);
    setRol(newRol);
    try {
      await AsyncStorage.setItem('userToken', newToken);
      await AsyncStorage.setItem('userRol', newRol);
    } catch (e) {
      console.error("Error guardando el token en AsyncStorage", e);
    }
    setIsLoading(false);
  };

  const logout = async () => {
    setIsLoading(true);
    setToken(null);
    setRol(null);
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userRol');
    } catch (e) {
      console.error("Error borrando el token de AsyncStorage", e);
    }
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider value={{ token, rol, login, logout, isLoading }}>
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