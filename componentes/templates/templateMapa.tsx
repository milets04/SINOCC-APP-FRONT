import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Dimensions, SafeAreaView, StyleSheet, View } from 'react-native';

import Mapa from '@/componentes/moleculas/mapa';
import MenuInf from '@/componentes/moleculas/menuInf';

type Ubicacion = { id: number; latitud: string; longitud: string; lugarCierre: string };

interface TemplateMapaProps {
  ubicaciones: Ubicacion[];
}

const TemplateMapa: React.FC<TemplateMapaProps> = ({ ubicaciones }) => {
  const router = useRouter(); 

  const screenHeight = Dimensions.get('window').height;
  const menuHeight = 60; 
  const mapaHeight = screenHeight - menuHeight - 50; 

  const navegarAlHome = () => {
    router.push('/'); 
  };

  const noHacerNada = () => {
    console.log("Ya estás en la pantalla del mapa.");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Mapa */}
        <View style={styles.mapaContainer}>
          <Mapa
            ubicaciones={ubicaciones} 
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
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  mapaContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});

export default TemplateMapa;