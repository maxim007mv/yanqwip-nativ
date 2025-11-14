import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useUIStore } from '@/store/uiStore';
import { Colors, BorderRadius } from '@/lib/theme';

interface GlassContainerProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  borderRadius?: keyof typeof BorderRadius;
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'rounded';
}

export const GlassContainer: React.FC<GlassContainerProps> = ({
  children,
  style,
  borderRadius = 'xl',
  size = 'medium',
  variant = 'default',
}) => {
  const { theme } = useUIStore();
  const isDark = theme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;
  const radiusValue = BorderRadius[borderRadius];

  const sizeStyles = {
    small: { flex: 0, minWidth: 120 },
    medium: { flex: 1 },
    large: { flex: 1 },
  };

  const variantStyles = {
    default: { borderRadius: radiusValue },
    rounded: { borderRadius: BorderRadius.ultra },
  };

  return (
    <View
      style={[
        styles.container,
        sizeStyles[size],
        variantStyles[variant],
        {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.2,
          shadowRadius: 6,
          elevation: 8,
        },
        style,
      ]}
    >
      {/* Основной фильтр размытия */}
      {Platform.OS === 'ios' ? (
        <BlurView
          intensity={20}
          tint={isDark ? 'dark' : 'light'}
          style={[StyleSheet.absoluteFill, { borderRadius: variant === 'rounded' ? BorderRadius.ultra : radiusValue }]}
        />
      ) : (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.25)',
              borderRadius: variant === 'rounded' ? BorderRadius.ultra : radiusValue,
            },
          ]}
        />
      )}

      {/* Оверлей с цветом */}
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.25)',
            borderRadius: variant === 'rounded' ? BorderRadius.ultra : radiusValue,
          },
        ]}
      />

      {/* Спекулярные блики */}
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            borderRadius: variant === 'rounded' ? BorderRadius.ultra : radiusValue,
            shadowColor: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.75)',
            shadowOffset: { width: 1, height: 1 },
            shadowOpacity: 1,
            shadowRadius: 0,
            elevation: 0,
          },
        ]}
      />

      {/* Внутренние блики */}
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            borderRadius: variant === 'rounded' ? BorderRadius.ultra : radiusValue,
            borderWidth: 1,
            borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.75)',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.5,
            shadowRadius: 5,
            shadowColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.3)',
            elevation: 0,
          },
        ]}
      />

      {/* Контент */}
      <View style={[styles.content, { borderRadius: Math.max((variant === 'rounded' ? BorderRadius.ultra : radiusValue) - 2, 0) }]}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  content: {
    position: 'relative',
    zIndex: 10,
    padding: 16,
  },
});