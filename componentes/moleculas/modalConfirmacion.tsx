import React from 'react';
import { Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Boton from '../atomos/boton';

interface ModalConfirmacionProps {
  visible: boolean;
  titulo?: string;
  mensaje?: string;
  textoConfirmar?: string;
  textoCancelar?: string;
  onConfirmar: () => void;
  onCancelar: () => void;
}

const ModalConfirmacion: React.FC<ModalConfirmacionProps> = ({
  visible,
  titulo = '¿Eliminar cierre?',
  mensaje = '¿Está seguro que desea eliminar este cierre? Esta acción no se puede deshacer.',
  textoConfirmar = 'Sí, eliminar',
  textoCancelar = 'No, cancelar',
  onConfirmar,
  onCancelar,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onCancelar}
    >
      <TouchableOpacity 
        style={styles.overlay}
        activeOpacity={1}
        onPress={onCancelar}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity activeOpacity={1}>
            {/* Título */}
            <Text style={styles.titulo}>{titulo}</Text>

            {/* Mensaje */}
            <Text style={styles.mensaje}>{mensaje}</Text>

            {/* Botones */}
            <View style={styles.botonesContainer}>
              {/* Botón Cancelar */}
              <Boton
                texto={textoCancelar}
                onPress={onCancelar}
                variante="secundario"
                estilo={styles.botonCancelar}
                estiloTexto={styles.textoCancelar}
              />

              {/* Botón Confirmar */}
              <Boton
                texto={textoConfirmar}
                onPress={onConfirmar}
                variante="primario"
                estilo={styles.botonConfirmar}
              />
            </View>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: Dimensions.get('window').width * 0.85,
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 12,
    textAlign: 'center',
  },
  mensaje: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 22,
  },
  botonesContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  botonCancelar: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  textoCancelar: {
    color: '#666666',
  },
  botonConfirmar: {
    flex: 1,
    backgroundColor: '#FF4444',
  },
});

export default ModalConfirmacion;