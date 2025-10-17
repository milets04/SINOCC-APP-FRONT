import Mapa from '@/componentes/moleculas/mapa';
import MenuInf from '@/componentes/moleculas/menuInf';
import React from 'react';
import { Dimensions, SafeAreaView, StyleSheet, View } from 'react-native';

interface TemplateMapaProps {
  homeIcon: React.ReactNode;
  mapIcon: React.ReactNode;
  onHomePress: () => void;
  onMapPress: () => void;
}

const TemplateMapa: React.FC<TemplateMapaProps> = ({
  homeIcon,
  mapIcon,
  onHomePress,
  onMapPress,
}) => {
  const screenHeight = Dimensions.get('window').height;
  const menuHeight = 60; // Altura aproximada del MenuInf
  const mapaHeight = screenHeight - menuHeight - 50; // 50 para SafeAreaView

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Mapa */}
        <View style={styles.mapaContainer}>
          <Mapa
            ubicaciones={[]} // Sin marcadores por ahora
            width={Dimensions.get('window').width}
            height={mapaHeight}
          />
        </View>

        {/* Menú Inferior */}
        <MenuInf
          homeIcon={homeIcon}
          mapIcon={mapIcon}
          onHomePress={onHomePress}
          onMapPress={onMapPress}
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
});

export default TemplateMapa;