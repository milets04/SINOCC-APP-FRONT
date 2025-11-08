import React, { useState } from 'react';
import {
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface HorasProps {
  placeholder?: string;
  value?: string;
  onValueChange: (time: string) => void;
  width?: number;
  height?: number;
  disabled?: boolean;
}

const Horas: React.FC<HorasProps> = ({
  placeholder = 'Hora',
  value,
  onValueChange,
  width = 152,
  height = 47,
  disabled = false,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [selectedHour, setSelectedHour] = useState(
    value ? parseInt(value.split(':')[0]) : 8
  );
  const [selectedMinute, setSelectedMinute] = useState(
    value ? parseInt(value.split(':')[1]) : 0
  );

  const horas = Array.from({ length: 24 }, (_, i) => i);
  const minutos = Array.from({ length: 60 }, (_, i) => i);

  const handleConfirm = () => {
    const timeString = `${selectedHour.toString().padStart(2, '0')}:${selectedMinute
      .toString()
      .padStart(2, '0')}`;
    onValueChange(timeString);
    setShowPicker(false);
  };

  const handleCancel = () => {
    setShowPicker(false);
  };

  return (
    <>
      <Pressable
        style={[
          styles.input,
          { width, height },
          disabled && styles.inputDisabled,
        ]}
        onPress={() => !disabled && setShowPicker(true)}
        disabled={disabled}
      >
        <Text
          style={[
            styles.inputText,
            !value && styles.placeholderText,
            disabled && styles.disabledText,
          ]}
        >
          {value || placeholder}
        </Text>
      </Pressable>

      <Modal
        visible={showPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCancel}
      >
        <Pressable style={styles.modalBackdrop} onPress={handleCancel}>
          <Pressable
            style={styles.modalContent}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Seleccionar hora</Text>
              <TouchableOpacity onPress={handleCancel} style={styles.closeButton}>
                <Text style={styles.closeIcon}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.pickersContainer}>
              {/* Selector de Horas */}
              <View style={styles.pickerColumn}>
                <Text style={styles.columnLabel}>Hora</Text>
                <ScrollView
                  style={styles.scrollPicker}
                  showsVerticalScrollIndicator={false}
                >
                  {horas.map((hora) => (
                    <TouchableOpacity
                      key={`hora-${hora}`}
                      style={[
                        styles.pickerItem,
                        selectedHour === hora && styles.pickerItemSelected,
                      ]}
                      onPress={() => setSelectedHour(hora)}
                    >
                      <Text
                        style={[
                          styles.pickerItemText,
                          selectedHour === hora && styles.pickerItemTextSelected,
                        ]}
                      >
                        {hora.toString().padStart(2, '0')}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Separador */}
              <Text style={styles.separator}>:</Text>

              {/* Selector de Minutos */}
              <View style={styles.pickerColumn}>
                <Text style={styles.columnLabel}>Minuto</Text>
                <ScrollView
                  style={styles.scrollPicker}
                  showsVerticalScrollIndicator={false}
                >
                  {minutos.map((minuto) => (
                    <TouchableOpacity
                      key={`minuto-${minuto}`}
                      style={[
                        styles.pickerItem,
                        selectedMinute === minuto && styles.pickerItemSelected,
                      ]}
                      onPress={() => setSelectedMinute(minuto)}
                    >
                      <Text
                        style={[
                          styles.pickerItemText,
                          selectedMinute === minuto && styles.pickerItemTextSelected,
                        ]}
                      >
                        {minuto.toString().padStart(2, '0')}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>

            {/* Botones */}
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={handleCancel}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.confirmButton]}
                onPress={handleConfirm}
              >
                <Text style={styles.confirmButtonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
  inputDisabled: {
    backgroundColor: '#F5F5F5',
    opacity: 0.6,
  },
  inputText: {
    fontSize: 16,
    color: '#000000',
  },
  placeholderText: {
    color: '#9E9E9E',
  },
  disabledText: {
    color: '#CCCCCC',
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
    maxHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
  },
  closeIcon: {
    fontSize: 20,
    color: '#666666',
    fontWeight: 'bold',
  },
  pickersContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    marginBottom: 20,
  },
  pickerColumn: {
    flex: 1,
    alignItems: 'center',
  },
  columnLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 10,
  },
  scrollPicker: {
    height: 200,
    width: '100%',
  },
  pickerItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderRadius: 8,
    marginVertical: 2,
  },
  pickerItemSelected: {
    backgroundColor: '#146BF6',
  },
  pickerItemText: {
    fontSize: 18,
    color: '#000000',
    fontWeight: '500',
  },
  pickerItemTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  separator: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#146BF6',
    marginTop: 30,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
  },
  confirmButton: {
    backgroundColor: '#146BF6',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default Horas;