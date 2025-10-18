import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUIStore } from '@/store/uiStore';
import { Colors, Typography } from '@/lib/theme';

export default function RouteOverviewScreen() {
  const { theme } = useUIStore();
  const colors = theme === 'dark' ? Colors.dark : Colors.light;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text1 }]}>
          Обзор маршрута
        </Text>
        <Text style={[styles.subtitle, { color: colors.text2 }]}>
          Карта Яндекс + Шаги маршрута
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: Typography.h2, fontWeight: Typography.bold, marginBottom: 12 },
  subtitle: { fontSize: Typography.body, textAlign: 'center' },
});
