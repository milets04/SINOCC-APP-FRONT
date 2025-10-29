import React from 'react';
import { Animated, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';

interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  trackColorActive?: string;
  trackColorInactive?: string;
  thumbColor?: string;
  width?: number;
  height?: number;
  circleSize?: number;
  disabled?: boolean;
  containerStyle?: ViewStyle;
}

const Switch: React.FC<SwitchProps> = ({
  value,
  onValueChange,
  trackColorActive = '#068EF7',
  trackColorInactive = '#000000',
  thumbColor = '#FFFFFF',
  width = 60,
  height = 34,
  circleSize = 26,
  disabled = false,
  containerStyle,
}) => {
  const animatedValue = React.useRef(new Animated.Value(value ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [value]);

  const toggleSwitch = () => {
    if (!disabled) {
      onValueChange(!value);
    }
  };

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [2, width - circleSize - 2],
  });

  const trackColor = value ? trackColorActive : trackColorInactive;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={toggleSwitch}
      disabled={disabled}
      style={[containerStyle]}
    >
      <View
        style={[
          styles.track,
          {
            width: width,
            height: height,
            backgroundColor: trackColor,
            opacity: disabled ? 0.5 : 1,
            borderRadius: height / 2,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.thumb,
            {
              width: circleSize,
              height: circleSize,
              borderRadius: circleSize / 2,
              backgroundColor: thumbColor,
              transform: [{ translateX }],
            },
          ]}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  track: {
    justifyContent: 'center',
  },
  thumb: {
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default Switch;