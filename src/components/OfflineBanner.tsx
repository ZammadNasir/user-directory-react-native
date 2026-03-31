import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '../hooks/useAppTheme';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

export function OfflineBanner() {
  const { top } = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const { isOnline } = useNetworkStatus();
  const previousStatus = useRef(true);
  const translateY = useRef(new Animated.Value(-90)).current;
  const [message, setMessage] = useState('');
  const [backgroundColor, setBackgroundColor] = useState(colors.danger);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setVisible(true);
      setMessage('You are offline – showing cached data');
      setBackgroundColor(colors.danger);
      Animated.timing(translateY, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }).start();
    } else if (!previousStatus.current) {
      setVisible(true);
      setMessage('Back online!');
      setBackgroundColor(colors.success);
      Animated.timing(translateY, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => {
          Animated.timing(translateY, {
            toValue: -90,
            duration: 220,
            useNativeDriver: true,
          }).start(() => setVisible(false));
        }, 1500);
      });
    }

    previousStatus.current = isOnline;
  }, [colors.danger, colors.success, isOnline, translateY]);

  if (!visible) {
    return null;
  }

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.banner,
        {
          backgroundColor,
          paddingTop: top + 10,
          transform: [{ translateY }],
        },
      ]}
    >
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    paddingBottom: 10,
    paddingHorizontal: 16,
  },
  message: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 13,
  },
});
