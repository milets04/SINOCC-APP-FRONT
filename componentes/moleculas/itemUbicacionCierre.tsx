import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BotonHeader from '../atomos/icons';

export interface ItemUbicacionProps {
  direccion: string;
  onDelete: () => void;
}

const ItemUbicacion: React.FC<ItemUbicacionProps> = ({
  direccion,
  onDelete,
}) => {
  return (
    <View style={styles.container}>
      {/* Texto de la dirección */}
      <Text style={styles.direccion} numberOfLines={1}>
        {direccion}
      </Text>

      {/* Botón de eliminar */}
      <TouchableOpacity 
        style={styles.botonEliminar}
        onPress={onDelete}
        activeOpacity={0.7}
      >
        <BotonHeader
          icon="cancel"
          library="material"
          size={20}
          color="#FF0000"
          onPress={onDelete}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 296,
    height: 47,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  direccion: {
    flex: 1,
    fontSize: 15,
    color: '#000000',
    marginRight: 8,
  },
  botonEliminar: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ItemUbicacion;