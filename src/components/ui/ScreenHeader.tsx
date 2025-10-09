import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../constants/theme';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  trailing?: React.ReactNode;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({ title, subtitle, trailing }) => {
  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {trailing}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 28,
    fontFamily: 'Unbounded_600SemiBold',
  },
  subtitle: {
    color: COLORS.textSecondary,
    marginTop: 8,
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
  },
});
