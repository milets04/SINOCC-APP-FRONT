import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ActivityIndicator, Dimensions, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import Mapa from '@/componentes/moleculas/mapa';
import MenuInf from '@/componentes/moleculas/menuInf';
import { useCierres } from '@/contexto/cierres';

const TemplateMapa: React.FC = () => {
  const router = useRouter(); 
  const { cierres, cargandoCierres, errorCierres, recargarCierres } = useCierres();

  const screenHeight = Dimensions.get('window').height;
  const menuHeight = 60; 
  const mapaHeight = screenHeight - menuHeight - 50; 

  const navegarAlHome = () => {
    router.push('/'); 
  };

  const noHacerNada = () => {
    console.log("Ya estás en la pantalla del mapa.");
  };

  // Convertir los cierres al formato esperado por el componente Mapa
  const ubicacionesParaMapa = cierres.map(cierre => ({
    id: cierre.id,
    latitud: cierre.ubicacion.latitud,
    longitud: cierre.ubicacion.longitud,
    titulo: cierre.lugarCierre,
    descripcion: cierre.descripcion,
  }));

  // Log para debug
  console.log('🗺️ TemplateMapa - Total de cierres:', cierres.length);
  console.log('🗺️ TemplateMapa - Total de ubicaciones para mapa:', ubicacionesParaMapa.length);
  
  if (ubicacionesParaMapa.length > 0) {
    console.log('📍 Primera ubicación:', ubicacionesParaMapa[0]);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Mapa */}
        <View style={styles.mapaContainer}>
          {cargandoCierres ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#146BF6" />
              <Text style={styles.loadingText}>Cargando cierres...</Text>
            </View>
          ) : errorCierres ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
              <Text style={styles.errorText}>{errorCierres}</Text>
              <Text style={styles.retryText} onPress={recargarCierres}>
                Tocar para reintentar
              </Text>
            </View>
          ) : (
            <>
              <Mapa
                ubicaciones={ubicacionesParaMapa} 
                width={Dimensions.get('window').width}
                height={mapaHeight}
              />
              {ubicacionesParaMapa.length === 0 && (
                <View style={styles.noDataContainer}>
                  <Text style={styles.noDataText}>
                    No hay cierres activos en este momento
                  </Text>
                </View>
              )}
            </>
          )}
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
  mapaContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    marginTop: 12,
  },
  retryText: {
    fontSize: 14,
    color: '#146BF6',
    marginTop: 8,
    textDecorationLine: 'underline',
  },
  noDataContainer: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  noDataText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
});

export default TemplateMapa;