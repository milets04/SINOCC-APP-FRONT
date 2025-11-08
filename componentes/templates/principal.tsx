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

type Cierre = {
  id: number;
  categoria: string | null;
  lugarCierre: string;
  idZona: number | null;
  fechaInicio: string | null;
  fechaFin: string | null;
  horaInicio?: string | null;
  horaFin?: string | null;
  descripcion: string | null;
  createdAt: string;
  modifiedAt: string;
  zona: { id: number; nombreZona: string } | null;
  ubicaciones: Array<{ id: number; idCierre: number; latitud: string; longitud: string }>;
};

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

  const calcularDuracion = (inicio?: string | null, fin?: string | null) => {
    if (!inicio || !fin) return null;
    const f1 = new Date(inicio);
    const f2 = new Date(fin);
    if (isNaN(f1.getTime()) || isNaN(f2.getTime())) return null;
    const diffMs = f2.getTime() - f1.getTime();
    const dias = Math.ceil(diffMs / (1000 * 60 * 60 * 24)) + 1;
    return dias > 0 ? dias : 1;
  };

  if (cargando) {
    return (
      <View style={styles.container}>
        <Header onBellPress={() => router.push("/pantallaNotif")} onSettingsPress={() => router.push("/pantallaConf")} />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#146BF6" />
          <Text style={styles.loadingText}>Cargando cierres...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        onBellPress={() => router.push("/pantallaNotif")}
        onSettingsPress={() => router.push("/pantallaConf")}
      />

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
            let horaInicio = "";
            let estimado = "";

            if (cierre.fechaInicio && cierre.fechaFin) {
              const fechaInicio = new Date(cierre.fechaInicio);
              const fechaFin = new Date(cierre.fechaFin);
              const duracionDias =
                Math.ceil((fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24)) + 1;

              horaInicio = fechaInicio.toLocaleDateString();
              estimado = `${duracionDias} día${duracionDias !== 1 ? "s" : ""}`;
            }

            else if ((cierre as any).horaInicio && (cierre as any).horaFin) {
              const h1 = (cierre as any).horaInicio;
              const h2 = (cierre as any).horaFin;

              const [hInicio, mInicio] = h1.split(":").map(Number);
              const [hFin, mFin] = h2.split(":").map(Number);
              let diffHoras = hFin - hInicio + (mFin - mInicio) / 60;
              if (diffHoras < 0) diffHoras += 24; 

              horaInicio = `${h1}`; 
              estimado = `${Math.round(diffHoras)} hora${Math.round(diffHoras) !== 1 ? "s" : ""}`;
            }

            const categoriaNivel =
              cierre.categoria === "ALTO"
                ? "ALTO"
                : cierre.categoria === "MEDIO"
                ? "MEDIO"
                : "BAJO";

            const categoriaAlerta =
              cierre.categoria === "ALTO"
                ? "peligro"
                : cierre.categoria === "MEDIO"
                ? "advertencia"
                : "exito";

            return (
              <CierreAct
                key={cierre.id}
                titulo={cierre.lugarCierre}
                lugar={cierre.zona?.nombreZona || "Sin zona"}
                descripcion={cierre.descripcion || "Sin descripción"}
                horaInicio={horaInicio} 
                estimado={estimado} 
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
        onMapPress={() => router.push("/mapa")}
      />
    </View>
  );
};

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
