/* eslint-disable react-native/no-inline-styles */

import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { AppButton } from '../components/AppButton';
import { useAppTheme } from '../hooks/useAppTheme';
import { useLoginForm } from '../hooks/useLoginForm';
import { login } from '../store/authSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';

export default function LoginScreen() {
  const dispatch = useAppDispatch();
  const { colors } = useAppTheme();
  const initialEmail = useAppSelector(state => state.auth.userEmail ?? '');
  const { status, error } = useAppSelector(state => state.auth);
  const {
    email,
    setEmail,
    password,
    setPassword,
    rememberMe,
    setRememberMe,
    errors,
    validate,
  } = useLoginForm(initialEmail);

  const handleSubmit = () => {
    if (!validate()) {
      return;
    }

    dispatch(login({ email, password, rememberMe }));
  };

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <Text style={[styles.title, { color: colors.text }]}>
            Welcome back
          </Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            Sign in to browse the user directory.
          </Text>

          <View style={styles.fieldWrap}>
            <Text style={[styles.label, { color: colors.text }]}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              style={[
                styles.input,
                {
                  backgroundColor: colors.inputBackground,
                  borderColor: errors.email ? colors.danger : colors.border,
                  color: colors.text,
                },
              ]}
            />
            {errors.email ? (
              <Text style={[styles.error, { color: colors.danger }]}>
                {errors.email}
              </Text>
            ) : null}
          </View>

          <View style={styles.fieldWrap}>
            <Text style={[styles.label, { color: colors.text }]}>Password</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Minimum 8 characters"
              placeholderTextColor={colors.textMuted}
              secureTextEntry
              style={[
                styles.input,
                {
                  backgroundColor: colors.inputBackground,
                  borderColor: errors.password ? colors.danger : colors.border,
                  color: colors.text,
                },
              ]}
            />
            {errors.password ? (
              <Text style={[styles.error, { color: colors.danger }]}>
                {errors.password}
              </Text>
            ) : null}
          </View>

          <Pressable
            style={styles.rememberRow}
            onPress={() => setRememberMe(!rememberMe)}
          >
            <View
              style={[
                styles.checkbox,
                {
                  borderColor: rememberMe ? colors.primary : colors.border,
                  backgroundColor: rememberMe ? colors.primary : 'transparent',
                },
              ]}
            >
              {rememberMe ? <Text style={styles.checkmark}>✓</Text> : null}
            </View>
            <Text style={[styles.rememberText, { color: colors.text }]}>
              Remember me
            </Text>
          </Pressable>

          {error ? (
            <Text style={[styles.error, { color: colors.danger }]}>
              {error}
            </Text>
          ) : null}

          <AppButton
            title={status === 'loading' ? 'Signing in...' : 'Login'}
            onPress={handleSubmit}
            colors={colors}
            disabled={status === 'loading'}
            style={styles.submitButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 8,
    marginBottom: 18,
    lineHeight: 20,
  },
  fieldWrap: {
    marginBottom: 14,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  input: {
    minHeight: 50,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 15,
  },
  error: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: '600',
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  rememberText: {
    marginLeft: 10,
    fontSize: 14,
    fontWeight: '600',
  },
  submitButton: {
    marginTop: 10,
  },
  helperBox: {
    marginTop: 14,
    borderRadius: 12,
    padding: 12,
  },
  helperText: {
    fontSize: 13,
    lineHeight: 18,
  },
});
