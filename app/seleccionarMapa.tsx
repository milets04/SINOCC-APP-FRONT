import Boton from '@/componentes/atomos/boton';
import Mapa, { UbicacionCierre } from '@/componentes/moleculas/mapa';
import { UbicacionData, useUbicaciones } from '@/contexto/ubicaciones';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function PantallaSeleccionarMapa() {
  const router = useRouter();
  const { ubicaciones, setUbicaciones } = useUbicaciones();

  const handleMapPress = (coordinate: { latitude: number; longitude: number }) => {

    const nuevaUbicacion: UbicacionData = {
      id: Date.now(),
      latitud: coordinate.latitude,
      longitud: coordinate.longitude,
      direccion: `Ubicación (${(ubicaciones.length + 1)})`,
    };
    setUbicaciones((prev) => [...prev, nuevaUbicacion]);
  };

  const ubicacionesParaMapa: UbicacionCierre[] = ubicaciones.map((ub) => ({
    id: ub.id,
    latitud: ub.latitud,
    longitud: ub.longitud,
    titulo: ub.direccion, 
    descripcion: `Lat: ${ub.latitud.toFixed(4)}, Lon: ${ub.longitud.toFixed(4)}`
  }));

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.titulo}>Agrega los marcadores</Text>
        <Text style={styles.subtitulo}>Toca el mapa para agregar un punto de cierre</Text>
        
        <Mapa
          width={Dimensions.get('window').width - 40}
          height={Dimensions.get('window').height - 250}
          ubicaciones={ubicacionesParaMapa} 
          onMapPress={handleMapPress}
        />
        
        <Boton
          texto="Listo"
          onPress={() => router.back()}
          variante="primario"
          estilo={styles.boton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  boton: {
    marginTop: 20,
    width: '100%',
  },
});