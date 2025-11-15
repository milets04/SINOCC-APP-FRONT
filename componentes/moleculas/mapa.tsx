import axios from "axios";
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
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
}

const COCHABAMBA_REGION: Region = {
  latitude: -17.3935,
  longitude: -66.1570,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

// 🔵 API GRATIS DE OPENROUTESERVICE
const ORS_API_KEY = "TU_API_KEY_ORS_AQUI"; 

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

  const [coordenadasLinea, setCoordenadasLinea] = useState<
    { latitude: number; longitude: number }[]
  >([]);

  const handleMapPress = (event: any) => {
    try {
      const coordinate = event?.nativeEvent?.coordinate;
      if (!coordinate) return;
      onMapPress?.(coordinate);
    } catch (error) {
      console.error("Error en onMapPress:", error);
    }
  };

  const handleMarcadorPress = (ubicacion: UbicacionCierre) => {
    onMarcadorPress?.(ubicacion);
  };

  // ----------------------------------------------------------------
  // 🔵 SNAP A LA CALLE USANDO ORS (API GRATUITA)
  // ----------------------------------------------------------------
  const snapToRoad = async (lat: number, lon: number) => {
    try {
      const url = `https://api.openrouteservice.org/v2/nearest/driving-car?api_key=${ORS_API_KEY}&point=${lon},${lat}`;

      const res = await axios.get(url);

      if (
        res.data &&
        res.data.features &&
        res.data.features.length > 0 &&
        res.data.features[0].geometry.coordinates
      ) {
        const [snapLon, snapLat] = res.data.features[0].geometry.coordinates;

        return {
          latitude: snapLat,
          longitude: snapLon,
        };
      }
    } catch (error) {
      console.log("❌ Error ORS:", error);
    }

    // fallback → punto original
    return { latitude: lat, longitude: lon };
  };

  // Orden natural – en el orden en que los colocaste
  const ordenarNatural = (puntos: UbicacionCierre[]) => {
    return [...puntos].sort((a, b) => Number(a.id) - Number(b.id));
  };

  // ----------------------------------------------------------------
  // 🔵 PROCESAR TODOS LOS MARCADORES Y AJUSTARLOS A LA CALLE
  // ----------------------------------------------------------------
  useEffect(() => {
    const procesarSnap = async () => {
      if (ubicaciones.length < 2) {
        setCoordenadasLinea([]);
        return;
      }

      const orden = ordenarNatural(ubicaciones);

      const snappedPoints = [];

      for (const punto of orden) {
        const snap = await snapToRoad(punto.latitud, punto.longitud);
        snappedPoints.push(snap);
      }

      setCoordenadasLinea(snappedPoints);
    };

    procesarSnap();
  }, [ubicaciones]);

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
        showsCompass={true}
      >
        {/* 🔵 Línea ajustada a la calle */}
        {coordenadasLinea.length >= 2 && (
          <Polyline
            coordinates={coordenadasLinea}
            strokeColor="#1E90FF"
            strokeWidth={6}
            lineCap="round"
            lineJoin="round"
          />
        )}

        {/* 🔵 Marcadores */}
        {ubicaciones.map((ubicacion) => (
          <Marker
            key={ubicacion.id}
            coordinate={{
              latitude: ubicacion.latitud,
              longitude: ubicacion.longitud,
            }}
            onPress={(e) => {
              e.stopPropagation?.();
              handleMarcadorPress(ubicacion);
            }}
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