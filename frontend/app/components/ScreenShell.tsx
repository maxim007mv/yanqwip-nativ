import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useUIStore } from '@/store/uiStore';
import { Colors, Layout, BorderRadius, Spacing, Shadows } from '@/lib/theme';

interface ScreenShellProps {
  children: React.ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  accentAura?: boolean;
}

export const ScreenShell: React.FC<ScreenShellProps> = ({
  children,
  contentStyle,
  style,
  accentAura = true,
}) => {
  const { theme } = useUIStore();
  const isDark = theme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  return (
    <View
      style={[
        styles.shell,
        {
          borderColor: colors.glassBorder,
          backgroundColor: isDark
            ? 'rgba(12, 14, 18, 0.32)'
            : 'rgba(255, 255, 255, 0.78)',
        },
        Shadows.glass,
        style,
      ]}
    >
      <LinearGradient
        colors={
          isDark
            ? ['rgba(10, 12, 18, 0.55)', 'rgba(10, 12, 18, 0.84)']
            : ['rgba(255, 255, 255, 0.85)', 'rgba(245, 245, 247, 0.95)']
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 0.2, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {accentAura ? (
        <LinearGradient
          colors={
            isDark
              ? ['rgba(255, 184, 74, 0.08)', 'transparent']
              : ['rgba(255, 184, 74, 0.25)', 'transparent']
          }
          start={{ x: 0.2, y: 0 }}
          end={{ x: 1, y: 0.9 }}
          style={styles.aura}
          pointerEvents="none"
        />
      ) : null}

      <View style={[styles.content, contentStyle]}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  shell: {
    width: '100%',
    maxWidth: Layout.maxWidth,
    borderWidth: 1,
    borderRadius: BorderRadius.ultra,
    overflow: 'hidden',
  },
  content: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.jumbo,
  },
  aura: {
    position: 'absolute',
    top: -Layout.screenGutter,
    right: -Layout.screenGutter,
    width: Layout.maxWidth,
    height: Layout.maxWidth * 0.8,
    transform: [{ rotate: '8deg' }],
  },
});

