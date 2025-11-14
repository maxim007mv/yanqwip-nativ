import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
  Linking,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import type { NavigationProp } from '@react-navigation/native';

import { GlassCard } from '@/components/GlassCard';
import { useUIStore } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';
import { Colors, Typography, Spacing, BorderRadius, Layout } from '@/lib/theme';
import { Route, RouteStep } from '@/lib/types';
import { routesApi } from '@/api';
import type { RootStackParamList } from '@/navigation/RootNavigator';

const { width } = Dimensions.get('window');

type RouteDetailsParams = {
  routeId: string;
};

type NavigationPropType = NavigationProp<RootStackParamList>;

export default function RouteDetailsScreen() {
  const { theme } = useUIStore();
  const { tokens } = useAuthStore();
  const navigation = useNavigation<NavigationPropType>();
  const route = useRoute<RouteProp<{ params: RouteDetailsParams }, 'params'>>();
  const isDark = theme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  const routeId = route.params?.routeId;

  const { data: routeData, isLoading, error } = useQuery({
    queryKey: ['route', routeId],
    queryFn: () => routesApi.getRouteById(routeId!),
    enabled: !!routeId && !!tokens?.accessToken,
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return mins > 0 ? `${hours} ч ${mins} мин` : `${hours} ч`;
    }
    return `${mins} мин`;
  };

  const openYandexMaps = () => {
    if (routeData?.yandexUrl) {
      Linking.openURL(routeData.yandexUrl);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <SafeAreaView style={styles.safeArea} edges={['top']} pointerEvents="auto">
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={[styles.backButton, { backgroundColor: colors.glassBg }]}
            >
              <Ionicons name="arrow-back" size={24} color={colors.text1} />
            </TouchableOpacity>
            <Text
              style={[
                styles.headerTitle,
                { color: colors.text1, fontFamily: Typography.unbounded },
              ]}
            >
              Детали маршрута
            </Text>
            <View style={styles.headerSpacer} />
          </View>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.accent} />
            <Text
              style={[
                styles.loadingText,
                { color: colors.text2, fontFamily: Typography.interMedium },
              ]}
            >
              Загрузка маршрута...
            </Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  if (error || !routeData) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <SafeAreaView style={styles.safeArea} edges={['top']} pointerEvents="auto">
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={[styles.backButton, { backgroundColor: colors.glassBg }]}
            >
              <Ionicons name="arrow-back" size={24} color={colors.text1} />
            </TouchableOpacity>
            <Text
              style={[
                styles.headerTitle,
                { color: colors.text1, fontFamily: Typography.unbounded },
              ]}
            >
              Детали маршрута
            </Text>
            <View style={styles.headerSpacer} />
          </View>
          <View style={styles.emptyContainer}>
            <Ionicons name="alert-circle-outline" size={64} color={colors.text3} />
            <Text
              style={[
                styles.emptyText,
                { color: colors.text3, fontFamily: Typography.interMedium },
              ]}
            >
              Маршрут не найден
            </Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <SafeAreaView style={styles.safeArea} edges={['top']} pointerEvents="auto">
        {/* Фиксированный хедер */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[styles.backButton, { backgroundColor: colors.glassBg }]}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text1} />
          </TouchableOpacity>
          <Text
            style={[
              styles.headerTitle,
              { color: colors.text1, fontFamily: Typography.unbounded },
            ]}
          >
            Детали маршрута
          </Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Скроллящийся контент */}
        <ScrollView
          style={[styles.scrollView, { pointerEvents: 'auto' as any }]}
          contentContainerStyle={[styles.scrollContent, { minHeight: '100%' }]}
          showsVerticalScrollIndicator={false}
          bounces={true}
          keyboardShouldPersistTaps="handled"
          pointerEvents="auto"
        >
          {/* Заголовок маршрута */}
          <GlassCard style={styles.titleCard} borderRadius="xxl">
            <LinearGradient
              colors={['rgba(255, 184, 74, 0.1)', 'rgba(255, 184, 74, 0.05)']}
              style={styles.titleGradient}
            >
              <View style={styles.titleHeader}>
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: 'rgba(255, 184, 74, 0.15)' },
                  ]}
                >
                  <Ionicons name="map-outline" size={28} color={colors.accent} />
                </View>
                <Text
                  style={[
                    styles.routeTitle,
                    { color: colors.text1, fontFamily: Typography.unbounded },
                  ]}
                >
                  {routeData.title}
                </Text>
              </View>

              {routeData.summary && (
                <Text
                  style={[
                    styles.routeSummary,
                    { color: colors.text2, fontFamily: Typography.interMedium },
                  ]}
                >
                  {routeData.summary}
                </Text>
              )}

              {/* Метаданные */}
              <View style={styles.metaContainer}>
                <View style={styles.metaRow}>
                  <View
                    style={[
                      styles.metaItem,
                      {
                        backgroundColor: 'rgba(255, 184, 74, 0.15)',
                        borderColor: 'rgba(255, 184, 74, 0.3)',
                      },
                    ]}
                  >
                    <Ionicons name="time-outline" size={20} color={colors.accent} />
                    <Text
                      style={[
                        styles.metaText,
                        { color: colors.text1, fontFamily: Typography.interBold },
                      ]}
                    >
                      {formatDuration(routeData.totalDuration || 0)}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.metaItem,
                      {
                        backgroundColor: 'rgba(255, 184, 74, 0.15)',
                        borderColor: 'rgba(255, 184, 74, 0.3)',
                      },
                    ]}
                  >
                    <Ionicons name="location-outline" size={20} color={colors.accent} />
                    <Text
                      style={[
                        styles.metaText,
                        { color: colors.text1, fontFamily: Typography.interBold },
                      ]}
                    >
                      {routeData.steps?.length || 0}{' '}
                      {routeData.steps?.length === 1 ? 'место' : 'мест'}
                    </Text>
                  </View>
                </View>
                {routeData.createdAt && (
                  <View
                    style={[
                      styles.metaItemDate,
                      { backgroundColor: 'rgba(255, 255, 255, 0.05)' },
                    ]}
                  >
                    <Ionicons name="calendar-outline" size={16} color={colors.text3} />
                    <Text
                      style={[
                        styles.metaTextDate,
                        { color: colors.text3, fontFamily: Typography.interMedium },
                      ]}
                    >
                      {formatDate(routeData.createdAt)}
                    </Text>
                  </View>
                )}
              </View>

              {/* Теги */}
              {routeData.tags && routeData.tags.length > 0 && (
                <View style={styles.tagsContainer}>
                  {routeData.tags.map((tag: string, index: number) => (
                    <View
                      key={index}
                      style={[
                        styles.tagPill,
                        {
                          backgroundColor: 'rgba(255, 184, 74, 0.15)',
                          borderColor: 'rgba(255, 184, 74, 0.4)',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.tagText,
                          { color: colors.accent, fontFamily: Typography.interSemiBold },
                        ]}
                      >
                        {tag}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </LinearGradient>
          </GlassCard>

          {/* Шаги маршрута */}
          {routeData.steps && routeData.steps.length > 0 && (
            <View style={styles.stepsSection}>
              <View style={styles.sectionHeader}>
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: 'rgba(255, 184, 74, 0.15)' },
                  ]}
                >
                  <Ionicons name="list-outline" size={24} color={colors.accent} />
                </View>
                <Text
                  style={[
                    styles.sectionTitle,
                    { color: colors.text1, fontFamily: Typography.unbounded },
                  ]}
                >
                  Шаги маршрута
                </Text>
              </View>

              <View style={styles.stepsTimeline}>
                {routeData.steps.map((step: RouteStep, index: number) => (
                  <StepCard
                    key={step.id || index}
                    step={step}
                    stepNumber={index + 1}
                    totalSteps={routeData.steps.length}
                    colors={colors}
                    isLast={index === routeData.steps.length - 1}
                  />
                ))}
              </View>
            </View>
          )}

          {/* Советы */}
          {routeData.tips && routeData.tips.length > 0 && (
            <GlassCard style={styles.tipsCard} borderRadius="xxl">
              <LinearGradient
                colors={['rgba(78, 205, 196, 0.1)', 'rgba(78, 205, 196, 0.05)']}
                style={styles.tipsGradient}
              >
                <View style={styles.tipsHeader}>
                  <View
                    style={[
                      styles.iconContainer,
                      { backgroundColor: 'rgba(78, 205, 196, 0.15)' },
                    ]}
                  >
                    <Ionicons name="bulb-outline" size={24} color="#4ECDC4" />
                  </View>
                  <Text
                    style={[
                      styles.sectionTitle,
                      { color: colors.text1, fontFamily: Typography.unbounded },
                    ]}
                  >
                    Советы
                  </Text>
                </View>
                <View style={styles.tipsContent}>
                  {routeData.tips.map((tip: string, index: number) => (
                    <View key={index} style={styles.tipItem}>
                      <LinearGradient
                        colors={['#4ECDC4', '#44A9A9']}
                        style={styles.tipBullet}
                      >
                        <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                      </LinearGradient>
                      <Text
                        style={[
                          styles.tipText,
                          { color: colors.text2, fontFamily: Typography.interMedium },
                        ]}
                      >
                        {tip}
                      </Text>
                    </View>
                  ))}
                </View>
              </LinearGradient>
            </GlassCard>
          )}

          {/* Кнопка действия */}
          {routeData.yandexUrl && (
            <TouchableOpacity
              onPress={openYandexMaps}
              activeOpacity={0.8}
              style={styles.actionButtonContainer}
            >
              <LinearGradient
                colors={['#FFB84A', '#FFC566']}
                style={styles.actionButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Ionicons name="map-outline" size={22} color="#2B1F05" />
                <Text style={styles.actionButtonText}>Открыть в Яндекс.Картах</Text>
                <Ionicons name="open-outline" size={18} color="#2B1F05" />
              </LinearGradient>
            </TouchableOpacity>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function StepCard({
  step,
  stepNumber,
  totalSteps,
  colors,
  isLast = false,
}: {
  step: RouteStep;
  stepNumber: number;
  totalSteps: number;
  colors: (typeof Colors)['dark'] | (typeof Colors)['light'];
  isLast?: boolean;
}) {
  return (
    <View style={styles.stepContainer}>
      {/* Timeline line */}
      <View style={styles.timelineColumn}>
        <LinearGradient
          colors={['#FFB84A', '#FFC566']}
          style={styles.stepNumberCircle}
        >
          <Text style={styles.stepNumberText}>{stepNumber}</Text>
        </LinearGradient>
        {!isLast && (
          <View
            style={[
              styles.timelineLine,
              { backgroundColor: 'rgba(255, 184, 74, 0.3)' },
            ]}
          />
        )}
      </View>

      {/* Content card */}
      <View style={styles.stepContentColumn}>
        <GlassCard style={styles.stepCard} borderRadius="xxl">
          <LinearGradient
            colors={['rgba(255, 184, 74, 0.08)', 'rgba(255, 184, 74, 0.04)']}
            style={styles.stepGradient}
          >
            <View style={styles.stepHeader}>
              <Text
                style={[
                  styles.stepTitle,
                  { color: colors.text1, fontFamily: Typography.interBold },
                ]}
              >
                {step.title}
              </Text>
              {step.duration && (
                <View style={styles.stepDuration}>
                  <Ionicons name="time-outline" size={14} color={colors.accent} />
                  <Text
                    style={[
                      styles.stepDurationText,
                      { color: colors.text2, fontFamily: Typography.interMedium },
                    ]}
                  >
                    {step.duration} мин
                  </Text>
                </View>
              )}
            </View>

            {step.description && (
              <Text
                style={[
                  styles.stepDescription,
                  { color: colors.text2, fontFamily: Typography.interMedium },
                ]}
              >
                {step.description}
              </Text>
            )}

            {step.address && (
              <View
                style={[
                  styles.stepAddress,
                  { backgroundColor: 'rgba(255, 184, 74, 0.1)' },
                ]}
              >
                <Ionicons name="location-outline" size={16} color={colors.accent} />
                <Text
                  style={[
                    styles.stepAddressText,
                    { color: colors.text2, fontFamily: Typography.interMedium },
                  ]}
                >
                  {step.address}
                </Text>
              </View>
            )}
          </LinearGradient>
        </GlassCard>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    opacity: 0.4,
  },
  backgroundImageStyle: {
    opacity: 0.4,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: Typography.h4,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: Spacing.sm,
  },
  headerSpacer: {
    width: 44,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xs,
    paddingBottom: Layout.dockOffset + 200,
    minHeight: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 80,
  },
  loadingText: {
    fontSize: Typography.body,
    marginTop: Spacing.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.xxxl * 2,
    paddingBottom: 80,
  },
  emptyText: {
    fontSize: Typography.h5,
    textAlign: 'center',
    marginTop: Spacing.md,
  },
  titleCard: {
    marginBottom: Spacing.lg,
  },
  titleGradient: {
    borderRadius: BorderRadius.xxl,
    padding: Spacing.xl,
  },
  titleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  routeTitle: {
    fontSize: Typography.h3,
    flex: 1,
  },
  routeSummary: {
    fontSize: Typography.body,
    lineHeight: 22,
    marginBottom: Spacing.lg,
  },
  metaContainer: {
    marginBottom: Spacing.lg,
  },
  metaRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  metaItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  metaText: {
    fontSize: Typography.body,
    flex: 1,
  },
  metaItemDate: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
  },
  metaTextDate: {
    fontSize: Typography.small,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  tagPill: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  tagText: {
    fontSize: Typography.small,
  },
  stepsSection: {
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.h4,
    marginLeft: Spacing.md,
  },
  stepsTimeline: {
    paddingLeft: Spacing.md,
  },
  stepContainer: {
    flexDirection: 'row',
    marginBottom: Spacing.lg,
  },
  timelineColumn: {
    alignItems: 'center',
    width: 60,
  },
  stepNumberCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  stepNumberText: {
    color: '#2B1F05',
    fontSize: Typography.h5,
    fontFamily: Typography.interBold,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginTop: Spacing.xs,
  },
  stepContentColumn: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  stepCard: {
    marginBottom: Spacing.md,
  },
  stepGradient: {
    borderRadius: BorderRadius.xxl,
    padding: Spacing.lg,
  },
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  stepTitle: {
    fontSize: Typography.h5,
    flex: 1,
  },
  stepDuration: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  stepDurationText: {
    fontSize: Typography.small,
  },
  stepDescription: {
    fontSize: Typography.body,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  stepAddress: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
  },
  stepAddressText: {
    fontSize: Typography.small,
    flex: 1,
  },
  tipsCard: {
    marginBottom: Spacing.lg,
  },
  tipsGradient: {
    borderRadius: BorderRadius.xxl,
    padding: Spacing.xl,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  tipsContent: {
    gap: Spacing.md,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  tipBullet: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  tipText: {
    fontSize: Typography.body,
    lineHeight: 20,
    flex: 1,
  },
  actionButtonContainer: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
    borderRadius: BorderRadius.xxl,
    overflow: 'hidden',
    shadowColor: '#FFB84A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  actionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
  },
  actionButtonText: {
    fontSize: Typography.body,
    fontFamily: Typography.interBold,
    color: '#2B1F05',
    textAlign: 'center',
  },
});
