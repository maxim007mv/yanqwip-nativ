import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { COLORS } from '../../constants/theme';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  style?: ViewStyle | ViewStyle[];
}

export const Chip: React.FC<ChipProps> = ({ label, selected = false, onPress, style }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[
        styles.container,
        {
          backgroundColor: selected ? COLORS.accentMint : 'rgba(148, 163, 184, 0.15)',
          borderColor: selected ? COLORS.accentMint : 'rgba(148, 163, 184, 0.35)',
        },
        style,
      ]}
    >
      <Text style={[styles.label, { color: selected ? COLORS.surface : COLORS.textPrimary }]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 999,
    marginRight: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  label: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
  },
});
