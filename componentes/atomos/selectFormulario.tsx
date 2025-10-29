import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Platform,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

export interface SelectOption {
  label: string;
  value: string | number;
}

type Dimension = number | `${number}%`;

interface SelectProps {
  width?: Dimension;
  height?: number;
  placeholder?: string;
  options: SelectOption[];
  value?: string | number;
  onValueChange: (value: string | number) => void;
  style?: StyleProp<ViewStyle>;
}

const Select: React.FC<SelectProps> = ({
  width = '100%',
  height = 47,
  placeholder = 'Seleccionar',
  options,
  value,
  onValueChange,
  style,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const animatedHeight = useRef(new Animated.Value(0)).current;
  
  const selectedOption = options.find(option => option.value === value);
  const displayText = selectedOption ? selectedOption.label : placeholder;

  // Calcular altura del dropdown (máximo 4 items visibles)
  const maxVisibleItems = 4;
  const itemHeight = 47;
  const dropdownHeight = Math.min(options.length, maxVisibleItems) * itemHeight;

  useEffect(() => {
    Animated.timing(animatedHeight, {
      toValue: isOpen ? dropdownHeight : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isOpen]);

  const handleSelect = (selectedValue: string | number) => {
    onValueChange(selectedValue);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <View style={[{ width }, style]}>
      {/* Botón principal del select */}
      <TouchableOpacity
        style={[
          styles.selectButton, 
          { height },
          isOpen && styles.selectButtonOpen
        ]}
        onPress={toggleDropdown}
        activeOpacity={0.7}
      >
        <Text style={[styles.selectText, !selectedOption && styles.placeholderText]}>
          {displayText}
        </Text>
        <Animated.Text 
          style={[
            styles.arrow,
            {
              transform: [{
                rotate: animatedHeight.interpolate({
                  inputRange: [0, dropdownHeight],
                  outputRange: ['0deg', '180deg'],
                })
              }]
            }
          ]}
        >
          ▼
        </Animated.Text>
      </TouchableOpacity>

      {/* Dropdown animado - CAMBIADO A SCROLLVIEW */}
      {isOpen && (
        <Animated.View
          style={[
            styles.dropdownContainer,
            {
              height: animatedHeight,
              maxHeight: dropdownHeight,
            }
          ]}
        >
          <ScrollView
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={true}
          >
            {options.map((item, index) => (
              <TouchableOpacity
                key={item.value.toString()}
                style={[
                  styles.optionItem,
                  { height: itemHeight },
                  item.value === value && styles.selectedOption,
                  index === options.length - 1 && styles.lastOption,
                ]}
                onPress={() => handleSelect(item.value)}
                activeOpacity={0.7}
              >
                <Text 
                  style={[
                    styles.optionText,
                    item.value === value && styles.selectedOptionText
                  ]}
                >
                  {item.label}
                </Text>
                {item.value === value && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>
      )}
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
    zIndex: 2,
  },
  selectButtonOpen: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomWidth: 0,
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
  dropdownContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#000000',
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    overflow: 'hidden',
    position: 'absolute',
    top: 47,
    left: 0,
    right: 0,
    zIndex: 1000,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  optionItem: {
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
  },
  lastOption: {
    borderBottomWidth: 0,
  },
  selectedOption: {
    backgroundColor: '#F0F8FF',
  },
  optionText: {
    fontSize: 16,
    color: '#000000',
    flex: 1,
  },
  selectedOptionText: {
    fontWeight: '600',
    color: '#146BF6',
  },
  checkmark: {
    fontSize: 18,
    color: '#146BF6',
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default Select;