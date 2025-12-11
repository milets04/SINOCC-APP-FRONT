import Boton from "@/componentes/atomos/boton";
import TituloPestania from "@/componentes/atomos/tituloPestania";
import CardCierre from "@/componentes/moleculas/cardCierre";
import HeaderSimple from "@/componentes/moleculas/headerSimple";
import ModalConfirmacion from "@/componentes/moleculas/modalConfirmacion";
import { useAuth } from "@/contexto/autenticacion";
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

const API_URL = 'https://sinocc-backend.onrender.com/api';

console.log('🌐 API Configurada:', API_URL);

interface Cierre {
  id: number;
  categoria: string | null;
  lugarCierre: string;
  idZona: number | null;
  fechaInicio: string | null;
  fechaFin: string | null;
  horaInicio: string | null;
  horaFin: string | null;
  descripcion: string | null;
  zona: { id: number; nombreZona: string } | null;
}

const PrincAdmin = () => {
  const router = useRouter();
  const { logout, token } = useAuth();

  const [cierres, setCierres] = useState<Cierre[]>([]);
  const [loading, setLoading] = useState(true);
  const [refrescando, setRefrescando] = useState(false); // Nuevo estado para pull-to-refresh

  // Estados para el modal de confirmación
  const [modalVisible, setModalVisible] = useState(false);
  const [cierreAEliminar, setCierreAEliminar] = useState<Cierre | null>(null);

  // 🔹 3. Lógica de Obtención de Datos (Igual a princSuper)
  const obtenerCierres = useCallback(async () => {
    setLoading(true);
    try {
      // Intento 1: URL Dinámica
      let response = await fetch(`${API_URL}/cierres`, {
        headers: { Authorization: `Bearer ${token}` }, // Mantenemos el token por seguridad
      });

      if (!response.ok) throw new Error("Fallo con la URL base");

      const data = await response.json();

      if (data.exito) {
        setCierres(data.datos);
      } else {
        throw new Error(data.mensaje || "Error al obtener cierres");
      }
    } catch (err1) {
      console.warn("Error con URL principal, probando fallback...", err1);
      
      // Intento 2: Fallback a localhost (útil en simuladores)
      try {
        const fallback = "http://localhost:3000/api/cierres";
        const responseFallback = await fetch(fallback, {
           headers: { Authorization: `Bearer ${token}` },
        });
        const dataFallback = await responseFallback.json();

        if (dataFallback.exito) {
          setCierres(dataFallback.datos);
        } else {
          Alert.alert("Error", "No se pudieron cargar los cierres.");
        }
      } catch (err2) {
        console.error("Error total de conexión:", err2);
        Alert.alert("Error de conexión", "Verifica tu conexión con el servidor.");
      }
    } finally {
      setLoading(false);
      setRefrescando(false);
    }
  }, [token]);

  useEffect(() => {
    obtenerCierres();
  }, [obtenerCierres]);

  const onRefresh = useCallback(() => {
    setRefrescando(true);
    obtenerCierres();
  }, [obtenerCierres]);

  // 🔹 4. Función auxiliar para mostrar duración
  const calcularDuracion = (
    fechaInicio: string | null,
    fechaFin: string | null,
    horaInicio: string | null,
    horaFin: string | null
  ) => {
    try {
      if (fechaInicio && fechaFin) {
        const f1 = new Date(fechaInicio);
        const f2 = new Date(fechaFin);
        let dias = Math.ceil((f2.getTime() - f1.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        
        if (horaInicio && horaFin) {
          const [h1, m1] = horaInicio.split(":").map(Number);
          const [h2, m2] = horaFin.split(":").map(Number);
          const totalHoras = (h2 + m2 / 60) - (h1 + m1 / 60);
          const horas = totalHoras > 0 ? Math.round(totalHoras) : 0;
          return `Duración: ${dias} día${dias !== 1 ? "s" : ""} y ${horas} hora${horas !== 1 ? "s" : ""}`;
        }
        return `Duración: ${dias} día${dias !== 1 ? "s" : ""}`;
      }
      if (horaInicio && horaFin) {
        const [h1, m1] = horaInicio.split(":").map(Number);
        const [h2, m2] = horaFin.split(":").map(Number);
        const totalHoras = (h2 + m2 / 60) - (h1 + m1 / 60);
        const horas = totalHoras > 0 ? Math.round(totalHoras) : 0;
        return `Duración: ${horas} hora${horas !== 1 ? "s" : ""}`;
      }
      return "Duración indefinida";
    } catch (e) {
      return "Duración desconocida";
    }
  };

  // 🔹 Navegación para editar (Con parámetros correctos)
  const navegarAEditarCierre = (cierre: Cierre) => {
    router.push({
      pathname: "/editarCierre", // Asegúrate de que esta ruta exista en tu proyecto
      params: {
        cierreId: cierre.id.toString(),
        lugarCierre: cierre.lugarCierre,
        categoria: cierre.categoria || "",
        descripcion: cierre.descripcion || "",
        fechaInicio: cierre.fechaInicio || "",
        fechaFin: cierre.fechaFin || "",
        horaInicio: cierre.horaInicio || "",
        horaFin: cierre.horaFin || "",
        idZona: cierre.idZona?.toString() || "",
      },
    });
  };

  // 🔹 Eliminar cierre
  const handleMostrarModalEliminar = (cierre: Cierre) => {
    setCierreAEliminar(cierre);
    setModalVisible(true);
  };

  const handleConfirmarEliminar = async () => {
    if (!cierreAEliminar) return;

    try {
      const response = await fetch(`${API_URL}/cierres/${cierreAEliminar.id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      // Verificar exito según la estructura del backend funcional
      if (response.ok && data.exito) {
        setCierres((prev) => prev.filter((c) => c.id !== cierreAEliminar.id));
        Alert.alert("Éxito", "Cierre eliminado correctamente.");
      } else {
        throw new Error(data.mensaje || "No se pudo eliminar");
      }
    } catch (error) {
      console.error("Error al eliminar cierre:", error);
      Alert.alert("Error", "No se pudo eliminar el cierre.");
    } finally {
      setModalVisible(false);
      setCierreAEliminar(null);
    }
  };

  const handleCancelarEliminar = () => {
    setModalVisible(false);
    setCierreAEliminar(null);
  };

  const handleCerrarSesion = () => {
    Alert.alert("Cerrar Sesión", "¿Está seguro que desea cerrar la sesión?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sí, cerrar",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/");
        },
      },
    ]);
  };

  const navegarACrearCierre = () => {
    router.push("/crearCierre");
  };

  return (
    <View style={styles.container}>
      <HeaderSimple onPressRoute="/" />
      <ScrollView 
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refrescando} onRefresh={onRefresh} />}
      >
        <TituloPestania style={styles.title}>Cierres Activos</TituloPestania>

        {loading && !refrescando ? (
          <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 50 }} />
        ) : cierres.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay cierres activos</Text>
          </View>
        ) : (
          cierres.map((cierre) => (
            <CardCierre
              key={cierre.id}
              titulo={cierre.lugarCierre || "Sin título"}
              subtitulo={[
                cierre.zona ? `Zona: ${cierre.zona.nombreZona}` : "Sin zona asignada",
                calcularDuracion(cierre.fechaInicio, cierre.fechaFin, cierre.horaInicio, cierre.horaFin),
                cierre.descripcion ? `Motivo: ${cierre.descripcion}` : "",
              ].filter(Boolean)}
              onPressEditar={() => navegarAEditarCierre(cierre)}
              onPressEliminar={() => handleMostrarModalEliminar(cierre)}
              style={styles.card}
            />
          ))
        )}

        <Boton
          texto="Crear nuevo cierre"
          onPress={navegarACrearCierre}
          variante="primario"
          tamaño="grande"
          ancho="completo"
          estilo={styles.button}
        />

        <Boton
          texto="Cerrar Sesión"
          onPress={handleCerrarSesion}
          variante="secundario"
          tamaño="grande"
          ancho="ajustado"
          estilo={styles.button}
        />
      </ScrollView>

      {/* Modal de Confirmación */}
      <ModalConfirmacion
        visible={modalVisible}
        titulo="¿Eliminar cierre?"
        mensaje={
          cierreAEliminar
            ? `¿Está seguro que desea eliminar el cierre "${cierreAEliminar.lugarCierre}"?`
            : "¿Está seguro que desea eliminar este cierre?"
        }
        textoConfirmar="Sí, eliminar"
        textoCancelar="No, cancelar"
        onConfirmar={handleConfirmarEliminar}
        onCancelar={handleCancelarEliminar}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    paddingTop: 0,
  },
  content: {
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 50,
    paddingTop: 20,
  },
  title: {
    marginVertical: 20,
    marginHorizontal: 6,
    alignSelf: "flex-start",
  },
  card: {
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#999999",
  },
});

export default memo(PrincAdmin);