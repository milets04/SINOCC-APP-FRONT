import React from 'react';
import { Image, ImageSourcePropType, StyleSheet, View, ViewStyle } from 'react-native';

interface PerfilAdministradorProps {
  imageSource: ImageSourcePropType;
  size?: number;
  style?: ViewStyle;
}

const PerfilAdministrador: React.FC<PerfilAdministradorProps> = ({
  imageSource,
  size = 57,
  style,
}) => {
  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <Image
        source={imageSource}
        style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]}
        resizeMode="cover"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    backgroundColor: '#E0E0E0',
  },
});

export default PerfilAdministrador;