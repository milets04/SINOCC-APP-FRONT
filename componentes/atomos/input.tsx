import React from 'react';
import { StyleSheet, TextInput, TextInputProps, TextStyle, DimensionValue } from 'react-native';

interface InputProps extends TextInputProps {
  width?: DimensionValue;
  height?: number;
  placeholder?: string;
}

const Input: React.FC<InputProps> = ({
  width = '100%',
  height = 47,
  placeholder = '',
  style,
  ...props
}) => {
  return (
    <TextInput
      style={[
        styles.input,
        {
          width,
          height,
        },
        style as TextStyle,
      ]}
      placeholder={placeholder}
      placeholderTextColor="#000000"
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#000000',
    backgroundColor: '#FFFFFF',
  },
});

export default Input;