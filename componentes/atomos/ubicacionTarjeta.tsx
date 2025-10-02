import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';

interface UbicacionTarjetaProps {
  calle: string;
  zona: string;
  direccion: string;
  duracion: string;
  motivo: string;
  onEdit?: () => void;
  onDelete?: () => void;
  width?: number;
  height?: number;
  style?: ViewStyle;
}

const UbicacionTarjeta: React.FC<UbicacionTarjetaProps> = ({
  calle,
  zona,
  direccion,
  duracion,
  motivo,
  onEdit,
  onDelete,
  width = 132,
  height = 80,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {/* Icono de ubicación */}
      <View style={styles.iconContainer}>
        <View style={styles.locationIcon}>
          <View style={styles.locationDot} />
        </View>
      </View>

      {/* Título de la calle */}
      <Text style={styles.title}>{calle}</Text>

      {/* Tarjeta de información */}
      <View style={[styles.card, { width, height }]}>
        <Text style={styles.cardText}>
          <Text style={styles.label}>Zona{'\n'}</Text>
          <Text style={styles.value}>{zona}{'\n'}</Text>
          <Text style={styles.label}>Duración: </Text>
          <Text style={styles.value}>{duracion}{'\n'}</Text>
          <Text style={styles.label}>Motivo: </Text>
          <Text style={styles.value}>{motivo}</Text>
        </Text>
      </View>

      {/* Botones de acción */}
      <View style={styles.actionsContainer}>
        {onEdit && (
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={onEdit}
            activeOpacity={0.7}
          >
            <Text style={styles.editIcon}>✎</Text>
          </TouchableOpacity>
        )}
        
        {onDelete && (
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={onDelete}
            activeOpacity={0.7}
          >
            <View style={styles.deleteIcon}>
              <Text style={styles.deleteX}>✕</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    position: 'relative',
  },
  iconContainer: {
    marginBottom: 8,
  },
  locationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  locationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 12,
    textDecorationLine: 'underline',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 12,
  },
  cardText: {
    fontSize: 11,
    lineHeight: 16,
  },
  label: {
    color: '#000000',
    fontWeight: '400',
  },
  value: {
    color: '#000000',
    fontWeight: '400',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  actionButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIcon: {
    fontSize: 24,
    color: '#000000',
    fontWeight: 'bold',
  },
  deleteIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  deleteX: {
    fontSize: 20,
    color: '#000000',
    fontWeight: 'bold',
  },
});

export default UbicacionTarjeta;