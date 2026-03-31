import React, { memo } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import type { AppColors } from '../theme/palette';
import type { User } from '../types/user';

interface UserCardProps {
  user: User;
  onPress: (user: User) => void;
  onEmailPress: (email: string) => void;
  colors: AppColors;
  isFavorite?: boolean;
  note?: string;
}

function UserCardComponent({
  user,
  onPress,
  onEmailPress,
  colors,
  isFavorite = false,
  note,
}: UserCardProps) {
  return (
    <Pressable
      onPress={() => onPress(user)}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          opacity: pressed ? 0.92 : 1,
          shadowColor: colors.shadow,
        },
      ]}
    >
      <Image
        source={{ uri: `https://i.pravatar.cc/150?u=${user.email}` }}
        style={styles.avatar}
      />
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
            {user.name}
          </Text>
          {isFavorite ? <Text style={styles.favorite}>♥</Text> : null}
        </View>
        <Text
          style={[styles.company, { color: colors.textMuted }]}
          numberOfLines={1}
        >
          {user.company.name}
        </Text>
        <Pressable onPress={() => onEmailPress(user.email)}>
          <Text
            style={[styles.email, { color: colors.primary }]}
            numberOfLines={1}
          >
            {user.email}
          </Text>
        </Pressable>
        <Text
          style={[styles.city, { color: colors.textMuted }]}
          numberOfLines={1}
        >
          {user.address.city}
        </Text>
        {note ? (
          <Text
            style={[styles.note, { color: colors.textMuted }]}
            numberOfLines={2}
          >
            Note: {note}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

export const UserCard = memo(UserCardComponent);

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    minHeight: 110,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    flex: 1,
    fontSize: 16,
    fontWeight: '800',
  },
  favorite: {
    fontSize: 16,
    color: '#EF4444',
    marginLeft: 8,
  },
  company: {
    marginTop: 4,
    fontSize: 13,
  },
  email: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: '600',
  },
  city: {
    marginTop: 4,
    fontSize: 13,
  },
  note: {
    marginTop: 6,
    fontSize: 12,
    lineHeight: 18,
  },
});
