import React, { useEffect, useState, useRef } from 'react';
import { Animated, Text, StyleSheet } from 'react-native';

interface EmojiFeedbackProps {
  emoji: string;
  position: { x: number; y: number };
  duration?: number;
}

const EmojiFeedback: React.FC<EmojiFeedbackProps> = ({
  emoji,
  position,
  duration = 1000,
}) => {
  const [visible, setVisible] = useState(true);
  const floatAnim = useRef(new Animated.Value(0)).current; // 0 to 1

  useEffect(() => {
    Animated.timing(floatAnim, {
      toValue: 1,
      duration,
      useNativeDriver: true,
    }).start(() => {
      setVisible(false);
    });
  }, [duration, floatAnim]);

  if (!visible) return null;

  const translateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -50], // float up 50 pixels
  });

  const scale = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.5], // scale up to 1.5
  });

  const opacity = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0], // fade out
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.emoji,
        {
          left: position.x,
          top: position.y,
          transform: [{ translateY }, { scale }],
          opacity,
        },
      ]}
    >
      <Text style={styles.text}>{emoji}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  emoji: {
    position: 'absolute',
    zIndex: 1000,
  },
  text: {
    fontSize: 24,
  },
});

export default EmojiFeedback;
