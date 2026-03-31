import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { useCallback, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { darkColors, lightColors } from '../theme/palette';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { toggleTheme } from '../store/settingsSlice';

export function useAppTheme() {
  const dispatch = useAppDispatch();
  const systemScheme = useColorScheme();
  const themeMode = useAppSelector(state => state.settings.themeMode);
  const resolvedMode =
    themeMode === 'system' ? systemScheme ?? 'light' : themeMode;
  const isDark = resolvedMode === 'dark';
  const colors = isDark ? darkColors : lightColors;

  const navigationTheme = useMemo(() => {
    const baseTheme = isDark ? DarkTheme : DefaultTheme;

    return {
      ...baseTheme,
      colors: {
        ...baseTheme.colors,
        background: colors.background,
        card: colors.surface,
        border: colors.border,
        primary: colors.primary,
        text: colors.text,
        notification: colors.primary,
      },
    };
  }, [colors, isDark]);

  const onToggleTheme = useCallback(() => {
    dispatch(toggleTheme());
  }, [dispatch]);

  return {
    colors,
    isDark,
    navigationTheme,
    themeMode,
    toggleTheme: onToggleTheme,
  };
}
