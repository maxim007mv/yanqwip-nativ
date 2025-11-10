import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Linking, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useUIStore } from '@/store/uiStore';
import { GlassCard } from '@/components/GlassCard';
import { Colors, Typography, Spacing } from '@/lib/theme';
import { Route } from '@/lib/types';

type RouteOverviewParams = {
  routeId: string;
  route?: Route;
};

export default function RouteOverviewScreen() {
  const { theme } = useUIStore();
  const colors = theme === 'dark' ? Colors.dark : Colors.light;
  const route = useRoute<RouteProp<{ params: RouteOverviewParams }, 'params'>>();
  const [routeData, setRouteData] = useState<Route | null>(route.params?.route || null);

  useEffect(() => {
    console.log('📍 RouteOverviewScreen mounted');
    console.log('📦 Route params:', route.params);
    console.log('📦 Route params.route:', route.params?.route);
    console.log('📦 Route params.routeId:', route.params?.routeId);
    
    if (route.params?.route) {
      console.log('✅ Маршрут получен из params');
      console.log('📋 Title:', route.params.route.title);
      console.log('📋 Steps count:', route.params.route.steps?.length);
      setRouteData(route.params.route);
    } else {
      console.log('❌ Маршрут НЕ получен из params!');
    }
  }, [route.params]);

  if (!routeData) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={[styles.loadingText, { color: colors.text2 }]}>
            Загрузка маршрута...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const openYandexMaps = () => {
    if (routeData.yandexUrl) {
      Linking.openURL(routeData.yandexUrl);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: colors.text1 }]}>
          {routeData.title}
        </Text>
        
        {routeData.summary && (
          <GlassCard style={styles.summaryCard}>
            <Text style={[styles.summaryText, { color: colors.text2 }]}>
              {routeData.summary}
            </Text>
          </GlassCard>
        )}

        {routeData.yandexUrl && (
          <Pressable 
            style={[styles.mapButton, { backgroundColor: colors.accent }]} 
            onPress={openYandexMaps}
          >
            <Text style={[styles.mapButtonText, { color: colors.background }]}>
              🗺️ Открыть в Яндекс.Картах
            </Text>
          </Pressable>
        )}

        <Text style={[styles.sectionTitle, { color: colors.text1 }]}>
          Шаги маршрута
        </Text>

        {routeData.steps.map((step, index) => (
          <GlassCard key={step.id} style={styles.stepCard}>
            <View style={styles.stepHeader}>
              <View style={[styles.stepNumber, { backgroundColor: colors.accent }]}>
                <Text style={[styles.stepNumberText, { color: colors.background }]}>
                  {index + 1}
                </Text>
              </View>
              <Text style={[styles.stepTitle, { color: colors.text1 }]}>
                {step.title}
              </Text>
            </View>
            
            <Text style={[styles.stepDescription, { color: colors.text2 }]}>
              {step.description}
            </Text>
            
            {step.address && (
              <Text style={[styles.stepAddress, { color: colors.text3 }]}>
                📍 {step.address}
              </Text>
            )}
            
            {step.duration && (
              <Text style={[styles.stepDuration, { color: colors.text3 }]}>
                ⏱️ {step.duration} минут
              </Text>
            )}
          </GlassCard>
        ))}

        {routeData.tips && routeData.tips.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { color: colors.text1 }]}>
              Полезные советы
            </Text>
            {routeData.tips.map((tip, index) => (
              tip && (
                <GlassCard key={index} style={styles.tipCard}>
                  <Text style={[styles.tipText, { color: colors.text2 }]}>
                    💡 {tip}
                  </Text>
                </GlassCard>
              )
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  content: { padding: Spacing.xl, paddingBottom: Spacing.xxl },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: Spacing.lg, fontSize: Typography.body },
  title: { 
    fontSize: Typography.h1, 
    fontWeight: Typography.bold, 
    marginBottom: Spacing.xl,
    textAlign: 'center'
  },
  summaryCard: { marginBottom: Spacing.lg, padding: Spacing.lg },
  summaryText: { fontSize: Typography.body, lineHeight: 24 },
  mapButton: {
    padding: Spacing.lg,
    borderRadius: 12,
    marginBottom: Spacing.xl,
    alignItems: 'center',
  },
  mapButtonText: { fontSize: Typography.h4, fontWeight: Typography.semiBold },
  sectionTitle: {
    fontSize: Typography.h3,
    fontWeight: Typography.bold,
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  stepCard: { marginBottom: Spacing.lg, padding: Spacing.lg },
  stepHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.md },
  stepNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  stepNumberText: { fontSize: Typography.h4, fontWeight: Typography.bold },
  stepTitle: { 
    flex: 1, 
    fontSize: Typography.h4, 
    fontWeight: Typography.semiBold 
  },
  stepDescription: { 
    fontSize: Typography.body, 
    lineHeight: 22, 
    marginBottom: Spacing.sm 
  },
  stepAddress: { fontSize: Typography.small, marginTop: Spacing.xs },
  stepDuration: { fontSize: Typography.small, marginTop: Spacing.xs },
  tipCard: { marginBottom: Spacing.md, padding: Spacing.md },
  tipText: { fontSize: Typography.body, lineHeight: 22 },
});
