import { EvilIcons, Feather, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import React, { memo } from "react";
import { AccessibilityProps, Pressable, StyleProp, StyleSheet, View, ViewStyle, } from "react-native";

type IconLibrary = "feather" | "materialCommunity" | "evil" | "material";
type HeaderIconName = "bell" | "settings" | "pencil-outline" | "location" | "cancel";
/*pencil-outline --- library = "materialCommunity"
location --- library = "evil"
cancel --- library = "material" 
Si no es ni bell ni settings, ejm: <BotonHeader icon="cancel" library="material"/>*/
export type BotonHeaderProps = {
  icon?: HeaderIconName;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
  library?: IconLibrary;
  onPress?: () => void;
  disabled?: boolean;
} & AccessibilityProps;

const BotonHeader = ({
  icon = "bell",
  size = 24,
  color = "#28343D",
  style,
  library = "feather",
  onPress,
  disabled,
  accessibilityLabel,
  accessibilityRole = "button",
  ...a11y
}: BotonHeaderProps) => {
  const renderIcon = () => {
    switch (library) {
      case "materialCommunity":
        return (
          <MaterialCommunityIcons name={icon as any} size={size} color={color} />
        );
      case "evil":
        return <EvilIcons name={icon as any} size={size} color={color} />;
      case "material":
        return <MaterialIcons name={icon as any} size={size} color={color} />;
      case "feather":
      default:
        return <Feather name={icon as any} size={size} color={color} />;
    }
  };

  const content = renderIcon();

  if (!onPress || disabled) {
    return (
      <View
        style={[styles.container, style]}
        accessibilityLabel={accessibilityLabel ?? `Botón de ${icon}`}
        accessibilityRole="imagebutton"
        {...a11y}
      >
        {content}
      </View>
    );
  }

  return (
    <Pressable
      style={[styles.container, style]}
      onPress={onPress}
      disabled={disabled}
      hitSlop={12}
      accessibilityLabel={accessibilityLabel ?? `Botón de ${icon}`}
      accessibilityRole={accessibilityRole}
      {...a11y}
    >
      {content}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    width: 35,
    height: 30,
  },
});
export default memo(BotonHeader);