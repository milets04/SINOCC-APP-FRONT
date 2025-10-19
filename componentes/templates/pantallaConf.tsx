import Boton from '@/componentes/atomos/boton';
import TituloPestania from '@/componentes/atomos/tituloPestania';
import Header from '@/componentes/moleculas/header';
import SettingsItem from '@/componentes/moleculas/menuConf';
import MenuInf from '@/componentes/moleculas/menuInf';
import ZoneNotifications from '@/componentes/moleculas/menuZonas';
import { Ionicons } from '@expo/vector-icons';
import { useState } from "react";
import { StyleSheet, View } from 'react-native';
export default function PantallaConfi() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(false);

  const [zones, setZones] = useState([
    { id: '1', name: 'Sacaba', enabled: false },
    { id: '2', name: 'Quillacollo', enabled: false },
    { id: '3', name: 'Zona centro', enabled: false },
  ]);

  const handleZoneToggle = (zoneId: string, newValue: boolean) => {
    setZones(prevZones =>
      prevZones.map(zone =>
        zone.id === zoneId ? { ...zone, enabled: newValue } : zone
      )
    );
    console.log(`Zona ${zoneId} cambió a: ${newValue}`);
  };

  const handleGoHome = () => {
    console.log('Navegando a Home');
  };

  const handleGoMap = () => {
    console.log('Navegando a Mapa');
  };

  const handleIniciarSesion = () => {
    console.log('Iniciando sesión...');
  };

  return (
    <View style={styles.container}>
      <Header />
      

        <View style={styles.titleContainer}>
          <TituloPestania>Centro de Configuración</TituloPestania>
        </View>

        <SettingsItem
          icon="bell"
          iconLibrary="feather"
          iconColor="#146BF6"
          title="Activar notificaciones"
          description="Recibe notificaciones sobre nuevos cierres"
          switchValue={notificationsEnabled}
          onSwitchChange={setNotificationsEnabled}
        />
        
        <SettingsItem
          icon="location"
          iconLibrary="evil"
          iconColor="#146BF6"
          title="Alertas por ubicación"
          description="Alertas de cierres cerca de ti"
          switchValue={locationEnabled}
          onSwitchChange={setLocationEnabled}
        />

        <View style={styles.zonesSection}>
          <ZoneNotifications
            zones={zones}
            onZoneToggle={handleZoneToggle}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Boton
            texto="Iniciar Sesión"
            onPress={handleIniciarSesion}
            variante="primario"
            ancho="ajustado"
            tamaño="mediano"
          />
        </View>
      
      <MenuInf
        homeIcon={<Ionicons name="home-outline" size={32} color="#146BF6" />}
        mapIcon={<Ionicons name="map-outline" size={32} color="#146BF6" />}
        onHomePress={handleGoHome}
        onMapPress={handleGoMap}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  titleContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#F8F8F8',
  },
  zonesSection: {
    marginTop: 16,
    backgroundColor: '#F8F8F8',
    marginLeft: 16,
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 20,
    paddingHorizontal: 16,
  },
});