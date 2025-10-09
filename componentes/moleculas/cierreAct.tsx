import IconoAlerta from "@/componentes/atomos/alerta";
import CategoriaCierre from "@/componentes/atomos/categoriaCierre";
import DescripcionNoti from "@/componentes/atomos/descripcionNotificacion";
import Icono from "@/componentes/atomos/icons";
import React, { memo } from "react";
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from "react-native";

type CategoriaAlerta = "peligro" | "exito" | "advertencia";
type CategoriaNivel = "BAJO" | "MEDIO" | "ALTO";

export type CierreActProps = {
  titulo: string; //Al lado de la advertencia
  lugar: string;                  
  descripcion: string;
  horaInicio: string; //Al lado del reloj
  estimado: string;//Al frente del reloj
  categoriaAlerta: CategoriaAlerta;
  categoriaNivel: CategoriaNivel;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
};

const CierreAct = ({
  titulo,
  lugar,
  descripcion,
  horaInicio,
  estimado,
  categoriaAlerta,
  categoriaNivel,
  style,
  onPress,
}: CierreActProps) => {
  const Container = onPress ? Pressable : View;

  return (
    <Container style={[styles.card, style]} {...(onPress ? { onPress } : undefined)}>
      <View style={styles.leftAccent} />
      <View style={styles.content}>
        <View style={styles.rowTop}>
          <IconoAlerta categoria={categoriaAlerta} estilo={{ marginRight: 6 }} />
          <DescripcionNoti texto={titulo} estilo={{ fontSize: 14, fontWeight: "700", marginRight: "auto" }}
          />
          <CategoriaCierre categoria={categoriaNivel} />
        </View>
        <View style={styles.row}>
          <Icono icon="location" library="evil" size={20} color="#6B7280" />
          <DescripcionNoti texto={lugar} estilo={styles.muted} />
        </View>
        <View style={styles.descriptionRow}>
          <DescripcionNoti texto={descripcion} estilo={{ fontSize: 12 }} />
        </View>
        <View style={styles.rowBottom}>
          <View style={styles.startGroup}>
            <Icono icon="clock" library="evil" size={20} color="#6B7280" />
            <DescripcionNoti texto={`Started: ${horaInicio}`} estilo={styles.muted} />
          </View>
          <DescripcionNoti texto={`Est. ${estimado}`} estilo={styles.muted} />
        </View>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  card: {
    position: "relative",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    paddingLeft: 18,
    elevation: 3,
    flexDirection: "row",
    overflow: "hidden",
  },
  leftAccent: {
    position: "absolute",
    left: 6,
    top: 6,
    bottom: 6,
    width: 3.5,
    borderRadius: 999,
    backgroundColor: "#3B82F6", 
  },
  content: {
    flex: 1,
    gap: 4,
  },
  rowTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingLeft: 3,
  },
  descriptionRow:{
    flexDirection: "row",
    alignItems: "flex-start",
    paddingLeft: 27,
    marginVertical: 4,
  },
  rowBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 3,
  },
  startGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  muted: {
    color: "#374151", 
    fontSize: 11,
  },
});

export default memo(CierreAct);
