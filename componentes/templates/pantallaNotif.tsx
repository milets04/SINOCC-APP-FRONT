import Header from '@/componentes/moleculas/header';
import MenuInf from '@/componentes/moleculas/menuInf';
import NotificationCard from '@/componentes/moleculas/notificacion';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, View, ActivityIndicator, Alert,RefreshControl, Text } from 'react-native';
import Constants from "expo-constants";
import React, { useEffect, useState, useCallback } from 'react';

type Cierre = {
  id:number;
  categoria: string | null;
  lugarCierre: string;
  descripcion: string | null;
  fechaInicio?: string | null;
  fechaFin?: string | null;
  horaInicio?: string | null;
  horaFin?: string | null;
  createdAt?: string;
  modifiedAt?: string;
}

const obtenerApiUrl = () => {
  try {
    const host =
      Constants?.expoConfig?.hostUri ||
      Constants?.manifest2?.extra?.expoClient?.hostUri;

    if (host) {
      const ip = host.split(":")[0];
      const apiUrl = `http://${ip}:3000/api`;
      console.log("🌐 API URL detectada (notificaciones):", apiUrl);
      return apiUrl;
    }
  } catch (error) {
    console.warn("⚠️ No se pudo detectar la IP local automáticamente.");
  }
  console.log("🌐 Usando localhost como fallback");
  return "http://localhost:3000/api";
};

const API_BASE = obtenerApiUrl();

const categoriaColor = {
  ALTO: "red",
  MEDIO: "yellow",
  BAJO: "green",
} as const;

type CategoriaKey = keyof typeof categoriaColor; // "ALTO" | "MEDIO" | "BAJO"
type NotificationColor = (typeof categoriaColor)[CategoriaKey]; // "red" | "yellow" | "green"

const getCategoriaColor = (categoria: string | null | undefined): NotificationColor => {
  if (categoria === "ALTO" || categoria === "MEDIO" || categoria === "BAJO") {
    return categoriaColor[categoria];
  }
  return categoriaColor.BAJO; 
};


export default function PantallaNotificaciones() {
  const router = useRouter();
  const [cierres, setCierres] = useState<Cierre[]>([]);
  const [cargando, setCargando] = useState(true);
  const [refrescando, setRefrescando] = useState(false);

  const obtenerCierres = useCallback(async () => {
    setCargando(true);
    try {
      const response = await fetch(`${API_BASE}/cierres`);
      if (!response.ok) throw new Error("Error al conectar con el servidor");

      const data = await response.json();
      if (data.exito) {
        setCierres(data.datos);
      } else {
        throw new Error(data.mensaje || "Error al obtener cierres");
      }
    } catch (error) {
      console.error("❌ Error al obtener cierres:", error);
      Alert.alert("Error", "No se pudieron cargar las notificaciones.");
    } finally {
      setCargando(false);
      setRefrescando(false);
    }
  }, []);

  useEffect(() => {
    obtenerCierres();
  }, [obtenerCierres]);

  const onRefresh = useCallback(() => {
    setRefrescando(true);
    obtenerCierres();
  }, [obtenerCierres]);

  const navegarAHome = () => {
      router.push("/");
  };

  const navegarAlMapa = () => {
      router.push("/mapa");
  };

  const navegarAConf = () => {
    router.push("/pantallaConf");
  };

  if (cargando) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#146BF6" />
        <Text style={{ marginTop: 10, color: "#666" }}>Cargando notificaciones...</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <Header 
          onBellPress={() => console.log("Ya nos encontramos en notificaciones")}
          onSettingsPress={navegarAConf}
      />

      <ScrollView 
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollContentContainer}
        refreshControl={
          <RefreshControl refreshing={refrescando} onRefresh={onRefresh} />
        }
      >
        {cierres.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-off-outline" size={48} color="gray" />
            <Text style={styles.emptyText}>No hay notificaciones activas</Text>
          </View>
        ) : (
          cierres.map((cierre) => (
            <NotificationCard
              key={cierre.id}
              color={getCategoriaColor(cierre.categoria)}
              title={cierre.lugarCierre}
              description={cierre.descripcion || "Sin descripción"}
            />
          ))
        )}
        </ScrollView>


      <MenuInf
        homeIcon={<Ionicons name="home-outline" size={32} color="#146BF6" />}
        mapIcon={<Ionicons name="map-outline" size={32} color="#146BF6" />}
        onHomePress={navegarAHome}
        onMapPress={navegarAlMapa}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingVertical: 20,
  },
  scrollContent: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingVertical: 10,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
  },
  emptyText: {
    color: "#666",
    marginTop: 10,
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
});