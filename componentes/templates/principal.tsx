import CierreAct from "@/componentes/moleculas/cierreAct";
import Header from "@/componentes/moleculas/header";
import MenuInf from "@/componentes/moleculas/menuInf";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { memo } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

const Principal = () => {
    const router = useRouter();

    const navegarAlMapa = () => {
      router.push("/mapa");
    };

    const cierres = [
    {
      titulo: "Avenida Oquendo",
      lugar: "Centro",
      descripcion: "Cierre por obras",
      horaInicio: "2:15 PM",
      estimado: "1–2 hours",
      categoriaAlerta: "exito",
      categoriaNivel: "BAJO",
    },
    {
      titulo: "Calle Tarija",
      lugar: "delfines",
      descripcion: "pintado de casetas",
      horaInicio: "6:15 PM",
      estimado: "1–2 hours",
      categoriaAlerta: "peligro",
      categoriaNivel: "ALTO",
    },
    {
      titulo: "Avenida Circunvalacion",
      lugar: "casa comunal",
      descripcion: "Cierre por cañerias",
      horaInicio: "6:15 PM",
      estimado: "1–2 hours",
      categoriaAlerta: "peligro",
      categoriaNivel: "ALTO",
    },
  ] as const; 

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.content}>
        {cierres.map((cierre, index) => (
          <CierreAct
            key={index}
            titulo={cierre.titulo}
            lugar={cierre.lugar}
            descripcion={cierre.descripcion}
            horaInicio={cierre.horaInicio}
            estimado={cierre.estimado}
            categoriaAlerta={cierre.categoriaAlerta}
            categoriaNivel={cierre.categoriaNivel}
            style={styles.card}
          />
        ))}
      </ScrollView>
      <MenuInf
        homeIcon={<Ionicons name="home-outline" size={28} color="#146BF6" />}
        mapIcon={<Ionicons name="map-outline" size={28} color="#146BF6" />}
        onHomePress={() => console.log("Home pressed")}
        onMapPress={navegarAlMapa}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  content: {
    paddingVertical: 20,
    paddingBottom: 90, 
  },
  card: {
    marginBottom: 12,
  },
});

export default memo(Principal);
