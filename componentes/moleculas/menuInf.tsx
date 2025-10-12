import MenuIcon from '@/componentes/atomos/menu';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface MenuInfProps {
  homeIcon: React.ReactNode;
  mapIcon: React.ReactNode;
  onHomePress: () => void;
  onMapPress: () => void;
}

const MenuInf: React.FC<MenuInfProps> = ({
  homeIcon,
  mapIcon,
  onHomePress,
  onMapPress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.topBorder} />
      <View style={styles.menuContainer}>
        <MenuIcon icon={homeIcon} onPress={onHomePress} />
        <MenuIcon icon={mapIcon} onPress={onMapPress} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#FFFFFF',
  },
  topBorder: {
    width: '100%',
    height: 2,
    backgroundColor: '#146BF6',
  },
  menuContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
  },
});

export default MenuInf;