import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import type { AppColors } from '../theme/palette';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  colors: AppColors;
}

export function SearchBar({ value, onChangeText, colors }: SearchBarProps) {
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
      <Text style={[styles.icon, { color: colors.textMuted }]}>🔎</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Search by name, company, city"
        placeholderTextColor={colors.textMuted}
        style={[styles.input, { color: colors.text }]}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
      />
      {value ? (
        <Pressable onPress={() => onChangeText('')}>
          <Text style={[styles.clear, { color: colors.primary }]}>Clear</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 52,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginBottom: 14,
  },
  icon: {
    fontSize: 16,
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 12,
  },
  clear: {
    fontSize: 13,
    fontWeight: '700',
  },
});
