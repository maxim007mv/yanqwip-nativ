import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useUIStore } from '@/store/uiStore';
import { Colors, Shadows, BorderRadius } from '@/lib/theme';

interface GlassCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  intensity?: number;
  borderRadius?: keyof typeof BorderRadius;
  shadow?: keyof typeof Shadows;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  style,
  intensity = 20,
  borderRadius = 'xl',
  shadow = 'glass',
}) => {
  const { theme } = useUIStore();
  const isDark = theme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;
  const radiusValue = BorderRadius[borderRadius];

  return (
    <View
      style={[
        styles.container,
        {
          borderRadius: radiusValue,
          borderColor: colors.glassBorder,
          backgroundColor: colors.glassBg,
        },
        Shadows[shadow],
        style,
      ]}
    >
      {Platform.OS === 'ios' ? (
        <BlurView
          intensity={intensity}
          tint={isDark ? 'dark' : 'light'}
          style={[StyleSheet.absoluteFill, { borderRadius: radiusValue }]}
        />
      ) : (
        <LinearGradient
          colors={
            isDark
              ? ['rgba(255, 255, 255, 0.12)', 'rgba(255, 255, 255, 0.04)']
              : ['rgba(255, 255, 255, 0.95)', 'rgba(245, 246, 248, 0.9)']
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[StyleSheet.absoluteFill, { borderRadius: radiusValue }]}
        />
      )}

      <LinearGradient
        colors={
          isDark
            ? ['rgba(255, 255, 255, 0.16)', 'rgba(255, 255, 255, 0.02)']
            : ['rgba(255, 255, 255, 0.55)', 'rgba(255, 255, 255, 0.15)']
        }
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={[StyleSheet.absoluteFill, { borderRadius: radiusValue, opacity: 0.9 }]}
        pointerEvents="none"
      />

      <View
        pointerEvents="none"
        style={[
          styles.innerHighlight,
          {
            borderRadius: radiusValue,
            borderColor: colors.glassHighlight,
          },
        ]}
      />
      <View
        style={[
          styles.content,
          { borderRadius: Math.max(radiusValue - 2, 0) },
        ]}
      >
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  content: {
    flex: 1,
    padding: 0,
  },
  innerHighlight: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
    opacity: 0.4,
  },
});
