import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { AppColors } from '../theme/palette';
import { AppButton } from './AppButton';

interface EmptyStateProps {
  title: string;
  message: string;
  colors: AppColors;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  title,
  message,
  colors,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
    >
      <Text style={[styles.emoji, { color: colors.text }]}>📭</Text>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.message, { color: colors.textMuted }]}>
        {message}
      </Text>
      {actionLabel && onAction ? (
        <AppButton
          title={actionLabel}
          onPress={onAction}
          colors={colors}
          style={styles.button}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    alignItems: 'center',
  },
  emoji: {
    fontSize: 28,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  message: {
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  button: {
    marginTop: 16,
    alignSelf: 'stretch',
  },
});
