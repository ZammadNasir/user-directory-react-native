import type { RouteProp } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useMemo, useRef } from 'react';
import {
  Alert,
  Animated,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { AppButton } from '../components/AppButton';
import { useAppTheme } from '../hooks/useAppTheme';
import type { RootStackParamList } from '../navigation/types';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setFavoriteNote, toggleFavorite } from '../store/usersSlice';
import type { User } from '../types/user';

type ProfileScreenProps = NativeStackScreenProps<RootStackParamList, 'Profile'>;

type ProfileRoute = RouteProp<RootStackParamList, 'Profile'>;

function getResolvedUser(route: ProfileRoute, items: User[]) {
  return (
    route.params.user ?? items.find(item => item.id === route.params.userId)
  );
}

export default function ProfileScreen({ route }: ProfileScreenProps) {
  const dispatch = useAppDispatch();
  const { colors } = useAppTheme();
  const { items, favoriteIds, favoriteNotes } = useAppSelector(
    state => state.users,
  );
  const scale = useRef(new Animated.Value(1)).current;

  const user = useMemo(() => getResolvedUser(route, items), [items, route]);
  const isFavorite = user ? favoriteIds.includes(user.id) : false;
  const note = user ? favoriteNotes[user.id] ?? '' : '';

  useEffect(() => {
    Animated.spring(scale, {
      toValue: isFavorite ? 1.06 : 1,
      friction: 6,
      useNativeDriver: true,
    }).start();
  }, [isFavorite, scale]);

  const openExternal = async (url: string, fallbackMessage: string) => {
    if (await Linking.canOpenURL(url)) {
      Linking.openURL(url);
      return;
    }

    Alert.alert('Unavailable', fallbackMessage);
  };

  if (!user) {
    return (
      <View
        style={[styles.missingWrap, { backgroundColor: colors.background }]}
      >
        <Text style={[styles.missingTitle, { color: colors.text }]}>
          User not found
        </Text>
        <Text style={[styles.missingText, { color: colors.textMuted }]}>
          This profile is unavailable right now.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <View
        style={[
          styles.heroCard,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <Image
          source={{ uri: `https://i.pravatar.cc/150?u=${user.email}` }}
          style={styles.avatar}
        />
        <Text style={[styles.name, { color: colors.text }]}>{user.name}</Text>
        <Text style={[styles.meta, { color: colors.textMuted }]}>
          @{user.username} • {user.company.name}
        </Text>

        <Animated.View style={{ transform: [{ scale }] }}>
          <AppButton
            title={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
            onPress={() => dispatch(toggleFavorite(user.id))}
            colors={colors}
            style={styles.favoriteButton}
          />
        </Animated.View>
      </View>

      <View
        style={[
          styles.section,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Contact
        </Text>
        <Text style={[styles.detailLabel, { color: colors.textMuted }]}>
          Email
        </Text>
        <Text
          style={[styles.linkText, { color: colors.primary }]}
          onPress={() =>
            openExternal(`mailto:${user.email}`, 'No mail app is configured.')
          }
        >
          {user.email}
        </Text>
        <Text style={[styles.detailLabel, { color: colors.textMuted }]}>
          Phone
        </Text>
        <Text
          style={[styles.linkText, { color: colors.primary }]}
          onPress={() =>
            openExternal(
              `tel:${user.phone}`,
              'Calling is not available on this device.',
            )
          }
        >
          {user.phone}
        </Text>
        <Text style={[styles.detailLabel, { color: colors.textMuted }]}>
          Website
        </Text>
        <Text
          style={[styles.linkText, { color: colors.primary }]}
          onPress={() =>
            openExternal(
              `https://${user.website}`,
              'No browser is available on this device.',
            )
          }
        >
          {user.website}
        </Text>
      </View>

      <View
        style={[
          styles.section,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Address
        </Text>
        <Text style={[styles.detailText, { color: colors.text }]}>
          {user.address.street}, {user.address.suite}
        </Text>
        <Text style={[styles.detailText, { color: colors.text }]}>
          {user.address.city}, {user.address.zipcode}
        </Text>
        <Text style={[styles.detailMuted, { color: colors.textMuted }]}>
          Geo: {user.address.geo.lat}, {user.address.geo.lng}
        </Text>
      </View>

      <View
        style={[
          styles.section,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Company
        </Text>
        <Text style={[styles.detailText, { color: colors.text }]}>
          {user.company.name}
        </Text>
        <Text style={[styles.detailMuted, { color: colors.textMuted }]}>
          {user.company.catchPhrase}
        </Text>
        <Text style={[styles.detailMuted, { color: colors.textMuted }]}>
          {user.company.bs}
        </Text>
      </View>

      <View
        style={[
          styles.section,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Favorite note
        </Text>
        <TextInput
          value={note}
          onChangeText={text =>
            dispatch(setFavoriteNote({ userId: user.id, note: text }))
          }
          editable={isFavorite}
          multiline
          placeholder={
            isFavorite
              ? 'Add a quick note about this contact'
              : 'Add to favorites to save a note'
          }
          placeholderTextColor={colors.textMuted}
          style={[
            styles.noteInput,
            {
              backgroundColor: colors.inputBackground,
              borderColor: colors.border,
              color: colors.text,
            },
          ]}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 55,
  },
  heroCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
    marginBottom: 14,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
  },
  name: {
    fontSize: 24,
    fontWeight: '800',
    marginTop: 12,
  },
  meta: {
    fontSize: 14,
    marginTop: 6,
  },
  favoriteButton: {
    marginTop: 16,
    minWidth: 220,
  },
  section: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    marginTop: 8,
    marginBottom: 4,
    letterSpacing: 0.6,
  },
  linkText: {
    fontSize: 15,
    fontWeight: '600',
  },
  detailText: {
    fontSize: 15,
    lineHeight: 22,
  },
  detailMuted: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
  },
  noteInput: {
    minHeight: 110,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    textAlignVertical: 'top',
    fontSize: 14,
  },
  missingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  missingTitle: {
    fontSize: 22,
    fontWeight: '800',
  },
  missingText: {
    marginTop: 8,
    fontSize: 14,
  },
});
