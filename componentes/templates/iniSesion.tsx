import Boton from "@/componentes/atomos/boton";
import Input from "@/componentes/atomos/input";
import Subtitulo from "@/componentes/atomos/subtitulo";
import HeaderSimple from "@/componentes/moleculas/headerSimple";
import React, { memo } from "react";
import { Dimensions, ScrollView, StyleSheet, View } from "react-native";

// Obtener las dimensiones de la pantalla
const { width, height } = Dimensions.get("window");

const IniSesion = () => {
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <HeaderSimple />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Subtitulo style={styles.subtitulo}>Email</Subtitulo>
            <Input placeholder="Ingresa tu correo" style={styles.input} />
          </View>
          <View style={styles.inputContainer}>
            <Subtitulo style={styles.subtitulo}>Contraseña</Subtitulo>
            <Input placeholder="Ingresa tu contraseña" secureTextEntry style={styles.input} />
          </View>
          <Boton texto="Iniciar Sesión" onPress={() => console.log("Iniciar sesión")} variante="primario" tamaño="grande" ancho="completo" estilo={styles.button} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    paddingTop: 15, 
    paddingHorizontal: 16,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10, 
    paddingTop: 20, 
  },
  content: {
    alignItems: "center",
    paddingBottom: 50,
    paddingTop: 150,
  },
  formContainer: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 55,
  },
  input: {
    width: "100%",
    marginTop: 5,
    paddingHorizontal: 18,
    height: 50,
  },
  button: {
    marginTop: 120,
  },
  subtitulo: {
    marginBottom: 5,
    color: "#151717",
    fontSize: 16.2,
    fontWeight: "bold",
  },
});

export default memo(IniSesion);
