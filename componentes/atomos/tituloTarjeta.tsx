import React from 'react';
import { StyleSheet, Text, TextStyle } from 'react-native';

interface TituloTarjetaProps {
    children: React.ReactNode;
    style?: TextStyle;
}

const TituloPestania: React.FC<TituloTarjetaProps> = ({ children, style}) => {
    return (
       <Text style={[styles.text, style]}>
        {children}
       </Text> 
    );
};

const styles = StyleSheet.create({
    text: {
        fontSize: 17,
        color: "#000000",
        fontWeight: "bold",
        fontFamily: "Almarai",
    },
});

export default TituloPestania;