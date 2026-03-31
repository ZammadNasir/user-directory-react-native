import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ThemeMode = 'system' | 'light' | 'dark';

export interface SettingsState {
  themeMode: ThemeMode;
}

const initialState: SettingsState = {
  themeMode: 'system',
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setThemeMode(state, action: PayloadAction<ThemeMode>) {
      state.themeMode = action.payload;
    },
    toggleTheme(state) {
      state.themeMode = state.themeMode === 'dark' ? 'light' : 'dark';
    },
    resetSettings() {
      return initialState;
    },
  },
});

export const { resetSettings, setThemeMode, toggleTheme } =
  settingsSlice.actions;
export default settingsSlice.reducer;
