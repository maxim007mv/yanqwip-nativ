export const Colors = {
  light: {
    accent: '#FFB84A',
    accent2: '#FFC566',
    accentGlow: 'rgba(255, 184, 74, 0.45)',
    accentHighlight: 'rgba(255, 197, 102, 0.35)',

    text1: 'rgba(0, 0, 0, 0.98)',
    text2: 'rgba(0, 0, 0, 0.82)',
    text3: 'rgba(0, 0, 0, 0.60)',

    glassBg: 'rgba(255, 255, 255, 0.88)',
    glassBorder: 'rgba(0, 0, 0, 0.12)',
    glassBgHover: 'rgba(255, 255, 255, 0.95)',
    glassHighlight: 'rgba(255, 255, 255, 0.25)',
    glassShadow: 'rgba(0, 0, 0, 0.35)',

    background: '#F5F5F7',
    backgroundSecondary: '#FFFFFF',
    backgroundBase: '#F1F2F4',
    backgroundGradient: ['rgba(245, 245, 247, 0.82)', '#F5F5F7'],
    auraTop: 'rgba(255, 200, 140, 0.18)',
    auraSide: 'rgba(255, 190, 120, 0.12)',

    success: '#0FD17A',
    error: '#FF453A',
    warning: '#FFB84A',
  },
  dark: {
    accent: '#FFB84A',
    accent2: '#FFC566',
    accentGlow: 'rgba(255, 184, 74, 0.45)',
    accentHighlight: 'rgba(255, 200, 140, 0.28)',

    text1: 'rgba(255, 255, 255, 0.98)',
    text2: 'rgba(255, 255, 255, 0.82)',
    text3: 'rgba(255, 255, 255, 0.60)',

    glassBg: 'rgba(255, 255, 255, 0.12)',
    glassBorder: 'rgba(255, 255, 255, 0.35)',
    glassBgHover: 'rgba(255, 255, 255, 0.18)',
    glassHighlight: 'rgba(255, 255, 255, 0.16)',
    glassShadow: 'rgba(0, 0, 0, 0.55)',

    background: '#0B0D12',
    backgroundSecondary: '#1A1D24',
    backgroundBase: '#0C1016',
    backgroundGradient: ['rgba(26, 15, 12, 0.92)', '#0B1119'],
    auraTop: 'rgba(255, 200, 140, 0.18)',
    auraSide: 'rgba(255, 190, 120, 0.12)',

    success: '#13EF85',
    error: '#FF453A',
    warning: '#FFB84A',
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 28,
  jumbo: 32,
  screenGutter: 22,
  pageTop: 28,
};

export const BorderRadius = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 26,
  xxxl: 28,
  ultra: 32,
  round: 999,
};

export const Typography = {
  fontFamilies: {
    interRegular: 'Inter-Regular',
    interMedium: 'Inter-Medium',
    interSemiBold: 'Inter-SemiBold',
    interBold: 'Inter-Bold',
    interExtraBold: 'Inter-ExtraBold',
    unboundedRegular: 'Unbounded_400Regular',
    unboundedSemiBold: 'Unbounded_600SemiBold',
    unboundedBold: 'Unbounded_700Bold',
  },

  unbounded: 'Unbounded_700Bold',
  unboundedMedium: 'Unbounded_400Regular',
  unboundedSemiBold: 'Unbounded_600SemiBold',
  inter: 'Unbounded_400Regular',
  interMedium: 'Unbounded_400Regular',
  interSemiBold: 'Unbounded_600SemiBold',
  interBold: 'Inter-Bold',
  interExtraBold: 'Inter-ExtraBold',
  
  h1: 38,
  h2: 28,
  h3: 24,
  h4: 20,
  h5: 18,
  body: 16,
  bodySmall: 15,
  caption: 14,
  small: 12,
  tiny: 11,
  
  regular: '400' as const,
  medium: '500' as const,
  semiBold: '600' as const,
  bold: '700' as const,
  extraBold: '800' as const,
};

export const Shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 4,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 18,
    elevation: 8,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.35,
    shadowRadius: 28,
    elevation: 14,
  },
  glass: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.42,
    shadowRadius: 32,
    elevation: 16,
  },
  dock: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.45,
    shadowRadius: 30,
    elevation: 18,
  },
};

export const Layout = {
  maxWidth: 480,
  tabBarHeight: 76,
  headerHeight: 56,
  screenGutter: 22,
  dockOffset: 20,
};
