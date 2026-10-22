import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useDispatch } from 'react-redux';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import Icon from '../../components/common/Icon';
import { loginUser, demoLogin } from '../../redux/slices/authSlice';
import { showToast } from '../../redux/slices/uiSlice';

export default function SingleAuthScreen() {
  const dispatch = useDispatch();

  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [name, setName] = useState('Spotify Listener');
  const [email, setEmail] = useState('demo@spotify.com');
  const [password, setPassword] = useState('spotify123');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const validate = () => {
    if (mode === 'signup' && !name.trim()) {
      setErrorMsg('Please enter your full name');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMsg('Please enter a valid email address');
      return false;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long');
      return false;
    }
    setErrorMsg('');
    return true;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    dispatch(loginUser({ email: email.trim(), name: name.trim() }));
    dispatch(showToast(`Welcome back, ${name || email.split('@')[0]}!`));
  };

  const handleDemoLogin = () => {
    dispatch(demoLogin());
    dispatch(showToast('Logged in as Demo Listener!'));
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Logo & Headline */}
          <View style={styles.header}>
            <View style={styles.logoCircle}>
              <Icon name="musical-notes" size={36} color={colors.spotifyGreen} />
            </View>
            <Text style={styles.title}>Millions of songs.</Text>
            <Text style={styles.titleHighlight}>Free on Spotify.</Text>
          </View>

          {/* Segmented Toggle */}
          <View style={styles.toggleRow}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setMode('login');
                setErrorMsg('');
              }}
              style={[styles.toggleBtn, mode === 'login' && styles.toggleBtnActive]}
            >
              <Text
                style={[
                  styles.toggleText,
                  mode === 'login' && styles.toggleTextActive,
                ]}
              >
                Log In
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setMode('signup');
                setErrorMsg('');
              }}
              style={[styles.toggleBtn, mode === 'signup' && styles.toggleBtnActive]}
            >
              <Text
                style={[
                  styles.toggleText,
                  mode === 'signup' && styles.toggleTextActive,
                ]}
              >
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form Fields */}
          <View style={styles.form}>
            {mode === 'signup' && (
              <View style={styles.inputWrapper}>
                <Icon
                  name="person-outline"
                  size={20}
                  color={colors.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  placeholder="Full name"
                  placeholderTextColor={colors.textMuted}
                  value={name}
                  onChangeText={(val) => {
                    setName(val);
                    setErrorMsg('');
                  }}
                  style={styles.input}
                />
              </View>
            )}

            <View style={styles.inputWrapper}>
              <Icon
                name="mail-outline"
                size={20}
                color={colors.textSecondary}
                style={styles.inputIcon}
              />
              <TextInput
                placeholder="Email address"
                placeholderTextColor={colors.textMuted}
                value={email}
                onChangeText={(val) => {
                  setEmail(val);
                  setErrorMsg('');
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
              />
            </View>

            <View style={styles.inputWrapper}>
              <Icon
                name="lock-closed-outline"
                size={20}
                color={colors.textSecondary}
                style={styles.inputIcon}
              />
              <TextInput
                placeholder="Password (min 6 characters)"
                placeholderTextColor={colors.textMuted}
                value={password}
                onChangeText={(val) => {
                  setPassword(val);
                  setErrorMsg('');
                }}
                secureTextEntry={!showPassword}
                style={styles.input}
              />
              <TouchableOpacity
                hitSlop={spacing.hitSlop}
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeBtn}
              >
                <Icon
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>

            {/* Credentials Helper Badge */}
            <View style={styles.credsBadge}>
              <View style={styles.credsBadgeHeader}>
                <Icon name="key-outline" size={15} color={colors.spotifyGreen} />
                <Text style={styles.credsTitle}>Default Access</Text>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    setEmail('demo@spotify.com');
                    setPassword('spotify123');
                    setErrorMsg('');
                  }}
                  style={styles.autofillPill}
                >
                  <Text style={styles.autofillPillText}>Reset Defaults</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.credsSub}>Email: <Text style={styles.credsHighlight}>demo@spotify.com</Text></Text>
              <Text style={styles.credsSub}>Password: <Text style={styles.credsHighlight}>spotify123</Text></Text>
            </View>

            {/* Error Message */}
            {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

            {/* Submit Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleSubmit}
              style={styles.primaryBtn}
            >
              <Text style={styles.primaryBtnText}>
                {mode === 'login' ? 'Log In' : 'Create Account'}
              </Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.orDivider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Demo 1-tap Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleDemoLogin}
              style={styles.demoBtn}
            >
              <Icon
                name="flash"
                size={18}
                color={colors.spotifyGreen}
                style={{ marginRight: 8 }}
              />
              <Text style={styles.demoBtnText}>Continue with Demo Account</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#1db9541a',
    borderWidth: 1.5,
    borderColor: '#1db95440',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  titleHighlight: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.spotifyGreen,
    textAlign: 'center',
    letterSpacing: -0.5,
    marginTop: 2,
  },
  toggleRow: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 4,
    marginBottom: spacing.xl,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  toggleBtnActive: {
    backgroundColor: colors.elevated,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  toggleTextActive: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  form: {
    width: '100%',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.elevated,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    height: 52,
    marginBottom: spacing.md,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 52,
    fontSize: 14.5,
    color: colors.textPrimary,
  },
  eyeBtn: {
    padding: 6,
  },
  errorText: {
    color: colors.accentRed,
    fontSize: 12.5,
    fontWeight: '600',
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  primaryBtn: {
    backgroundColor: colors.spotifyGreen,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xs,
    shadowColor: colors.spotifyGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryBtnText: {
    color: '#000000',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  orDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.borderLight,
  },
  dividerText: {
    marginHorizontal: spacing.md,
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  credsBadge: {
    backgroundColor: '#181818',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 8,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  credsBadgeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  credsTitle: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 6,
    flex: 1,
  },
  autofillPill: {
    backgroundColor: '#282828',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  autofillPillText: {
    color: colors.spotifyGreen,
    fontSize: 10,
    fontWeight: '700',
  },
  credsSub: {
    color: colors.textSecondary,
    fontSize: 11.5,
    marginTop: 2,
  },
  credsHighlight: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  demoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.borderLight,
    height: 50,
    borderRadius: 25,
  },
  demoBtnText: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
});
