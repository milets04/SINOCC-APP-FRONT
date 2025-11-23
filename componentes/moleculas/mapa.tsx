import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, StyleSheet, View, ViewStyle } from 'react-native';
import MapView, { Marker, Polygon, Polyline, PROVIDER_GOOGLE, Region } from 'react-native-maps';
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
  zonaSeleccionada?: string | null;
}

const COCHABAMBA_REGION: Region = {
  latitude: -17.3935,
  longitude: -66.1570,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

// Definir los polígonos de cada zona (coordenadas aproximadas - AJUSTAR A TUS ZONAS REALES)
const POLIGONOS_ZONAS: Record<string, { latitude: number; longitude: number }[]> = {
  'Quillacollo': [
    { latitude: -17.411120, longitude: -66.206903 }, //-17.411120, -66.206903
    { latitude: -17.334348, longitude: -66.201991 }, //-17.334348, -66.201991
    { latitude: -17.334963, longitude: -66.300720 }, //-17.334963, -66.300720
    { latitude: -17.413780, longitude: -66.294594 }, //-17.413780, -66.294594
  ],
  'Sacaba': [
    { latitude: -17.371891, longitude: -66.087042 }, // -17.371891, -66.087042
    { latitude: -17.404725, longitude: -66.084285 },  // -17.397489, -66.007263{ latitude: -17.404725, longitude: -66.084285 },
    { latitude: -17.422835, longitude: -66.018441 }, // -17.404725, -66.084285
    { latitude: -17.397489, longitude: -66.007263 }, // -17.422835, -66.018441
    
  ],
  'Zona Centro': [
    { latitude: -17.424500, longitude: -66.205495 }, // -17.424500, -66.205495
    { latitude: -17.340170, longitude: -66.198288}, // -17.340170, -66.198288
    { latitude: -17.368661, longitude: -66.097837 }, // -17.368661, -66.097837  
    { latitude: -17.413215, longitude: -66.096573 }, // -17.413215, -66.096573
  ],
};

const puntoEnPoligono = (
  punto: { latitude: number; longitude: number },
  poligono: { latitude: number; longitude: number }[]
): boolean => {
  let dentro = false;
  
  for (let i = 0, j = poligono.length - 1; i < poligono.length; j = i++) {
    const xi = poligono[i].latitude;
    const yi = poligono[i].longitude;
    const xj = poligono[j].latitude;
    const yj = poligono[j].longitude;
    
    const intersecta = ((yi > punto.longitude) !== (yj > punto.longitude))
      && (punto.latitude < (xj - xi) * (punto.longitude - yi) / (yj - yi) + xi);
    
    if (intersecta) dentro = !dentro;
  }
  
  return dentro;
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
  zonaSeleccionada = null,
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

   // Obtener el polígono de la zona seleccionada
  const poligonoZona = zonaSeleccionada ? POLIGONOS_ZONAS[zonaSeleccionada] : null;

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
        provider={PROVIDER_GOOGLE}
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
        {/* Polígono de la zona seleccionada */}
        {poligonoZona && (
          <Polygon
            coordinates={poligonoZona}
            fillColor="rgba(6, 142, 247, 0.15)"
            strokeColor="#068EF7"
            strokeWidth={2}
          />
        )}

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

//Exportar la función de validación para uso externo
export { POLIGONOS_ZONAS, puntoEnPoligono };

