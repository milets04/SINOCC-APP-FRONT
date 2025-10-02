import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';

interface MenuIconoProps {
  icon: React.ReactNode;
  onPress: () => void;
  containerStyle?: ViewStyle;
  disabled?: boolean;
}

const MenuIcono: React.FC<MenuIconoProps> = ({ 
  icon, 
  onPress, 
  containerStyle,
  disabled = false 
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, containerStyle]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.6}
    >
      {icon}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MenuIcono;