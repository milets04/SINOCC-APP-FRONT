import React, { memo } from "react";
import { AccessibilityProps, GestureResponderEvent, Pressable, StyleProp, StyleSheet, View, ViewStyle } from "react-native";

export type MarcadorMapaProps = {
    size?: number;
    color?: string;
    style?: StyleProp<ViewStyle>;
    onPress?: (e: GestureResponderEvent) => void;
    disabled?: boolean;
} & AccessibilityProps;

const MarcadorMapa = ({
    size = 48,
    color = "#068EF7",
    style,
    onPress,
    disabled,
    accessibilityLabel = "Marcador de ubicación",
    accessibilityRole = "button",
    ...a11y
}: MarcadorMapaProps) => {
    const pin = {
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        transform: [{ rotate: "45deg" }],
    }as ViewStyle;

    const Core = (
        <View style={[styles.container, { width: size, height: size }, style]}>
            <View style={[styles.pin, pin]} />
        </View>  
    );

    if (onPress){
        return (
            <Pressable
                style={[styles.container, { width: size, height: size}, style]}
                onPress={onPress}
                disabled={disabled}
                accessibilityLabel={accessibilityLabel}
                accessibilityRole={accessibilityRole}
                {...a11y}
            >
                {Core}
            </Pressable>
        );
    }

    return Core;
};

const styles = StyleSheet.create({
    container: { position: "relative", alignItems: "center", justifyContent: "center"},
    pin: { alignItems: "center", justifyContent: "center"},
});

export default memo(MarcadorMapa);
