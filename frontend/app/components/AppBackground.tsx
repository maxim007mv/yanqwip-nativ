import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

import { useUIStore } from '@/store/uiStore';
import { Colors } from '@/lib/theme';

const MOSCOW_BG_IMAGE =
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgT2RXh6KBvwFzS1TfB2PLMa8xWFadjo2397E3o0A-7KQCMj8wke1QVIMAvwmipIzqRBQ&usqp=CAU';

const NOISE_IMAGE =
  'data:image/png;base64,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';

export const AppBackground: React.FC = () => {
  const { theme } = useUIStore();
  const isDark = theme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  return (
    <View pointerEvents="none" style={styles.container}>
      <Image
        source={{ uri: MOSCOW_BG_IMAGE }}
        style={styles.photo}
        resizeMode="cover"
        blurRadius={isDark ? 6 : 3}
      />

      <LinearGradient
        colors={
          isDark
            ? ['rgba(0, 0, 0, 0.45)', colors.background]
            : ['rgba(255, 255, 255, 0.45)', colors.background]
        }
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <Svg style={StyleSheet.absoluteFill}>
        <Defs>
          <RadialGradient id="glow" cx="75%" cy="8%" rx="70%" ry="55%">
            <Stop offset="0%" stopColor={colors.accentHighlight} stopOpacity={0.6} />
            <Stop offset="65%" stopColor="rgba(255, 184, 74, 0)" />
          </RadialGradient>
          <RadialGradient id="glowLeft" cx="8%" cy="10%" rx="60%" ry="45%">
            <Stop offset="0%" stopColor={colors.accentHighlight} stopOpacity={0.5} />
            <Stop offset="70%" stopColor="rgba(255, 184, 74, 0)" />
          </RadialGradient>
        </Defs>

        <Rect x="0" y="0" width="100%" height="100%" fill="url(#glow)" />
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#glowLeft)" />
      </Svg>

      <Image
        source={{ uri: NOISE_IMAGE }}
        style={[
          styles.noise,
          {
            opacity: isDark ? 0.5 : 0.25,
          },
        ]}
        resizeMode="repeat"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  photo: {
    ...StyleSheet.absoluteFillObject,
  },
  noise: {
    ...StyleSheet.absoluteFillObject,
  },
});

