import Boton from "@/componentes/atomos/boton";
import TituloPestania from "@/componentes/atomos/tituloPestania";
import CardCierre from "@/componentes/moleculas/cardCierre";
import HeaderSimple from "@/componentes/moleculas/headerSimple";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { memo } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import MenuInf from "../moleculas/menuInf";

const princSuper= () => {

  const router = useRouter();

  const navegarACrearCierre = () => {
    router.push("/crearCierre");
  };

  const navegarAEditarCierre = () => {
    router.push("/crearCierre");
  };

  const cierres = [
    {
      titulo: "Cierre en Av. América",
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
            onPressEditar={navegarAEditarCierre}
            onPressEliminar={() => console.log("Eliminar cierre", cierre.titulo)}
            style={styles.card}
          />
        ))}
        
        <Boton
          texto="Crear nuevo cierre"
          onPress={navegarACrearCierre}
          variante="primario"
          tamaño="grande"
          ancho="completo"
          estilo={styles.button}
        />
      </ScrollView>
       <MenuInf
      homeIcon={<Ionicons name="home-outline" size={28} color="#146BF6" />}
      mapIcon={<Ionicons name="map-outline" size={28} color="#146BF6" />}
      onHomePress={() => console.log("Home pressed")}
      onMapPress={() => console.log("Map pressed")}
    />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    paddingTop: 25,
    paddingHorizontal: 16,
  },
  content: {
    alignItems: "center",
    paddingBottom: 50,
    paddingTop: 10,
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

export default memo(princSuper);
