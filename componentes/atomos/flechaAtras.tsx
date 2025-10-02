import React from 'react';
import { StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface BotonVolverProps {
  onPress: () => void;
  colorFondo?: string;
  colorFlecha?: string;
  deshabilitado?: boolean;
  estilo?: ViewStyle;
}

const BotonVolver: React.FC<BotonVolverProps> = ({
  onPress,
  colorFondo = '#E5E7EB',
  colorFlecha = '#131314ff',
  deshabilitado = false,
  estilo,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.contenedor,
        { backgroundColor: colorFondo },
        deshabilitado && styles.deshabilitado,
        estilo,
      ]}
      onPress={onPress}
      disabled={deshabilitado}
      activeOpacity={0.7}
    >
      <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <Path
          d="M19 12H5M5 12L12 19M5 12L12 5"
          stroke={colorFlecha}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  contenedor: {
    width: 45,
    height: 47,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deshabilitado: {
    opacity: 0.5,
  },
});

export default BotonVolver;