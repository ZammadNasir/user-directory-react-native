import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useMemo } from 'react';
import { FlatList, Linking, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EmptyState } from '../components/EmptyState';
import { UserCard } from '../components/UserCard';
import { useAppTheme } from '../hooks/useAppTheme';
import type { RootStackParamList } from '../navigation/types';
import { useAppSelector } from '../store/hooks';
import type { User } from '../types/user';

export default function FavoritesScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const { items, favoriteIds, favoriteNotes } = useAppSelector(
    state => state.users,
  );

  const favoriteUsers = useMemo(
    () => items.filter(user => favoriteIds.includes(user.id)),
    [favoriteIds, items],
  );

  const handleOpenProfile = useCallback(
    (user: User) => {
      navigation.navigate('Profile', { user, userId: user.id });
    },
    [navigation],
  );

  const handleEmailPress = useCallback((email: string) => {
    Linking.openURL(`mailto:${email}`);
  }, []);

  return (
    <View
      style={[
        styles.screen,
        { backgroundColor: colors.background, paddingTop: insets.top + 14 },
      ]}
    >
      <Text style={[styles.title, { color: colors.text }]}>Favorites</Text>
      <Text style={[styles.subtitle, { color: colors.textMuted }]}>
        Saved contacts and notes stay available offline.
      </Text>

      <FlatList
        data={favoriteUsers}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <UserCard
            user={item}
            colors={colors}
            onPress={handleOpenProfile}
            onEmailPress={handleEmailPress}
            isFavorite
            note={favoriteNotes[item.id]}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState
            title="No favorites yet"
            message="Open any profile and tap the heart to save a contact here."
            colors={colors}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
  },
  subtitle: {
    marginTop: 4,
    marginBottom: 14,
    fontSize: 13,
    lineHeight: 18,
  },
  listContent: {
    paddingBottom: 24,
  },
});
