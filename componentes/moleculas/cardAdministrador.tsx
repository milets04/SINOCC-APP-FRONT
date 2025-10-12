import React from 'react';
import { ImageSourcePropType, StyleSheet, View } from 'react-native';
import DescripcionTitulo from '../atomos/descripcionTitulo';
import BotonHeader from '../atomos/icons';
import PerfilAdministrador from '../atomos/perfilAdministrador';
import TituloTarjeta from '../atomos/tituloTarjeta';

export interface CardAdministradorProps {
  nombre: string;
  correo: string;
  usuario: string;
  fotoUri: ImageSourcePropType;
  onEdit?: () => void;
  onDelete?: () => void;
}

const CardAdministrador: React.FC<CardAdministradorProps> = ({
  nombre,
  correo,
  usuario,
  fotoUri,
  onEdit,
  onDelete,
}) => {
  return (
    <View style={styles.card}>
      {/* Sección izquierda: Foto + Información */}
      <View style={styles.infoContainer}>
        {/* Foto de perfil */}
        <PerfilAdministrador 
          imageSource={fotoUri}
          size={57}
        />

        {/* Información del admin */}
        <View style={styles.textoContainer}>
          <TituloTarjeta>{nombre}</TituloTarjeta>
          <DescripcionTitulo texto={correo} />
          <DescripcionTitulo texto={usuario} />
        </View>
      </View>

      {/* Sección derecha: Iconos de acción */}
      <View style={styles.accionesContainer}>
        {onEdit && (
          <BotonHeader
            icon="pencil-outline"
            library="materialCommunity"
            size={24}
            color="#000000"
            onPress={onEdit}
          />
        )}
        
        {onDelete && (
          <BotonHeader
            icon="cancel"
            library="material"
            size={24}
            color="#000000"
            onPress={onDelete}
            style={styles.iconoEliminar}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 346,
    height: 145,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  textoContainer: {
    flex: 1,
    gap: 4,
  },
  accionesContainer: {
    gap: 16,
    alignItems: 'center',
  },
  iconoEliminar: {
    marginTop: 8,
  },
});

export default CardAdministrador;