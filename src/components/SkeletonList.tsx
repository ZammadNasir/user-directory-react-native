import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import type { AppColors } from '../theme/palette';

interface SkeletonListProps {
  colors: AppColors;
  count?: number;
}

export function SkeletonList({ colors, count = 5 }: SkeletonListProps) {
  const opacity = useRef(new Animated.Value(0.45)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.45,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <View>
      {Array.from({ length: count }).map((_, index) => (
        <Animated.View
          key={index}
          style={[
            styles.card,
            {
              opacity,
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <View
            style={[styles.avatar, { backgroundColor: colors.primarySoft }]}
          />
          <View style={styles.textWrap}>
            <View
              style={[
                styles.lineLarge,
                { backgroundColor: colors.primarySoft },
              ]}
            />
            <View
              style={[
                styles.lineMedium,
                { backgroundColor: colors.primarySoft },
              ]}
            />
            <View
              style={[
                styles.lineSmall,
                { backgroundColor: colors.primarySoft },
              ]}
            />
          </View>
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  textWrap: {
    flex: 1,
    marginLeft: 12,
  },
  lineLarge: {
    height: 14,
    borderRadius: 7,
    width: '65%',
    marginBottom: 10,
  },
  lineMedium: {
    height: 12,
    borderRadius: 6,
    width: '48%',
    marginBottom: 8,
  },
  lineSmall: {
    height: 12,
    borderRadius: 6,
    width: '38%',
  },
});
