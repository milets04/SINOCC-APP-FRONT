import Boton from "@/componentes/atomos/boton";
import TituloPestania from "@/componentes/atomos/tituloPestania";
import CardCierre from "@/componentes/moleculas/cardCierre";
import HeaderSimple from "@/componentes/moleculas/headerSimple";
import MenuInf from "@/componentes/moleculas/menuInf";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
  fechaInicio: string;
  fechaFin: string;
  descripcion: string | null;
  createdAt: string;
  modifiedAt: string;
  zona: { id: number; nombreZona: string } | null;
  ubicaciones: Array<{
    id: number;
    idCierre: number;
    latitud: string;
    longitud: string;
  }>;
};

//  Detección automática de IP y fallback
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

const PrincSuper = () => {
  const router = useRouter();
  const [cierres, setCierres] = useState<Cierre[]>([]);
  const [cargando, setCargando] = useState(true);
  const [refrescando, setRefrescando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navegarAGestionAdmins = () => {
    router.push("/gestionAdmins");
  };
  // ✅ Obtener token almacenado
  const obtenerToken = async (): Promise<string | null> => {
    try {
      const token = await AsyncStorage.getItem("userToken"); // ✅ Clave corregida
      console.log("🔑 Token obtenido:", token);
      return token;
    } catch (err) {
      console.error("❌ Error al obtener token:", err);
      return null;
    }
  };

  //  Obtener cierres desde el backend (con fallback)
  const obtenerCierres = useCallback(async () => {
    setError(null);
    setCargando(true);

    try {
      let response = await fetch(`${API_BASE}/cierres`);
      if (!response.ok)
        throw new Error("Fallo con la URL base, probando fallback...");

      const data = await response.json();

      if (data.exito) {
        setCierres(data.datos);
      } else {
        throw new Error(data.mensaje || "Error al obtener cierres");
      }
    } catch (err1) {
      console.warn("⚠️ Error con URL principal:", err1);

      try {
        // Fallback: usar localhost
        const fallback = "http://localhost:3000/api/cierres";
        const responseFallback = await fetch(fallback);
        const dataFallback = await responseFallback.json();
        console.log(" Respuesta backend (fallback):", dataFallback);

        if (dataFallback.exito) {
          setCierres(dataFallback.datos);
        } else {
          throw new Error(
            dataFallback.mensaje || "Error al obtener cierres con fallback"
          );
        }
      } catch (err2) {
        console.error("Error total:", err2);
        setError("Error de conexión con el servidor");
        Alert.alert(
          "Error de conexión",
          "No se pudo conectar con el servidor.\nVerifica tu conexión o revisa la IP."
        );
      }
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

  const calcularDuracion = (inicio: string, fin: string) => {
    const f1 = new Date(inicio);
    const f2 = new Date(fin);
    return Math.ceil((f2.getTime() - f1.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  };

  const navegarACrearCierre = useCallback(() => {
    router.push("/crearCierre");
  }, [router]);

  const navegarAEditarCierre = useCallback(
    (cierre: Cierre) => {
      router.push({
        pathname: "/editarCierre",
        params: {
          cierreId: cierre.id.toString(),
          lugarCierre: cierre.lugarCierre,
          categoria: cierre.categoria || "",
          descripcion: cierre.descripcion || "",
          fechaInicio: cierre.fechaInicio,
          fechaFin: cierre.fechaFin,
          idZona: cierre.idZona?.toString() || "",
        },
      });
    },
    [router]
  );

  //  Eliminar cierre con token
  const handleEliminar = useCallback(async (cierre: Cierre) => {
    Alert.alert(
      "Confirmar eliminación",
      `¿Eliminar el cierre de ${cierre.lugarCierre}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            const token = await obtenerToken();
            if (!token) {
              Alert.alert(
                "Error",
                "No se encontró el token. Inicia sesión nuevamente."
              );
              return;
            }

            try {
              const res = await fetch(`${API_BASE}/cierres/${cierre.id}`, {
                method: "DELETE",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });

              const data = await res.json();
              console.log("🗑️ Respuesta eliminación:", data);

              if (data.exito) {
                setCierres((prev) => prev.filter((c) => c.id !== cierre.id));
                Alert.alert("✅ Éxito", "Cierre eliminado correctamente.");
              } else {
                Alert.alert(
                  "Error",
                  data.mensaje || "No se pudo eliminar el cierre."
                );
              }
            } catch (err) {
              console.error("❌ Error al eliminar:", err);
              Alert.alert(
                "Error",
                "No se pudo conectar con el servidor para eliminar el cierre."
              );
            }
          },
        },
      ]
    );
  }, []);

  // UI
  if (cargando) {
    return (
      <View style={styles.container}>
        <HeaderSimple />
        <View style={styles.centeredContainer}>
          <ActivityIndicator size="large" color="#068EF7" />
          <Text style={styles.loadingText}>Cargando cierres...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <HeaderSimple />
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refrescando} onRefresh={onRefresh} />
        }
      >
        <TituloPestania style={styles.title}>
          Cierres Activos {cierres.length > 0 && `(${cierres.length})`}
        </TituloPestania>

        {cierres.length === 0 ? (
          <Text style={styles.emptyText}>
            No hay cierres activos en este momento.
          </Text>
        ) : (
          cierres.map((cierre) => {
            const duracionDias = calcularDuracion(
              cierre.fechaInicio,
              cierre.fechaFin
            );
            return (
              <CardCierre
                key={cierre.id}
                titulo={cierre.lugarCierre}
                subtitulo={[
                  `Zona: ${cierre.zona?.nombreZona || "Sin zona"}`,
                  `Duración: ${duracionDias} día${
                    duracionDias !== 1 ? "s" : ""
                  }`,
                  cierre.descripcion || "Sin descripción",
                ]}
                onPressEditar={() => navegarAEditarCierre(cierre)}
                onPressEliminar={() => handleEliminar(cierre)}
              />
            );
          })
        )}

        <Boton
          texto="Crear nuevo cierre"
          onPress={navegarACrearCierre}
          variante="primario"
          tamaño="grande"
          ancho="completo"
          estilo={styles.button}
        />
      </ScrollView>
      <MenuInf
        homeIcon={<Ionicons name="home-outline" size={28} color="#146BF6" />}
        usersIcon={<Ionicons name="people-outline" size={28} color="#146BF6" />}
        onHomePress={() => console.log("Home pressed")}
        onUsersPress={navegarAGestionAdmins}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    paddingTop: 25,
    paddingHorizontal: 16,
  },
  content: { alignItems: "center", paddingBottom: 50, paddingTop: 10 },
  title: { marginVertical: 20, marginHorizontal: 6, alignSelf: "flex-start" },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: { marginTop: 10, fontSize: 16, color: "#666" },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 30,
  },
  button: { marginTop: 20 },
});

export default memo(PrincSuper);