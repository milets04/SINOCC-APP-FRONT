import React from 'react';
import { StyleSheet, Text, TextStyle } from 'react-native';

interface DescripcionTitulo {
  texto: string;
  estilo?: TextStyle;
}

const DescripcionTitulo: React.FC<DescripcionTitulo> = ({ texto, estilo }) => {
  return (
    <Text style={[styles.descripcion, estilo]}>
      {texto}
    </Text>
  );
};

const styles = StyleSheet.create({
  descripcion: {
    fontFamily: 'SF Pro',
    fontSize: 15,
    color: '#919191',
  },
});

export default DescripcionTitulo;