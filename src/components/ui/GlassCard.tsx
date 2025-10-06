import React, { PropsWithChildren } from 'react';
import { ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { COLORS } from '../../constants/theme';

interface GlassCardProps extends PropsWithChildren {
  intensity?: number;
  style?: ViewStyle | ViewStyle[];
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  intensity = 40,
  style,
}) => {
  return (
    <BlurView
      intensity={intensity}
      tint="dark"
      style={[
        {
          backgroundColor: COLORS.glass,
          borderColor: COLORS.border,
          borderWidth: 1,
          borderRadius: 24,
          padding: 20,
        },
        style,
      ]}
    >
      {children}
    </BlurView>
  );
};
