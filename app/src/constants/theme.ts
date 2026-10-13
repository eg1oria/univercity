/**
 * Tokens of the «Студенческий портал» design system: one accent colour (`brand`),
 * neutral surfaces separated by thin borders, Golos Text, a 4px grid.
 */

import '@/global.css';

import type { TextStyle } from 'react-native';

export const Colors = {
  light: {
    brand: '#1e5bc6',
    brandHover: '#174a9f',
    onBrand: '#ffffff',
    sky: '#3aa9ec',
    brandTint: '#e8f1fd',
    brandTintInk: '#174a9f',
    surface: '#f5f7fb',
    surfaceRaised: '#ffffff',
    surfaceSunken: '#eaeff6',
    border: '#d6deea',
    borderStrong: '#7d8aa1',
    ink: '#0f1a2e',
    inkMuted: '#566379',
    success: '#18794e',
    warning: '#a15c00',
    danger: '#c2323a',
  },
  dark: {
    brand: '#5c9cf2',
    brandHover: '#82b5f6',
    onBrand: '#0a1222',
    sky: '#5cc2f7',
    brandTint: '#16294a',
    brandTintInk: '#a9cbfa',
    surface: '#0d1320',
    surfaceRaised: '#151d2c',
    surfaceSunken: '#0a0f19',
    border: '#2a3650',
    borderStrong: '#5d6d8c',
    ink: '#e9eef7',
    inkMuted: '#9aa8bf',
    success: '#4cc38a',
    warning: '#f0b64e',
    danger: '#f27b7b',
  },
} as const;

export type Scheme = keyof typeof Colors;
export type ThemeColor = keyof typeof Colors.light;
export type Theme = Record<ThemeColor, string>;

/** Golos Text ships one file per weight, so the weight lives in the family name. */
export const Fonts = {
  regular: 'GolosText_400Regular',
  semibold: 'GolosText_600SemiBold',
  bold: 'GolosText_700Bold',
} as const;

export const Type = {
  display: { fontFamily: Fonts.bold, fontSize: 32, lineHeight: 40, letterSpacing: -0.32 },
  title: { fontFamily: Fonts.semibold, fontSize: 22, lineHeight: 28 },
  heading: { fontFamily: Fonts.semibold, fontSize: 17, lineHeight: 24 },
  body: { fontFamily: Fonts.regular, fontSize: 15, lineHeight: 22 },
  bodyStrong: { fontFamily: Fonts.semibold, fontSize: 15, lineHeight: 22 },
  caption: { fontFamily: Fonts.regular, fontSize: 13, lineHeight: 18 },
  label: { fontFamily: Fonts.semibold, fontSize: 12, lineHeight: 16, letterSpacing: 0.24 },
} as const satisfies Record<string, TextStyle>;

export type TypeVariant = keyof typeof Type;

export const Spacing = {
  s1: 4,
  s2: 8,
  s3: 12,
  s4: 16,
  s6: 24,
  s8: 32,
} as const;

export const Radius = {
  sm: 6,
  md: 10,
  lg: 16,
  pill: 999,
} as const;

export const MaxContentWidth = 560;
