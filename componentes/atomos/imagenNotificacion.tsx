import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';

type NotificationColor = 'red' | 'yellow' | 'green';

interface ImagenNotificacionProps {
  color?: NotificationColor;
  size?: number;
  style?: ViewStyle;
}

const colorMap: Record<NotificationColor, string> = {
  red: '#ED1E1E',
  yellow: '#C9BD0B',
  green: '#0EAA00',
};

const ImagenNotificacion: React.FC<ImagenNotificacionProps> = ({
  color = 'red',
  size = 36,
  style,
}) => {
  const hexColor = colorMap[color];
  const scale = size / 36; 

  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <Svg
        width={size}
        height={size}
        viewBox="0 0 36 36"
        fill="none"
      >
        {/* Triángulo exterior */}
        <Path
          d="M18 2L34 32H2L18 2Z"
          stroke={hexColor}
          strokeWidth={3}
          fill="white"
          strokeLinejoin="round"
        />
        
        {/* Signo de exclamación - línea vertical */}
        <Rect
          x="16"
          y="12"
          width="4"
          height="10"
          fill={hexColor}
          rx="2"
        />
        
        {/* Signo de exclamación - punto */}
        <Rect
          x="16"
          y="24"
          width="4"
          height="4"
          fill={hexColor}
          rx="2"
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ImagenNotificacion;