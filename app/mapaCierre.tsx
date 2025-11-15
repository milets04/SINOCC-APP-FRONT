import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import Mapa, { UbicacionCierre } from '@/componentes/moleculas/mapa';
import MenuInf from '@/componentes/moleculas/menuInf';
import Constants from 'expo-constants';

// Interface para el cierre completo
interface CierreCompleto {
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
}

// Función para obtener la URL de la API (igual que en Principal)
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

const MapaCierre: React.FC = () => {
  const router = useRouter();
  const { cierreId } = useLocalSearchParams<{ cierreId: string }>();
  const [cierre, setCierre] = useState<CierreCompleto | null>(null);
  const [cargando, setCargando] = useState(true);
  const [ubicacionesMapa, setUbicacionesMapa] = useState<UbicacionCierre[]>([]);

  const screenHeight = Dimensions.get('window').height;
  const menuHeight = 60;
  const mapaHeight = screenHeight - menuHeight - 50;

  // Función para obtener los datos del cierre específico
  const obtenerCierre = async () => {
    if (!cierreId) {
      Alert.alert("Error", "No se proporcionó un ID de cierre válido");
      return;
    }

    setCargando(true);
    try {
      const response = await fetch(`${API_BASE}/cierres/${cierreId}`);
      if (!response.ok) throw new Error("Error al conectar con el servidor");
      
      const data = await response.json();

      if (data.exito) {
        setCierre(data.datos);
        
        // Convertir las ubicaciones al formato que espera el mapa
        const ubicacionesConvertidas: UbicacionCierre[] = data.datos.ubicaciones.map((ubicacion: any) => ({
          id: ubicacion.id,
          latitud: parseFloat(ubicacion.latitud),
          longitud: parseFloat(ubicacion.longitud),
          titulo: data.datos.lugarCierre,
          descripcion: data.datos.descripcion || "Sin descripción"
        }));

        setUbicacionesMapa(ubicacionesConvertidas);
      } else {
        throw new Error(data.mensaje || "Error al obtener el cierre");
      }
    } catch (error) {
      console.error("❌ Error al obtener el cierre:", error);
      Alert.alert(
        "Error de conexión",
        "No se pudo obtener la información del cierre. Verifica tu conexión o la IP del servidor."
      );
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (cierreId) {
      obtenerCierre();
    }
  }, [cierreId]);

  const navegarAlHome = () => {
    router.push('/');
  };

  const noHacerNada = () => {
    console.log("Ya estás en la pantalla del mapa.");
  };

  const handleMarcadorPress = (ubicacion: UbicacionCierre) => {
    Alert.alert(
      ubicacion.titulo || "Cierre",
      ubicacion.descripcion || "Sin descripción disponible",
      [{ text: "OK" }]
    );
  };

  if (cargando) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#146BF6" />
          <Text style={styles.loadingText}>Cargando información del cierre...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!cierre) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>No se pudo cargar la información del cierre</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Información del cierre */}
        <View style={styles.infoContainer}>
          <Text style={styles.titulo}>{cierre.lugarCierre}</Text>
          <Text style={styles.lugar}>{cierre.zona?.nombreZona || "Sin zona"}</Text>
          <Text style={styles.descripcion}>{cierre.descripcion || "Sin descripción"}</Text>
          <View style={styles.detallesContainer}>
            <Text style={styles.detalle}>
              Inicio: {cierre.fechaInicio ? new Date(cierre.fechaInicio).toLocaleDateString() : 'N/A'}
            </Text>
            <Text style={styles.detalle}>
              Categoría: <Text style={[
                styles.categoria,
                cierre.categoria === 'ALTO' ? styles.alto : 
                cierre.categoria === 'MEDIO' ? styles.medio : styles.bajo
              ]}>
                {cierre.categoria || 'N/A'}
              </Text>
            </Text>
          </View>
        </View>

        {/* Mapa */}
        <View style={[styles.mapaContainer, { height: mapaHeight }]}>
          <Mapa
            ubicaciones={ubicacionesMapa}
            onMarcadorPress={handleMarcadorPress}
            width={Dimensions.get('window').width}
            height={mapaHeight}
          />
        </View>

        {/* Menú Inferior */}
        <MenuInf
          homeIcon={<Ionicons name="home-outline" size={28} color="#146BF6" />}
          mapIcon={<Ionicons name="map-outline" size={28} color="#146BF6" />}
          onHomePress={navegarAlHome}
          onMapPress={noHacerNada}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  infoContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  lugar: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  descripcion: {
    fontSize: 14,
    color: '#444',
    marginBottom: 12,
    lineHeight: 20,
  },
  detallesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  detalle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  categoria: {
    fontWeight: 'bold',
  },
  alto: {
    color: '#FF3B30',
  },
  medio: {
    color: '#FF9500',
  },
  bajo: {
    color: '#34C759',
  },
  mapaContainer: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default MapaCierre;