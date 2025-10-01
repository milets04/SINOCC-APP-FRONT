import React, { memo } from "react";
import { AccessibilityProps, Pressable, StyleProp, StyleSheet, View, ViewStyle } from "react-native";

export type MarcadorMapaProps = {
  size?: number;
  color?: string;
  borderColor?: string;
  borderWidth?: number;
  centerColor?: string;
  elevated?: boolean;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  disabled?: boolean;
} & AccessibilityProps;

const MarcadorMapa = ({
  size = 48,
  color = "#068EF7",
  borderColor,
  borderWidth = 0,
  centerColor = "rgba(255,255,255,0.85)",
  elevated = true,
  style,
  onPress,
  disabled,
  accessibilityLabel = "Marcador de ubicación",
  accessibilityRole = "button",
  ...a11yProps
}: MarcadorMapaProps) => {
  const circleSize = size;
  const totalHeight = size * 1.3;
  const centerSize = Math.round(size * 0.38);

  const containerStyle: StyleProp<ViewStyle> = [
    styles.container,
    { width: circleSize, height: totalHeight },
    style,
  ];

  const circleStyle: StyleProp<ViewStyle> = [
    styles.circle,
    {
      width: circleSize,
      height: circleSize,
      borderRadius: circleSize / 2,
      backgroundColor: color,
      borderColor,
      borderWidth,
      ...(elevated ? getSom(size) : {}),
    },
  ];

  const centerStyle: StyleProp<ViewStyle> = [
    styles.center,
    {
      width: centerSize,
      height: centerSize,
      borderRadius: centerSize / 2,
      backgroundColor: centerColor,
    },
  ];

  const tipStyle: StyleProp<ViewStyle> = [
    styles.tip,
    {
      borderTopWidth: size * 0.5,
      borderLeftWidth: size * 0.35,
      borderRightWidth: size * 0.35,
      borderTopColor: color,
      borderLeftColor: "transparent",
      borderRightColor: "transparent",
      top: circleSize - Math.round(size * 0.15),
    },
  ];

  const MarkerContent = (
    <View style={containerStyle} pointerEvents="box-none">
      <View style={circleStyle}>
        <View style={centerStyle} />
      </View>
      <View style={tipStyle} />
    </View>
  );

  return onPress && !disabled ? (
    <Pressable
      style={containerStyle}
      onPress={onPress}
      disabled={disabled}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={accessibilityRole}
      {...a11yProps}
    >
      {MarkerContent}
    </Pressable>
  ) : (
    <View
      style={containerStyle}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="image"
      {...a11yProps}
    >
      {MarkerContent}
    </View>
  );
};

function getSom(size: number): ViewStyle {
  const elevation = Math.max(2, Math.round(size * 0.08));
  return {
    elevation,
  };
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    alignItems: "center",
  },
  circle: {
    alignItems: "center",
    justifyContent: "center",
  },
  center: {
    position: "absolute",
  },
  tip: {
    position: "absolute",
    alignSelf: "center",
    width: 0,
    height: 0,
    backgroundColor: "transparent",
  },
});

export default memo(MarcadorMapa);
