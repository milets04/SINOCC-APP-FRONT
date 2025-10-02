import React, { useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';

export interface SelectOption {
  label: string;
  value: string | number;
}

interface SelectProps {
  width?: number | string;
  height?: number;
  placeholder?: string;
  options: SelectOption[];
  value?: string | number;
  onValueChange: (value: string | number) => void;
  style?: ViewStyle;
}

const Select: React.FC<SelectProps> = ({
  width = '100%', //cambiar esto bros, son cosas por defecto
  height = 47, //cambiar esto bros, son cosas por defecto
  placeholder = 'Seleccionar',
  options,
  value,
  onValueChange,
  style,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const selectedOption = options.find(option => option.value === value);
  const displayText = selectedOption ? selectedOption.label : placeholder;

  const handleSelect = (selectedValue: string | number) => {
    onValueChange(selectedValue);
    setIsOpen(false);
  };

  return (
    <View style={[{ width, height }, style]}>
      <TouchableOpacity
        style={[styles.selectButton, { height }]}
        onPress={() => setIsOpen(true)}
        activeOpacity={0.7}
      >
        <Text style={[styles.selectText, !selectedOption && styles.placeholderText]}>
          {displayText}
        </Text>
        <Text style={styles.arrow}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View style={styles.modalContent}>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.optionItem,
                    item.value === value && styles.selectedOption,
                  ]}
                  onPress={() => handleSelect(item.value)}
                >
                  <Text style={styles.optionText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  selectButton: {
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectText: {
    fontSize: 16,
    color: '#000000',
    flex: 1,
  },
  placeholderText: {
    color: '#999999',
  },
  arrow: {
    fontSize: 12,
    color: '#000000',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    width: '80%',
    maxHeight: '60%',
    borderWidth: 1,
    borderColor: '#000000',
  },
  optionItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  selectedOption: {
    backgroundColor: '#F0F0F0',
  },
  optionText: {
    fontSize: 16,
    color: '#000000',
  },
});

export default Select;