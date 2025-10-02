import React from 'react';
import { StyleSheet, Text, TextStyle } from 'react-native';

interface DescripcionNoti {
  texto: string;
  estilo?: TextStyle;
}

const DescripcionNoti: React.FC<DescripcionNoti> = ({ texto, estilo }) => {
  return (
    <Text style={[styles.subtitulo, estilo]}>
      {texto}
    </Text>
  );
};

const styles = StyleSheet.create({
  subtitulo: {
    fontFamily: 'Almarai',
    fontSize: 11,
  },
});

export default DescripcionNoti;