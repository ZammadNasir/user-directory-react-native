import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { OfflineBanner } from './src/components/OfflineBanner';
import { useAppTheme } from './src/hooks/useAppTheme';
import AppNavigator from './src/navigation/AppNavigator';
import SplashScreen from './src/screens/SplashScreen';
import { logout } from './src/store/authSlice';
import { persistor, store } from './src/store';

function AppShell() {
  const { colors, isDark } = useAppTheme();

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
        translucent={false}
      />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <SafeAreaView
          style={[styles.container, { backgroundColor: colors.background }]}
          edges={['left', 'right']}
        >
          <AppNavigator />
        </SafeAreaView>
        <OfflineBanner />
      </View>
    </SafeAreaProvider>
  );
}

export default function App() {
  const handleBeforeLift = () => {
    const { auth } = store.getState();

    if (auth.isAuthenticated && !auth.rememberMe) {
      store.dispatch(logout());
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <Provider store={store}>
        <PersistGate
          loading={<SplashScreen />}
          persistor={persistor}
          onBeforeLift={handleBeforeLift}
        >
          <AppShell />
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
