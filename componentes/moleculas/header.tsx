import Icono from "@/componentes/atomos/icons";
import React, { memo } from "react";
import { Image, StyleSheet, View } from "react-native";

const SINOCC_PM = require("../../assets/images/SINOCC_PM.png");

type HeaderProps = {
  onBellPress: () => void;
  onSettingsPress: () => void;
};

const Header: React.FC<HeaderProps> = ({ onBellPress, onSettingsPress }) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <Image source={SINOCC_PM} style={styles.logo} resizeMode="contain" />
      </View>

      <View style={styles.rightSection}>
        <Icono
          icon="bell"
          library="feather"
          size={22}
          color="#28343D"
          onPress={onBellPress}
        />
        <Icono
          icon="settings"
          library="feather"
          size={22}
          color="#28343D"
          onPress={onSettingsPress}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 10,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#146BF6",
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logo: {
    width: 130,
    height: 50,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
});

export default memo(Header);
