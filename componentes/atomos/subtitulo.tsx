import React from 'react';
import { StyleSheet, Text, TextStyle } from 'react-native';

interface SubtituloProps {
    children: React.ReactNode;
    style?: TextStyle;
}

const Subtitulo: React.FC<SubtituloProps> = ({ children, style}) => {
    return (
       <Text style={[styles.text, style]}>
        {children}
       </Text> 
    );
};

const styles = StyleSheet.create({
    text: {
        fontSize: 11,
        color: "#000000",
        fontWeight: "light",
        fontFamily: "Almarai",
        lineHeight: 18,
    },
});

export default Subtitulo;