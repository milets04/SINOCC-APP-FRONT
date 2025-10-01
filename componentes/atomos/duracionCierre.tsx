import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';

interface DuracionProps {
  children: React.ReactNode;
  style?: TextStyle;
}

const Duracion: React.FC<DuracionProps> = ({ children, style }) => {
  return (
    <Text style={[styles.text, style]}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 11,
    color: '#808080',
  },
});

export default Duracion;