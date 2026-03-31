import { combineReducers, configureStore } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';
import authReducer from './authSlice';
import settingsReducer from './settingsSlice';
import usersReducer from './usersSlice';

const authPersistConfig = {
  key: 'auth',
  storage: AsyncStorage,
  whitelist: [
    'isAuthenticated',
    'userEmail',
    'token',
    'lastLogin',
    'rememberMe',
  ],
};

const usersPersistConfig = {
  key: 'users',
  storage: AsyncStorage,
  whitelist: [
    'items',
    'favoriteIds',
    'favoriteNotes',
    'page',
    'hasMore',
    'lastFetched',
  ],
};

const settingsPersistConfig = {
  key: 'settings',
  storage: AsyncStorage,
  whitelist: ['themeMode'],
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  users: persistReducer(usersPersistConfig, usersReducer),
  settings: persistReducer(settingsPersistConfig, settingsReducer),
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
