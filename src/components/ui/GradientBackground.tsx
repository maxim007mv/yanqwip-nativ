import React, {PropsWithChildren} from 'react';
import {Dimensions, StyleSheet, View, ViewStyle} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';

const {width, height} = Dimensions.get('window');

interface GradientBackgroundProps extends PropsWithChildren {
  style?: ViewStyle | ViewStyle[];
  variant?: 'default' | 'accent';
}

export const GradientBackground: React.FC<GradientBackgroundProps> = ({
  children,
  style,
  variant = 'default',
}) => {
  const colors: readonly [string, string, string] =
    variant === 'accent' ? ['#0F172A', '#1E293B', '#334155'] : ['#050816', '#111827', '#1F2937'];

  return (
    <View style={[styles.container, style]}>
      <LinearGradient
        colors={colors}
        start={{x: 0.1, y: 0}}
        end={{x: 0.9, y: 1}}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={['rgba(94, 234, 212, 0.1)', 'rgba(244, 114, 182, 0.1)']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={StyleSheet.absoluteFill}
      />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050816',
  },
});
