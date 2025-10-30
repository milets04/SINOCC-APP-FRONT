import Boton from "@/componentes/atomos/boton";
import TituloPestania from "@/componentes/atomos/tituloPestania";
import CardCierre from "@/componentes/moleculas/cardCierre";
import HeaderSimple from "@/componentes/moleculas/headerSimple";
import React, { memo } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

const princAdmin = () => {
  //ejm para ver y probar scroll
  const cierres = [
    {
      titulo: "Av. América y Tarija",
      subtitulo: ["Zona", "Duración: 2 días", "Motivo: Amago de tuberías"],
    },
    {
      titulo: "Av. América y Libertador",
      subtitulo: ["Zona", "Duración: 2 días", "Motivo: Amago de tuberías"],
    },
    {
      titulo: "Mel tonta",
      subtitulo: ["Zona", "Duración: 2 días", "Motivo: Amago de tuberías"],
    },
    {
        titulo: "Hola como estas",
        subtitulo: ["Zona", "Duración: 2 días", "Motivo: Amago de tuberías"],
    },
    {
      titulo: "Mel tonta",
      subtitulo: ["Zona", "Duración: 2 días", "Motivo: Amago de tuberías"],
    },
    {
      titulo: "Mel tonta",
      subtitulo: ["Zona", "Duración: 2 días", "Motivo: Amago de tuberías"],
    },
  ];

  return (
    <View style={styles.container}>
      <HeaderSimple />
      <ScrollView contentContainerStyle={styles.content}>
        <TituloPestania style={styles.title}>Cierres Activos</TituloPestania>
        
        {cierres.map((cierre, index) => (
          <CardCierre
            key={index}
            titulo={cierre.titulo}
            subtitulo={cierre.subtitulo}
            onPressEditar={() => console.log("Editar cierre", cierre.titulo)}
            onPressEliminar={() => console.log("Eliminar cierre", cierre.titulo)}
            style={styles.card}
          />
        ))}
        
        <Boton
          texto="Crear nuevo cierre"
          onPress={() => console.log("Crear nuevo cierre")}
          variante="primario"
          tamaño="grande"
          ancho="completo"
          estilo={styles.button}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    paddingTop: 0,
    paddingHorizontal: 16,
  },
  content: {
    alignItems: "center",
    paddingBottom: 50,
    paddingTop: 20,
  },
  title: {
    marginVertical: 20,
    marginHorizontal: 6,
    alignSelf: "flex-start",
  },
  card: {
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
  },
});

export default memo(princAdmin);