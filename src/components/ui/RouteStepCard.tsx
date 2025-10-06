import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../constants/theme';
import { formatDuration, formatTimeRange } from '../../utils/format';
import type { RouteStep } from '../../types/api';

interface RouteStepCardProps {
  step: RouteStep;
  index: number;
}

export const RouteStepCard: React.FC<RouteStepCardProps> = ({ step, index }) => {
  const timeRange = formatTimeRange(step);
  const duration = formatDuration(step.duration_minutes);
  const meta = [timeRange, duration].filter(Boolean).join(' · ');

  return (
    <View style={styles.container}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{index + 1}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{step.title}</Text>
        {meta ? <Text style={styles.meta}>{meta}</Text> : null}
        <Text style={styles.description}>{step.description}</Text>
        {step.address ? <Text style={styles.subLabel}>📍 {step.address}</Text> : null}
        {step.website ? <Text style={styles.subLabel}>🌐 {step.website}</Text> : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.3)',
    marginBottom: 16,
    gap: 16,
  },
  badge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(94, 234, 212, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: COLORS.accentMint,
    fontFamily: 'Unbounded_600SemiBold',
  },
  title: {
    color: COLORS.textPrimary,
    fontFamily: 'Unbounded_600SemiBold',
    fontSize: 18,
    marginBottom: 6,
  },
  meta: {
    color: COLORS.accentMint,
    fontFamily: 'Inter_500Medium',
    marginBottom: 8,
  },
  description: {
    color: COLORS.textSecondary,
    fontFamily: 'Inter_400Regular',
    marginBottom: 8,
    lineHeight: 20,
  },
  subLabel: {
    color: COLORS.textSecondary,
    fontFamily: 'Inter_400Regular',
    marginTop: 2,
  },
});
