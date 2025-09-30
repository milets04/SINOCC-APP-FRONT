import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type CategoriaType = 'BAJO' | 'MEDIO' | 'ALTO';

interface CategoriaCierreProps {
  categoria: CategoriaType;
}

const CategoriaCierre: React.FC<CategoriaCierreProps> = ({ categoria }) => {
  const getEstilos = () => {
    switch (categoria) {
      case 'BAJO':
        return {
          backgroundColor: '#ddfce7ff',
          textColor: '#0EAA00',
          texto: 'LOW'
        };
      case 'MEDIO':
        return {
          backgroundColor: '#fcf9f2ff',
          textColor: '#C9BD0B',
          texto: 'MEDIUM'
        };
      case 'ALTO':
        return {
          backgroundColor: '#fae1e1ff',
          textColor: '#ED1E1E',
          texto: 'HIGH'
        };
      default:
        return {
          backgroundColor: '#E0E0E0',
          textColor: '#666666',
          texto: 'UNKNOWN'
        };
    }
  };

  const estilos = getEstilos();

  
  return (
    <View style={[
      styles.contenedor, 
      { 
        backgroundColor: estilos.backgroundColor,
        borderColor: estilos.textColor,
        borderWidth: 0.5
      }
    ]}>
      <Text style={[styles.texto, { color: estilos.textColor }]}>
        {estilos.texto}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  contenedor: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  texto: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});

export default CategoriaCierre;