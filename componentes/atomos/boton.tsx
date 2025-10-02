import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';

interface BotonProps {
  texto: string;
  onPress: () => void;
  variante?: 'primario' | 'secundario' | 'terciario';
  deshabilitado?: boolean;
  cargando?: boolean;
  ancho?: 'completo' | 'ajustado';
  tamaño?: 'pequeño' | 'mediano' | 'grande';
  estilo?: ViewStyle;
  estiloTexto?: TextStyle;
}

const Boton: React.FC<BotonProps> = ({
  texto,
  onPress,
  variante = 'primario',
  deshabilitado = false,
  cargando = false,
  ancho = 'ajustado',
  tamaño = 'mediano',
  estilo,
  estiloTexto,
}) => {
  const obtenerEstiloBoton = (): ViewStyle => {
    const estilosBase: ViewStyle = {
      ...styles.botonBase,
      ...styles[`boton_${variante}`],
      ...styles[`tamaño_${tamaño}`],
    };

    if (ancho === 'completo') {
      estilosBase.width = '100%';
    }

    if (deshabilitado) {
      estilosBase.opacity = 0.5;
    }

    return estilosBase;
  };

  const obtenerEstiloTexto = (): TextStyle => {
    return {
      ...styles.textoBase,
      ...styles[`texto_${variante}`],
      ...styles[`textoTamaño_${tamaño}`],
    };
  };

  return (
    <TouchableOpacity
      style={[obtenerEstiloBoton(), estilo]}
      onPress={onPress}
      disabled={deshabilitado || cargando}
      activeOpacity={0.7}
    >
      {cargando ? (
        <ActivityIndicator 
          color={variante === 'primario' ? '#FFFFFF' : '#146BF6'} 
          size="small" 
        />
      ) : (
        <Text style={[obtenerEstiloTexto(), estiloTexto]}>
          {texto}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  botonBase: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  boton_primario: {
    backgroundColor: '#146BF6',
  },
  boton_secundario: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#146BF6',
  },
  boton_terciario: {
    backgroundColor: 'transparent',
  },
  tamaño_pequeño: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  tamaño_mediano: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  tamaño_grande: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  textoBase: {
    fontWeight: '600',
  },
  texto_primario: {
    color: '#FFFFFF',
  },
  texto_secundario: {
    color: '#146BF6',
  },
  texto_terciario: {
    color: '#146BF6',
  },
  textoTamaño_pequeño: {
    fontSize: 14,
  },
  textoTamaño_mediano: {
    fontSize: 15,
  },
  textoTamaño_grande: {
    fontSize: 17,
  },
});

export default Boton;