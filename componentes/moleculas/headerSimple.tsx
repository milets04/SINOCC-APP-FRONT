import { Href, useRouter } from "expo-router";
import React, { memo } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

const SINOCC_PM = require("../../assets/images/SINOCC_PM.png");

interface HeaderSimpleProps {
  onPressRoute?: Href; 
}

const HeaderSimple: React.FC<HeaderSimpleProps> = ({ onPressRoute = "/" }) => {
  
  const router = useRouter();

  const handlePress = () => {
    router.push(onPressRoute);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        onPress={handlePress} 
        style={styles.leftSection} 
        activeOpacity={0.7} 
      >
        <Image source={SINOCC_PM} style={styles.logo} resizeMode="contain" />
      </TouchableOpacity>
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

export default memo(HeaderSimple);