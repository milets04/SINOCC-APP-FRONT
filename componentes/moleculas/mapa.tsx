import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, StyleSheet, View, ViewStyle } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_DEFAULT, Region } from 'react-native-maps';
import MarcadorMapa from '../atomos/marcadorMapa';

export interface UbicacionCierre {
  id: string | number;
  latitud: number;
  longitud: number;
  titulo?: string;
  descripcion?: string;
}
interface MapaProps {
  ubicaciones?: UbicacionCierre[];
  onMarcadorPress?: (ubicacion: UbicacionCierre) => void;
  onMapPress?: (coordinate: { latitude: number; longitude: number }) => void;
  width?: number;
  height?: number;
  initialRegion?: Region;
  zoomCoords?: { latitude: number; longitude: number }[];
  mostrarLinea?: boolean; 
}

const COCHABAMBA_REGION: Region = {
  latitude: -17.3935,
  longitude: -66.1570,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

const Mapa: React.FC<MapaProps> = ({
  ubicaciones = [],
  onMarcadorPress,
  onMapPress,
  width = Dimensions.get('window').width - 40,
  height = 600,
  initialRegion = COCHABAMBA_REGION,
  zoomCoords,
  mostrarLinea = false,
}) => {
  const mapRef = useRef<MapView>(null);
  const [mapReady, setMapReady] = useState(false);

  const handleMapPress = (event: any) => {
    const coordinate = event?.nativeEvent?.coordinate;
    if (!coordinate) return;
    onMapPress?.(coordinate);
  };

  const handleMarcadorPress = (ubicacion: UbicacionCierre) => {
    onMarcadorPress?.(ubicacion);
  };

const [coordenadasLinea, setCoordenadasLinea] = useState<{ latitude: number; longitude: number }[]>([]);
useEffect(() => {
  if (mostrarLinea && ubicaciones.length >= 2) {
    const ordenadas = [...ubicaciones].sort((a, b) => {
        const idA = typeof a.id === 'string' ? parseInt(a.id, 10) : a.id;
        const idB = typeof b.id === 'string' ? parseInt(b.id, 10) : b.id;
        if (isNaN(idA) || isNaN(idB)) return 0; 
        return idA - idB;
    });

    setCoordenadasLinea(
      ordenadas.map(u => ({
        latitude: u.latitud,
        longitude: u.longitud,
      }))
    );
  } else {
    setCoordenadasLinea([]); 
  }
}, [ubicaciones, mostrarLinea]);

  // Auto-zoom y centrado mejorado
  useEffect(() => {
    if (!mapRef.current || !mapReady || !zoomCoords || zoomCoords.length === 0) return;

  
    const timer = setTimeout(() => {
      if (zoomCoords.length === 1) {
        mapRef.current?.animateToRegion(
          {
            latitude: zoomCoords[0].latitude,
            longitude: zoomCoords[0].longitude,
            latitudeDelta: 0.01, 
            longitudeDelta: 0.01,
          },
          1000
        );
        return;
      }

    
      mapRef.current?.fitToCoordinates(zoomCoords, {
        edgePadding: { top: 120, left: 80, right: 80, bottom: 120 },
        animated: true,
      });
    }, 500); //Delay de 500ms

    return () => clearTimeout(timer);
  }, [zoomCoords, mapReady]);

  // Contenedor dinámico con TypeScript
  const containerStyle: ViewStyle = {
    width,
    height,
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        initialRegion={initialRegion}
        onPress={handleMapPress}
        onMapReady={() => setMapReady(true)} // Detectar cuando el mapa está listo
        showsUserLocation
        showsMyLocationButton
        showsCompass
        showsScale
        toolbarEnabled
        zoomEnabled
        scrollEnabled
        pitchEnabled
        rotateEnabled
      >
        {/* Línea del cierre */}
        {coordenadasLinea.length >= 2 && (
          <Polyline
            coordinates={coordenadasLinea}
            strokeColor="#1E90FF"
            strokeWidth={6}
            lineCap="round"
            lineJoin="round"
          />
        )}

        {/* Marcadores */}
        {ubicaciones.map(u => (
          <Marker
            key={u.id}
            coordinate={{ latitude: u.latitud, longitude: u.longitud }}
            title={u.titulo}
            description={u.descripcion}
            onPress={(e) => {
              e.stopPropagation?.();
              handleMarcadorPress(u);
            }}
          >
            <MarcadorMapa size={40} color="#068EF7" onPress={() => handleMarcadorPress(u)} />
          </Marker>
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#F5F5F5',
  },
  map: {
    width: '100%',
    height: '100%',
  },
});

export default Mapa;