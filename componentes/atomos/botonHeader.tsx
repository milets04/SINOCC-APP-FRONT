import { Feather } from "@expo/vector-icons";
import React, { memo } from "react";
import { AccessibilityProps, Pressable, StyleProp, StyleSheet, View, ViewStyle } from "react-native";

type HeaderIconName = "bell" | "settings";

export type BotonHeaderProps = {
    icon?: HeaderIconName;
    size?: number;
    color?: string;
    style?: StyleProp<ViewStyle>;
    onPress?: () => void;
    disabled?: boolean;
} & AccessibilityProps;

const BotonHeader =({
    icon = "bell",
    size = 24,
    color = "#28343D",
    style,
    onPress,
    disabled,
    accessibilityLabel,
    accessibilityRole  = "button",
    ...a11y
}: BotonHeaderProps) => {
   const content =  <Feather name={icon} size={size} color={color} />;

   if (!onPress || disabled){
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
    container: {position: "relative", justifyContent: "center", alignItems: "center"}
});

export default memo(BotonHeader)
   