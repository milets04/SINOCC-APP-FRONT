import Boton from "@/componentes/atomos/boton";
import TituloPestania from "@/componentes/atomos/tituloPestania";
import CardCierre from "@/componentes/moleculas/cardCierre";
import HeaderSimple from "@/componentes/moleculas/headerSimple";
import ModalConfirmacion from "@/componentes/moleculas/modalConfirmacion";
import { useAuth } from "@/contexto/autenticacion";
import { useRouter } from "expo-router";
import React, { memo, useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, View } from "react-native";

const API_URL = "https://tu-api.com/api"; // 🔧 Ajusta la URL de tu backend

interface Cierre {
  id: number;
  categoria: string;
  lugarCierre: string;
  fechaInicio?: string;
  fechaFin?: string;
  horaInicio?: string;
  horaFin?: string;
  descripcion?: string;
  zona?: string;
}

const PrincAdmin = () => {
  const router = useRouter();
  const { logout, token } = useAuth();

  const [cierres, setCierres] = useState<Cierre[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados para el modal de confirmación
  const [modalVisible, setModalVisible] = useState(false);
  const [cierreAEliminar, setCierreAEliminar] = useState<Cierre | null>(null);

  // 🔹 Obtener cierres desde el backend
  const obtenerCierres = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/cierres`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Error al obtener los cierres");

      const data = await response.json();
      console.log("Cierres obtenidos:", data);
      setCierres(data);
    } catch (error) {
      console.error("Error al obtener cierres:", error);
      Alert.alert("Error", "No se pudieron cargar los cierres activos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerCierres();
  }, []);

  // 🔹 Mostrar modal de eliminación
  const handleMostrarModalEliminar = (cierre: Cierre) => {
    setCierreAEliminar(cierre);
    setModalVisible(true);
  };

  // 🔹 Confirmar eliminación (con API)
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

      if (!response.ok) throw new Error("Error al eliminar el cierre");

      setCierres((prev) => prev.filter((c) => c.id !== cierreAEliminar.id));
      Alert.alert("Éxito", "Cierre eliminado correctamente.");
    } catch (error) {
      console.error("Error al eliminar cierre:", error);
      Alert.alert("Error", "No se pudo eliminar el cierre.");
    } finally {
      setModalVisible(false);
      setCierreAEliminar(null);
    }
  };

  // 🔹 Cancelar eliminación
  const handleCancelarEliminar = () => {
    setModalVisible(false);
    setCierreAEliminar(null);
  };

  // 🔹 Cerrar sesión
  const handleCerrarSesion = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Está seguro que desea cerrar la sesión?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sí, cerrar",
          style: "destructive",
          onPress: async () => {
            await logout();
            router.replace("/");
          },
        },
      ]
    );
  };

  // 🔹 Navegar a crear cierre
  const navegarACrearCierre = () => {
    router.push("/crearCierre");
  };

  return (
    <View style={styles.container}>
      <HeaderSimple />
      <ScrollView contentContainerStyle={styles.content}>
        <TituloPestania style={styles.title}>Cierres Activos</TituloPestania>

        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 50 }} />
        ) : cierres.length === 0 ? (
          <View style={styles.emptyContainer}>
            <TituloPestania style={styles.emptyText}>
              No hay cierres activos
            </TituloPestania>
          </View>
        ) : (
          cierres.map((cierre) => (
            <CardCierre
              key={cierre.id}
              titulo={cierre.lugarCierre || "Sin título"}
              subtitulo={[
                cierre.zona ? `Zona: ${cierre.zona}` : "",
                cierre.fechaInicio && cierre.fechaFin
                  ? `Duración: ${cierre.fechaInicio} a ${cierre.fechaFin}`
                  : cierre.horaInicio && cierre.horaFin
                  ? `Horario: ${cierre.horaInicio} - ${cierre.horaFin}`
                  : "",
                cierre.descripcion ? `Motivo: ${cierre.descripcion}` : "",
              ].filter(Boolean)} // 🔹 Elimina los vacíos
              onPressEditar={() => console.log("Editar cierre", cierre.id)}
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
    paddingTop: 25,
    paddingHorizontal: 16,
  },
  content: {
    alignItems: "center",
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
