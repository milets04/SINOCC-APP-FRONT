import Boton from "@/componentes/atomos/boton";
import TituloPestania from "@/componentes/atomos/tituloPestania";
import CardCierre from "@/componentes/moleculas/cardCierre";
import HeaderSimple from "@/componentes/moleculas/headerSimple";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { memo, useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import MenuInf from "../moleculas/menuInf";

// Definir el tipo de Cierre basado en la respuesta del API
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
  zona: {
    id: number;
    nombreZona: string;
  } | null;
  ubicaciones: Array<{
    id: number;
    idCierre: number;
    latitud: string;
    longitud: string;
  }>;
};

// URL base de tu API - CAMBIAR según tu configuración
const API_URL = "http://192.168.1.5:3000"; // o tu IP/dominio

const princSuper = () => {
  const router = useRouter();

  // Estados para manejar los datos y la UI
  const [cierres, setCierres] = useState<Cierre[]>([]);
  const [cargando, setCargando] = useState(true);
  const [refrescando, setRefrescando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Función para obtener el token de autenticación
  const obtenerToken = async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem("token");
    } catch (error) {
      console.error("Error al obtener token:", error);
      return null;
    }
  };

  // Función para obtener cierres desde el API
  const obtenerCierres = useCallback(async () => {
    try {
      setError(null);
      
      // Endpoint para obtener cierres activos (que están ocurriendo HOY)
      const response = await fetch(`${API_URL}/api/cierres`);
      const data = await response.json();
      console.log(data)

      if (data.exito) {
        setCierres(data.datos);
      } else {
        setError(data.mensaje || "Error al obtener cierres");
        Alert.alert("Error", data.mensaje || "No se pudieron cargar los cierres");
      }
    } catch (error) {
      console.error("Error al obtener cierres:", error);
      setError("Error de conexión con el servidor");
      Alert.alert(
        "Error de conexión",
        "No se pudo conectar con el servidor. Verifica tu conexión a internet."
      );
    } finally {
      setCargando(false);
      setRefrescando(false);
    }
  }, []);

  // Cargar cierres al montar el componente
  useEffect(() => {
    obtenerCierres();
  }, [obtenerCierres]);

  // Función para refrescar la lista (pull to refresh)
  const onRefresh = useCallback(() => {
    setRefrescando(true);
    obtenerCierres();
  }, [obtenerCierres]);

  // Función para calcular la duración en días
  const calcularDuracion = (fechaInicio: string, fechaFin: string): number => {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    const diferencia = fin.getTime() - inicio.getTime();
    return Math.ceil(diferencia / (1000 * 60 * 60 * 24)) + 1;
  };

  // Función para navegar a crear cierre
  const navegarACrearCierre = useCallback(() => {
    router.push("/crearCierre");
  }, [router]);

  // Función para navegar a editar cierre
  const navegarAEditarCierre = useCallback((cierre: Cierre) => {
    // Navegar pasando los datos del cierre como parámetros
    // Puedes pasar el ID y luego cargar los datos en la pantalla de edición
    // O pasar todos los datos serializados
    router.push({
      pathname: "/editarCierre",
      params: {
        cierreId: cierre.id.toString(),
        // Opcional: pasar más datos si los necesitas inmediatamente
        lugarCierre: cierre.lugarCierre,
        categoria: cierre.categoria || "",
        descripcion: cierre.descripcion || "",
        fechaInicio: cierre.fechaInicio,
        fechaFin: cierre.fechaFin,
        idZona: cierre.idZona?.toString() || "",
      }
    });
  }, [router]);

  // Función para manejar la eliminación de un cierre
  const handleEliminar = useCallback(async (cierre: Cierre) => {
    Alert.alert(
      "Confirmar eliminación",
      `¿Estás seguro de que deseas eliminar el cierre de ${cierre.lugarCierre}?\n\nEsta acción no se puede deshacer.`,
      [
        { 
          text: "Cancelar", 
          style: "cancel" 
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              // Mostrar indicador de carga mientras se elimina
              const token = await obtenerToken();
              
              if (!token) {
                Alert.alert(
                  "Error de autenticación", 
                  "No se encontró token de autenticación. Por favor, inicia sesión nuevamente."
                );
                return;
              }

              // Realizar petición DELETE al API
              const response = await fetch(`${API_URL}/api/cierres/${cierre.id}`, {
                method: "DELETE",
                headers: {
                  "Authorization": `Bearer ${token}`,
                },
              });

              const data = await response.json();

              if (data.exito) {
                // Mostrar mensaje de éxito
                Alert.alert("Éxito", "Cierre eliminado correctamente");
                
                // Actualizar la lista localmente sin necesidad de recargar desde el servidor
                setCierres(prevCierres => prevCierres.filter(c => c.id !== cierre.id));
              } else {
                // Mostrar error específico del API
                Alert.alert("Error", data.mensaje || "No se pudo eliminar el cierre");
              }
            } catch (error) {
              console.error("Error al eliminar cierre:", error);
              Alert.alert(
                "Error de conexión", 
                "No se pudo conectar con el servidor para eliminar el cierre. Verifica tu conexión a internet."
              );
            }
          },
        },
      ]
    );
  }, []);

  // Funciones de navegación del menú inferior
  const navegarAHome = useCallback(() => {
    console.log("Navegando a Home");
    // router.push("/home") o la ruta que corresponda
  }, []);

  const navegarAMapa = useCallback(() => {
    console.log("Navegando a Mapa");
    // router.push("/mapa") o la ruta que corresponda
  }, []);

  // Mostrar indicador de carga inicial
  if (cargando) {
    return (
      <View style={styles.container}>
        <HeaderSimple />
        <View style={styles.centeredContainer}>
          <ActivityIndicator size="large" color="#068EF7" />
          <Text style={styles.loadingText}>Cargando cierres...</Text>
        </View>
        <MenuInf
          homeIcon={<Ionicons name="home-outline" size={28} color="#146BF6" />}
          mapIcon={<Ionicons name="map-outline" size={28} color="#146BF6" />}
          onHomePress={navegarAHome}
          onMapPress={navegarAMapa}
        />
      </View>
    );
  }

  // Mostrar mensaje si hay error y no hay cierres cargados
  if (error && cierres.length === 0) {
    return (
      <View style={styles.container}>
        <HeaderSimple />
        <View style={styles.centeredContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Boton
            texto="Reintentar"
            onPress={obtenerCierres}
            variante="primario"
            tamaño="mediano"
            estilo={styles.retryButton}
          />
        </View>
        <MenuInf
          homeIcon={<Ionicons name="home-outline" size={28} color="#146BF6" />}
          mapIcon={<Ionicons name="map-outline" size={28} color="#146BF6" />}
          onHomePress={navegarAHome}
          onMapPress={navegarAMapa}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <HeaderSimple />
      <ScrollView 
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refrescando}
            onRefresh={onRefresh}
            colors={["#068EF7"]}
            tintColor="#068EF7"
          />
        }
      >
        <TituloPestania style={styles.title}>
          Cierres Activos {cierres.length > 0 && `(${cierres.length})`}
        </TituloPestania>
        
        {cierres.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay cierres activos en este momento</Text>
            <Text style={styles.emptySubtext}>
              Puedes crear un nuevo cierre presionando el botón de abajo
            </Text>
          </View>
        ) : (
          cierres.map((cierre) => {
            const duracionDias = calcularDuracion(cierre.fechaInicio, cierre.fechaFin);
            
            return (
              <CardCierre
                key={cierre.id}
                titulo={cierre.lugarCierre}
                subtitulo={[
                  `Zona: ${cierre.zona?.nombreZona}` || "Sin zona",
                  `Duración: ${duracionDias} día${duracionDias !== 1 ? 's' : ''}`,
                  cierre.categoria ? `Motivo: ${cierre.descripcion}` : cierre.descripcion || "Sin descripción",
                ]}
                onPressEditar={() => navegarAEditarCierre(cierre)}
                onPressEliminar={() => handleEliminar(cierre)}
                style={styles.card}
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
        mapIcon={<Ionicons name="map-outline" size={28} color="#146BF6" />}
        onHomePress={navegarAHome}
        onMapPress={navegarAMapa}
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
    paddingTop: 10,
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
  // Nuevos estilos para los estados de carga y error
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    fontSize: 16,
    color: "#DC2626",
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    marginTop: 10,
  },
  emptyContainer: {
    width: "100%",
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
});

export default memo(princSuper);