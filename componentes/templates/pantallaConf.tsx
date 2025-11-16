import Boton from '@/componentes/atomos/boton';
import TituloPestania from '@/componentes/atomos/tituloPestania';
import Header from '@/componentes/moleculas/header';
import SettingsItem from '@/componentes/moleculas/menuConf';
import MenuInf from '@/componentes/moleculas/menuInf';
import ZoneNotifications from '@/componentes/moleculas/menuZonas';
import { useZonas } from '@/contexto/zonas';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from 'react-native';

export default function PantallaConfi() {
  const [locationEnabled, setLocationEnabled] = useState(false);
  const { zonas, notificationsEnabled, toggleZona, setNotificationsEnabled } = useZonas();

  const router = useRouter();

  const navegarAHome = () => {
      router.push("/");
  };

  const navegarAIniSesion = () => {
      router.push("/inicioSesion");
  };

  const navegarAlMapa = () => {
    router.push("/mapa");
  };
  
  const navegarANotif = () => {
    router.push("/pantallaNotif");
  };

  return (
    <View style={styles.container}>
      <Header 
        onBellPress={navegarANotif}
        onSettingsPress={() => console.log("Ya nos encontramos en configuraciones")}
      />

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

        <View style={styles.zonesSection}>
          <ZoneNotifications
            zones={zonas}
            onZoneToggle={(id, enabled) => toggleZona(id, enabled)}
            disabled={!notificationsEnabled}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Boton
            texto="Iniciar Sesión"
            onPress={navegarAIniSesion}
            variante="primario"
            ancho="ajustado"
            tamaño="mediano"
          />
        </View>
      
      <View style={styles.footerContainer}>
        <MenuInf
          homeIcon={<Ionicons name="home-outline" size={32} color="#146BF6" />}
          mapIcon={<Ionicons name="map-outline" size={32} color="#146BF6" />}
          onHomePress={navegarAHome}
          onMapPress={navegarAlMapa}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    paddingVertical: 20,
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
  footerContainer: {
    paddingTop: 55,
  },
});