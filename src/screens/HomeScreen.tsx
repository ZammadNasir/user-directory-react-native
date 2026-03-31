/* eslint-disable react-native/no-inline-styles */

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Linking,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppButton } from '../components/AppButton';
import { EmptyState } from '../components/EmptyState';
import { SearchBar } from '../components/SearchBar';
import { SkeletonList } from '../components/SkeletonList';
import { UserCard } from '../components/UserCard';
import { useAppTheme } from '../hooks/useAppTheme';
import { useDebounce } from '../hooks/useDebounce';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { logout } from '../store/authSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { persistor } from '../store';
import { resetSettings } from '../store/settingsSlice';
import { clearUsersState, fetchUsers } from '../store/usersSlice';
import type { RootStackParamList } from '../navigation/types';
import type { User } from '../types/user';

const ITEM_HEIGHT = 122;

export default function HomeScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const { colors, themeMode, toggleTheme } = useAppTheme();
  const { isOnline, isSlow } = useNetworkStatus();
  const authEmail = useAppSelector(state => state.auth.userEmail);
  const { items, status, error, hasMore, page, favoriteIds, lastFetched } =
    useAppSelector(state => state.users);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 250);

  useEffect(() => {
    if (!items.length && status === 'idle') {
      dispatch(fetchUsers({ page: 1, refresh: true }));
    }
  }, [dispatch, items.length, status]);

  const filteredUsers = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();

    if (!query) {
      return items;
    }

    return items.filter(user => {
      const haystack = [
        user.name,
        user.email,
        user.company.name,
        user.address.city,
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [debouncedSearch, items]);

  const handleRetry = useCallback(() => {
    if (!isOnline) {
      Alert.alert('Offline', 'Reconnect to refresh the directory.');
      return;
    }

    dispatch(fetchUsers({ page: 1, refresh: true }));
  }, [dispatch, isOnline]);

  const handleRefresh = useCallback(() => {
    handleRetry();
  }, [handleRetry]);

  const handleLoadMore = useCallback(() => {
    if (
      !isOnline ||
      !hasMore ||
      status === 'loading' ||
      status === 'refreshing'
    ) {
      return;
    }

    dispatch(fetchUsers({ page: page + 1 }));
  }, [dispatch, hasMore, isOnline, page, status]);

  const handleOpenProfile = useCallback(
    (user: User) => {
      navigation.navigate('Profile', { user, userId: user.id });
    },
    [navigation],
  );

  const handleEmailPress = useCallback(async (email: string) => {
    const url = `mailto:${email}`;

    Linking.openURL(url);
  }, []);

  const handleLogout = useCallback(() => {
    Alert.alert('Logout', 'Clear the saved session and sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          dispatch(logout());
          dispatch(clearUsersState());
          dispatch(resetSettings());
          await persistor.purge();
        },
      },
    ]);
  }, [dispatch]);

  const renderItem = useCallback(
    ({ item }: { item: User }) => (
      <UserCard
        user={item}
        colors={colors}
        onPress={handleOpenProfile}
        onEmailPress={handleEmailPress}
        isFavorite={favoriteIds.includes(item.id)}
      />
    ),
    [colors, favoriteIds, handleEmailPress, handleOpenProfile],
  );

  const footerText =
    status === 'loading' && page > 1
      ? 'Loading more users...'
      : !hasMore && items.length
      ? ''
      : '';

  return (
    <View
      style={[
        styles.screen,
        { backgroundColor: colors.background, paddingTop: insets.top + 14 },
      ]}
    >
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>
            User Directory
          </Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            Signed in as {authEmail ?? 'guest'}
          </Text>
        </View>
        <View style={styles.actionRow}>
          <AppButton
            title={themeMode === 'dark' ? 'Light' : 'Dark'}
            onPress={toggleTheme}
            colors={colors}
            variant="secondary"
            style={styles.smallButton}
          />
          <AppButton
            title="Logout"
            onPress={handleLogout}
            colors={colors}
            variant="danger"
            style={styles.smallButton}
          />
        </View>
      </View>

      <View style={styles.statusRow}>
        <View
          style={[
            styles.badge,
            { backgroundColor: isOnline ? colors.primarySoft : colors.danger },
          ]}
        >
          <Text
            style={[
              styles.badgeText,
              { color: isOnline ? colors.text : '#FFFFFF' },
            ]}
          >
            {isOnline ? 'Online' : 'Offline cache'}
          </Text>
        </View>
        {isSlow ? (
          <View style={[styles.badge, { backgroundColor: colors.warning }]}>
            <Text style={[styles.badgeText, { color: '#111827' }]}>
              Slow connection
            </Text>
          </View>
        ) : null}
        {lastFetched ? (
          <Text style={[styles.timestamp, { color: colors.textMuted }]}>
            Updated {new Date(lastFetched).toLocaleTimeString()}
          </Text>
        ) : null}
      </View>

      <SearchBar value={search} onChangeText={setSearch} colors={colors} />

      {error && items.length ? (
        <View
          style={[
            styles.inlineError,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.inlineErrorText, { color: colors.danger }]}>
            {error}
          </Text>
          <AppButton
            title="Retry"
            onPress={handleRetry}
            colors={colors}
            variant="secondary"
          />
        </View>
      ) : null}

      {status === 'loading' && !items.length ? (
        <SkeletonList colors={colors} count={6} />
      ) : error && !items.length ? (
        <EmptyState
          title="Unable to load users"
          message={
            isOnline
              ? error
              : 'You are offline and there is no cached data yet.'
          }
          actionLabel="Try again"
          onAction={handleRetry}
          colors={colors}
        />
      ) : (
        <FlatList
          data={filteredUsers}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          refreshControl={
            <RefreshControl
              refreshing={status === 'refreshing'}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
            />
          }
          getItemLayout={(_, index) => ({
            length: ITEM_HEIGHT,
            offset: ITEM_HEIGHT * index,
            index,
          })}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.4}
          keyboardShouldPersistTaps="handled"
          initialNumToRender={8}
          windowSize={7}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <EmptyState
              title="No matches found"
              message="Try a different name, company, city, or email."
              colors={colors}
            />
          }
          ListFooterComponent={
            footerText ? (
              <Text style={[styles.footerText, { color: colors.textMuted }]}>
                {footerText}
              </Text>
            ) : null
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
    marginLeft: 12,
  },
  smallButton: {
    minHeight: 38,
    paddingHorizontal: 12,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 12,
    gap: 8,
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  timestamp: {
    fontSize: 12,
  },
  inlineError: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    gap: 10,
  },
  inlineErrorText: {
    fontSize: 13,
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 24,
  },
  footerText: {
    textAlign: 'center',
    fontSize: 12,
    paddingVertical: 8,
  },
});
