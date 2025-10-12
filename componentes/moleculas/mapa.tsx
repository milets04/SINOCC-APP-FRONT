import React, { useRef, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT, Region } from 'react-native-maps';
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
}

// Coordenadas de Cochabamba, Bolivia
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
}) => {
  const mapRef = useRef<MapView>(null);
  const [region, setRegion] = useState<Region>(initialRegion);

  const handleMapPress = (event: any) => {
    if (onMapPress) {
      const { latitude, longitude } = event.nativeEvent.coordinate;
      onMapPress({ latitude, longitude });
    }
  };

  const handleMarcadorPress = (ubicacion: UbicacionCierre) => {
    if (onMarcadorPress) {
      onMarcadorPress(ubicacion);
    }
  };

  const containerStyle = {
    ...styles.container,
    width: width,
    height: height,
  };

  return (
    <View style={containerStyle}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        initialRegion={initialRegion}
        region={region}
        onRegionChangeComplete={setRegion}
        onPress={handleMapPress}
        showsUserLocation={true}
        showsMyLocationButton={true}
        showsCompass={true}
        showsScale={true}
        toolbarEnabled={true}
        zoomEnabled={true}
        scrollEnabled={true}
        pitchEnabled={true}
        rotateEnabled={true}
      >
        {/* Marcadores de cierres */}
        {ubicaciones.map((ubicacion) => (
          <Marker
            key={ubicacion.id}
            coordinate={{
              latitude: ubicacion.latitud,
              longitude: ubicacion.longitud,
            }}
            title={ubicacion.titulo}
            description={ubicacion.descripcion}
            onPress={() => handleMarcadorPress(ubicacion)}
          >
            <MarcadorMapa
              size={40}
              color="#068EF7"
              onPress={() => handleMarcadorPress(ubicacion)}
            />
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