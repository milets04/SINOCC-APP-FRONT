import CierreAct from "@/componentes/moleculas/cierreAct";
import Header from "@/componentes/moleculas/header";
import MenuInf from "@/componentes/moleculas/menuInf";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import React, { memo, useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

// 🧩 Tipado del cierre
type Cierre = {
  id: number;
  categoria: string | null;
  lugarCierre: string;
  idZona: number | null;
  fechaInicio: string;
  fechaFin: string;
  descripcion: string | null;
  createdAt: string;
  modifiedAt: string;
  zona: { id: number; nombreZona: string } | null;
  ubicaciones: Array<{ id: number; idCierre: number; latitud: string; longitud: string }>;
};

// 🌐 Detección automática de IP
const obtenerApiUrl = () => {
  try {
    const host =
      Constants?.expoConfig?.hostUri ||
      Constants?.manifest2?.extra?.expoClient?.hostUri;

    if (host) {
      const ip = host.split(":")[0];
      const apiUrl = `http://${ip}:3000/api`;
      console.log("🌐 API URL detectada automáticamente:", apiUrl);
      return apiUrl;
    }
  } catch (error) {
    console.warn("⚠️ No se pudo detectar la IP local automáticamente.");
  }

  console.log("🌐 Usando localhost como fallback");
  return "http://localhost:3000/api";
};

const API_BASE = obtenerApiUrl();

const Principal = () => {
  const router = useRouter();
  const [cierres, setCierres] = useState<Cierre[]>([]);
  const [cargando, setCargando] = useState(true);
  const [refrescando, setRefrescando] = useState(false);

  // 🔄 Obtener cierres desde el backend
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
      Alert.alert(
        "Error de conexión",
        "No se pudieron obtener los cierres. Verifica tu conexión o la IP del servidor."
      );
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

  // 🧭 Navegaciones
  const navegarAlMapa = () => router.push("/mapa");
  const navegarANotif = () => router.push("/pantallaNotif");
  const navegarAConf = () => router.push("/pantallaConf");

  // ⏱️ Calcular duración (opcional)
  const calcularDuracion = (inicio: string, fin: string) => {
    const f1 = new Date(inicio);
    const f2 = new Date(fin);
    return Math.ceil((f2.getTime() - f1.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  };

  // 🎨 UI
  if (cargando) {
    return (
      <View style={styles.container}>
        <Header onBellPress={navegarANotif} onSettingsPress={navegarAConf} />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#146BF6" />
          <Text style={styles.loadingText}>Cargando cierres...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header onBellPress={navegarANotif} onSettingsPress={navegarAConf} />

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refrescando} onRefresh={onRefresh} />
        }
      >
        {cierres.length === 0 ? (
          <Text style={styles.emptyText}>No hay cierres activos.</Text>
        ) : (
          cierres.map((cierre) => {
            const duracion = calcularDuracion(cierre.fechaInicio, cierre.fechaFin);
            const categoriaNivel =
              cierre.categoria === "ALTO" ? "ALTO" :
              cierre.categoria === "MEDIO" ? "MEDIO" : "BAJO";

            // ⚠️ Puedes ajustar la lógica de color según tus categorías
            const categoriaAlerta =
              cierre.categoria === "ALTO" ? "peligro" :
              cierre.categoria === "MEDIO" ? "advertencia" : "exito";

            return (
              <CierreAct
                key={cierre.id}
                titulo={cierre.lugarCierre}
                lugar={cierre.zona?.nombreZona || "Sin zona"}
                descripcion={cierre.descripcion || "Sin descripción"}
                horaInicio={new Date(cierre.fechaInicio).toLocaleDateString()}
                estimado={`${duracion} día${duracion !== 1 ? "s" : ""}`}
                categoriaAlerta={categoriaAlerta}
                categoriaNivel={categoriaNivel}
                style={styles.card}
              />
            );
          })
        )}
      </ScrollView>

      <MenuInf
        homeIcon={<Ionicons name="home-outline" size={28} color="#146BF6" />}
        mapIcon={<Ionicons name="map-outline" size={28} color="#146BF6" />}
        onHomePress={() => console.log("Home pressed")}
        onMapPress={navegarAlMapa}
      />
    </View>
  );
};

// 🎨 Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  content: {
    paddingVertical: 20,
    paddingBottom: 90,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
    fontSize: 16,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 30,
  },
  card: {
    marginBottom: 12,
  },
});

export default memo(Principal);
