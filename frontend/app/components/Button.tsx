import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  StyleProp,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useUIStore } from '@/store/uiStore';
import { Colors, BorderRadius, Typography, Shadows } from '@/lib/theme';

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'accent' | 'glass' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  onPress,
  title,
  variant = 'accent',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
}) => {
  const { theme } = useUIStore();
  const isDark = theme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  const sizeStyles = {
    small: { height: 40, paddingHorizontal: 16 },
    medium: { height: 50, paddingHorizontal: 20 },
    large: { height: 56, paddingHorizontal: 24 },
  };

  const textSizeStyles = {
    small: { fontSize: Typography.caption },
    medium: { fontSize: Typography.body, letterSpacing: 0.1 },
    large: { fontSize: Typography.h5 },
  };

  const renderContent = () => (
    <>
      {loading ? (
        <ActivityIndicator
          color={variant === 'accent' ? '#2B1F05' : colors.text1}
        />
      ) : (
        <Text
          style={[
            styles.text,
            textSizeStyles[size],
            { color: variant === 'accent' ? '#2B1F05' : colors.text1 },
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </>
  );

  if (variant === 'accent') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.85}
        style={[
          styles.accentWrapper,
          sizeStyles[size],
          {
            borderRadius: BorderRadius.lg,
            opacity: disabled ? 0.55 : 1,
          },
          Shadows.medium,
          style,
        ]}
      >
        <LinearGradient
          colors={[colors.accent, colors.accent2]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.button,
            {
              borderRadius: BorderRadius.lg,
            },
          ]}
        >
          <LinearGradient
            colors={['rgba(255,255,255,0.55)', 'transparent']}
            start={{ x: 0.3, y: 0 }}
            end={{ x: 0.8, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.contentRow}>
            {icon ? <View style={styles.icon}>{icon}</View> : null}
            {renderContent()}
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[
        styles.button,
        sizeStyles[size],
        {
          backgroundColor:
            variant === 'glass' ? colors.glassBg : 'transparent',
          borderWidth: variant === 'outline' ? 1 : 0,
          borderColor: colors.glassBorder,
          borderRadius: BorderRadius.lg,
          opacity: disabled ? 0.5 : 1,
        },
        variant === 'glass' && Shadows.small,
        style,
      ]}
    >
      <View style={styles.contentRow}>
        {icon ? <View style={styles.icon}>{icon}</View> : null}
        {renderContent()}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  text: {
    fontWeight: Typography.bold,
    textAlign: 'center',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  accentWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
});
