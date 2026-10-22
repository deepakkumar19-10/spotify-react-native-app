import { StyleSheet, Platform } from 'react-native';
import colors from './colors';

const baseFont = Platform.select({
  ios: 'System',
  android: 'Roboto',
  default: 'System',
});

export const typography = StyleSheet.create({
  // Stitch MCP: Sonic Obsidian Spec
  display: {
    fontFamily: baseFont,
    fontSize: 32,
    fontWeight: '800',
    lineHeight: 38,
    color: colors.textPrimary,
    letterSpacing: -0.6,
  },
  headlineLarge: {
    fontFamily: baseFont,
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 30,
    color: colors.textPrimary,
    letterSpacing: -0.4,
  },
  headlineMedium: {
    fontFamily: baseFont,
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 26,
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  headlineSmall: {
    fontFamily: baseFont,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
    color: colors.textPrimary,
    letterSpacing: -0.2,
  },
  titleMedium: {
    fontFamily: baseFont,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 18,
    color: colors.textPrimary,
  },
  bodyLarge: {
    fontFamily: baseFont,
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 22,
    color: colors.textPrimary,
  },
  bodyMedium: {
    fontFamily: baseFont,
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 18,
    color: colors.textPrimary,
  },
  bodySmall: {
    fontFamily: baseFont,
    fontSize: 11,
    fontWeight: '400',
    lineHeight: 15,
    color: colors.textSecondary,
    letterSpacing: 0.1,
  },
  labelLarge: {
    fontFamily: baseFont,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 16,
    color: colors.textPrimary,
    letterSpacing: 0.2,
  },
  labelMedium: {
    fontFamily: baseFont,
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 14,
    color: colors.textSecondary,
    letterSpacing: 0.25,
  },
  labelSmall: {
    fontFamily: baseFont,
    fontSize: 10,
    fontWeight: '500',
    lineHeight: 12,
    color: colors.textMuted,
    letterSpacing: 0.3,
  },

  // Backwards compatibility aliases
  h1: {
    fontFamily: baseFont,
    fontSize: 28,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  h2: {
    fontFamily: baseFont,
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  h3: {
    fontFamily: baseFont,
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  h4: {
    fontFamily: baseFont,
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subtitle: {
    fontFamily: baseFont,
    fontSize: 13,
    fontWeight: '400',
    color: colors.textSecondary,
  },
  caption: {
    fontFamily: baseFont,
    fontSize: 11,
    fontWeight: '400',
    color: colors.textMuted,
  },
  overline: {
    fontFamily: baseFont,
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    color: colors.textMuted,
    letterSpacing: 1,
  },
});

export default typography;
