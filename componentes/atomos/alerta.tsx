import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

type Categoria = 'peligro' | 'exito' | 'advertencia';

interface IconoAlertaProps {
  categoria: Categoria;
  estilo?: ViewStyle;
}

const IconoAlerta: React.FC<IconoAlertaProps> = ({
  categoria,
  estilo,
}) => {
  // Colores por categoría
  const colores = {
    peligro: '#ED1E1E',      
    exito: '#0EAA00',        
    advertencia: '#C9BD0B',  
  };

  const colorActual = colores[categoria];

  return (
    <View style={[styles.contenedor, estilo]}>
      <Svg width="36" height="39" viewBox="0 0 36 39" fill="none">
        
        <Path
          d="M18 2L34.3923 35H1.60769L18 2Z"
          stroke={colorActual}
          strokeWidth="3"
          strokeLinejoin="round"
          fill="none"
        />
        
        <Path
          d="M18 13V23"
          stroke={colorActual}
          strokeWidth="3"
          strokeLinecap="round"
        />
        
        <Circle
          cx="18"
          cy="28"
          r="1.5"
          fill={colorActual}
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  contenedor: {
    width: 36,
    height: 39,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default IconoAlerta;