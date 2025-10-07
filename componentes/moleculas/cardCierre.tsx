import Icono, { BotonHeaderProps } from "@/componentes/atomos/icons";
import Subtitulo from "@/componentes/atomos/subtitulo";
import TituloTarjeta from "@/componentes/atomos/tituloTarjeta";
import React, { memo } from "react";
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from "react-native";

export type CardCierreProps = {
  titulo: string;
  subtitulo: string[]; //descripcion 

  onPress?: () => void;
  onPressEditar?: () => void;
  onPressEliminar?: () => void;

  style?: StyleProp<ViewStyle>;

  leftIconProps?: Omit<BotonHeaderProps, "onPress">; // ícono ubi
  editIconProps?: Omit<BotonHeaderProps, "onPress">; // ícono editar
  deleteIconProps?: Omit<BotonHeaderProps, "onPress">; // ícono cerrar
};

const CardCierre = ({
  titulo,
  subtitulo,
  onPress,
  onPressEditar,
  onPressEliminar,
  style,
  leftIconProps,
  editIconProps,
  deleteIconProps,
}: CardCierreProps) => {
  const Container = onPress ? Pressable : View;
  const containerProps = onPress ? { onPress, android_ripple: { color: "#e5e7eb" } } : {};

  return (
    <Container style={[styles.card, style]} {...containerProps}>
      <View style={styles.leftCol}>
        <Icono
          icon="location"
          library="evil"
          size={24}
          color="#3B82F6"
          {...leftIconProps}
        />
      </View>
      <View style={styles.centerCol}>
        <TituloTarjeta style={styles.titleSpacing}>{titulo}</TituloTarjeta>

        <View style={styles.lines}>
          {subtitulo.map((txt, i) => (
            <Subtitulo key={`${i}-${txt}`} style={i === 0 ? styles.firstLine : undefined}>
              {txt}
            </Subtitulo>
          ))}
        </View>
      </View>
      <View style={styles.rightCol}>
        <Icono
          icon="pencil-outline"
          library="materialCommunity"
          size={18}
          color="#111827"
          style={styles.actionTop}
          onPress={onPressEditar}
          {...editIconProps}
        />

        <Icono
          icon="cancel"
          library="material"
          size={20}
          color="#111827"
          style={styles.actionBottom}
          onPress={onPressEliminar}
          {...deleteIconProps}
        />
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    gap: 10,
    elevation: 3,
  },
  leftCol: {
    width: 28,
    alignItems: "flex-start",
    paddingTop: 2,
  },
  centerCol: {
    flex: 1,
  },
  rightCol: {
    width: 36,
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingVertical: 2,
  },
  titleSpacing: { marginBottom: 6 },
  lines: { gap: 4 },
  firstLine: { marginTop: 2 },
  actionTop: { alignSelf: "flex-end" },
  actionBottom: { alignSelf: "flex-end" },
});

export default memo(CardCierre);
