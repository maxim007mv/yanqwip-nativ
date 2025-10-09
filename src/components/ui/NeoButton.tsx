import React from 'react';
import { ActivityIndicator, GestureResponderEvent, StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { COLORS, SHADOWS } from '../../constants/theme';

interface NeoButtonProps {
  title: string;
  onPress?: (event: GestureResponderEvent) => void;
  style?: ViewStyle | ViewStyle[];
  loading?: boolean;
  disabled?: boolean;
  variant?: 'mint' | 'pink' | 'outline';
}

export const NeoButton: React.FC<NeoButtonProps> = ({
  title,
  onPress,
  style,
  loading = false,
  disabled = false,
  variant = 'mint',
}) => {
  const backgroundColor = variant === 'outline' ? 'transparent' : variant === 'mint' ? COLORS.accentMint : COLORS.accentPink;
  const textColor = variant === 'outline' ? COLORS.accentMint : COLORS.surface;
  const borderColor = variant === 'outline' ? COLORS.accentMint : 'transparent';

  return (
    <TouchableOpacity
      style={[
        styles.container,
        SHADOWS.light,
        SHADOWS.dark,
        { backgroundColor, borderColor, opacity: disabled ? 0.6 : 1 },
        style,
      ]}
      activeOpacity={0.85}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? <ActivityIndicator color={textColor} /> : <Text style={[styles.title, { color: textColor }]}>{title}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  title: {
    fontFamily: 'Unbounded_600SemiBold',
    fontSize: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
