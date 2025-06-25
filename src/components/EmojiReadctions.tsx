// src/components/EmojiFeedback.tsx
import React, { useEffect, useState, useRef } from 'react';
import { Animated, Text, StyleSheet } from 'react-native';

interface EmojiFeedbackProps {
  emoji: string;
  position: { x: number; y: number };
  duration?: number;
  onAnimationEnd?: () => void;
}

const EmojiFeedback: React.FC<EmojiFeedbackProps> = ({
  emoji,
  position,
  duration = 1000,
  onAnimationEnd,
}) => {
  const [visible, setVisible] = useState(true);
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(floatAnim, {
      toValue: 1,
      duration,
      useNativeDriver: true,
    }).start(() => {
      setVisible(false);
      if (onAnimationEnd) {
        onAnimationEnd();
      }
    });
  }, [duration, floatAnim, onAnimationEnd]);

  if (!visible) return null;

  const translateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -50],
  });

  const scale = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.5],
  });

  const opacity = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
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
