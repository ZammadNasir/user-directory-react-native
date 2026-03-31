/* eslint-disable react-native/no-inline-styles */

import React from 'react';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import type { AppColors } from '../theme/palette';

interface AppButtonProps {
  title: string;
  onPress: () => void;
  colors: AppColors;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  style?: ViewStyle;
}

export function AppButton({
  title,
  onPress,
  colors,
  variant = 'primary',
  disabled = false,
  style,
}: AppButtonProps) {
  const isSecondary = variant === 'secondary';
  const isDanger = variant === 'danger';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: isSecondary
            ? 'transparent'
            : isDanger
            ? colors.danger
            : colors.primary,
          borderColor: isSecondary ? colors.border : 'transparent',
          opacity: disabled ? 0.6 : pressed ? 0.85 : 1,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.label,
          {
            color: isSecondary ? colors.text : '#FFFFFF',
          },
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
  },
});
