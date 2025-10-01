import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';

interface TituloProps {
  children: React.ReactNode;
  style?: TextStyle;
}

const Titulo: React.FC<TituloProps> = ({ children, style }) => {
  return (
    <Text style={[styles.text, style]}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 15,
    color: '#068EF7',
    fontWeight: '400',
  },
});

export default Titulo;