import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  Animated,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';

import { ScreenShell } from '@/components/ScreenShell';
import { GlassCard } from '@/components/GlassCard';
import { BottomTabBar } from '@/components/BottomTabBar';
import { useUIStore } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';
import { Colors, Typography, Spacing, BorderRadius, Layout } from '@/lib/theme';
import { Route } from '@/lib/types';
import { routesApi } from '@/api';
import type { RootStackParamList } from '@/navigation/RootNavigator';

const { width } = Dimensions.get('window');

type NavigationPropType = NavigationProp<RootStackParamList>;

export default function RoutesHistoryScreen() {
  const { theme } = useUIStore();
  const { tokens } = useAuthStore();
  const navigation = useNavigation<NavigationPropType>();
  const isDark = theme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  const { data: routes = [], isLoading } = useQuery({
    queryKey: ['myRoutes'],
    queryFn: () => routesApi.getMyRoutes(),
    enabled: !!tokens?.accessToken,
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

  return (
    <ImageBackground
      source={require('@/assets/images/profile_background.jpg')}
      style={[styles.container, { backgroundColor: colors.background }]}
      imageStyle={styles.backgroundImage}
      resizeMode="cover"
      blurRadius={isDark ? 12 : 8}
    >
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Улучшенный заголовок */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[styles.backButton, { backgroundColor: colors.glassBg }]}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text1} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text
              style={[
                styles.headerTitle,
                { color: colors.text1, fontFamily: Typography.unbounded },
              ]}
            >
              История маршрутов
            </Text>
            {routes.length > 0 && (
              <View style={[styles.countBadge, { backgroundColor: colors.accent }]}>
                <Text
                  style={[
                    styles.countText,
                    { color: '#2B1F05', fontFamily: Typography.interBold },
                  ]}
                >
                  {routes.length}
                </Text>
              </View>
            )}
          </View>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Layout.dockOffset + 140 },
          ]}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <ScreenShell>
            {isLoading ? (
              <View style={styles.emptyContainer}>
                <View style={[styles.loadingIcon, { backgroundColor: colors.glassBg }]}>
                  <Ionicons name="map" size={48} color={colors.accent} />
                </View>
                <Text
                  style={[
                    styles.emptyText,
                    { color: colors.text2, fontFamily: Typography.interMedium },
                  ]}
                >
                  Загрузка маршрутов...
                </Text>
              </View>
            ) : routes.length === 0 ? (
              <View style={styles.emptyContainer}>
                <LinearGradient
                  colors={[
                    'rgba(255, 184, 74, 0.15)',
                    'rgba(255, 184, 74, 0.05)',
                  ]}
                  style={styles.emptyIconContainer}
                >
                  <Ionicons name="map-outline" size={80} color={colors.accent} />
                </LinearGradient>
                <Text
                  style={[
                    styles.emptyTitle,
                    { color: colors.text1, fontFamily: Typography.unbounded },
                  ]}
                >
                  Пока нет маршрутов
                </Text>
                <Text
                  style={[
                    styles.emptySubtext,
                    { color: colors.text3, fontFamily: Typography.interMedium },
                  ]}
                >
                  Создайте свой первый маршрут через мастер генерации
                </Text>
                <TouchableOpacity
                  style={[styles.exploreButton, { backgroundColor: colors.accent }]}
                  onPress={() => {
                    // @ts-ignore
                    navigation.navigate('Wizard');
                  }}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.exploreButtonText,
                      { color: '#2B1F05', fontFamily: Typography.interBold },
                    ]}
                  >
                    Создать маршрут
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.routesList}>
                {routes.map((route, index) => (
                  <RouteCard
                    key={route.id}
                    route={route}
                    colors={colors}
                    index={index}
                    onPress={() => {
                      navigation.navigate('RouteDetails', { routeId: route.id } as any);
                    }}
                    formatDate={formatDate}
                    formatDuration={formatDuration}
                  />
                ))}
              </View>
            )}
          </ScreenShell>
        </ScrollView>
        <BottomTabBar />
      </SafeAreaView>
    </ImageBackground>
  );
}

function RouteCard({
  route,
  colors,
  index,
  onPress,
  formatDate,
  formatDuration,
}: {
  route: Route;
  colors: (typeof Colors)['dark'] | (typeof Colors)['light'];
  index: number;
  onPress: () => void;
  formatDate: (date: string) => string;
  formatDuration: (minutes: number) => string;
}) {
  const scaleAnim = React.useRef(new Animated.Value(0)).current;
  const opacityAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        delay: index * 80,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        delay: index * 80,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const stepsCount = route.steps?.length || 0;
  const duration = route.totalDuration || 0;

  return (
    <Animated.View
      style={[
        styles.cardWrapper,
        {
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
        <GlassCard style={styles.routeCard} borderRadius="xxl">
          <ImageBackground
            source={{
              uri: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1600&auto=format&fit=crop',
            }}
            style={styles.routeImage}
            imageStyle={styles.routeImageRadius}
          >
            <LinearGradient
              colors={[
                'rgba(0, 0, 0, 0.7)',
                'rgba(0, 0, 0, 0.3)',
                'rgba(0, 0, 0, 0.75)',
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            
            {/* Верхняя часть изображения */}
            <View style={styles.routeImageTop}>
              <LinearGradient
                colors={[colors.accent, colors.accent2]}
                style={styles.routeTag}
              >
                <Ionicons name="map" size={16} color="#2B1F05" />
                <Text
                  style={[
                    styles.routeTagText,
                    { color: '#2B1F05', fontFamily: Typography.interBold },
                  ]}
                >
                  Маршрут
                </Text>
              </LinearGradient>
            </View>

            {/* Нижняя часть изображения */}
            <View style={styles.routeImageBottom}>
              <Text
                style={[
                  styles.routeTitle,
                  { color: '#FFF', fontFamily: Typography.interBold },
                ]}
                numberOfLines={2}
              >
                {route.title}
              </Text>
              {route.summary && (
                <Text
                  style={[
                    styles.routeSummaryPreview,
                    { color: 'rgba(255, 255, 255, 0.9)', fontFamily: Typography.interMedium },
                  ]}
                  numberOfLines={1}
                >
                  {route.summary}
                </Text>
              )}
            </View>
          </ImageBackground>

          {/* Контент карточки */}
          <View style={styles.routeContent}>
            {/* Метаданные */}
            <View style={styles.routeMeta}>
              <View style={[styles.metaItem, { backgroundColor: colors.glassBg }]}>
                <View style={[styles.metaIcon, { backgroundColor: colors.accent + '20' }]}>
                  <Ionicons name="time" size={16} color={colors.accent} />
                </View>
                <Text
                  style={[
                    styles.metaText,
                    { color: colors.text1, fontFamily: Typography.interSemiBold },
                  ]}
                >
                  {formatDuration(duration)}
                </Text>
              </View>
              <View style={[styles.metaItem, { backgroundColor: colors.glassBg }]}>
                <View style={[styles.metaIcon, { backgroundColor: colors.accent + '20' }]}>
                  <Ionicons name="location" size={16} color={colors.accent} />
                </View>
                <Text
                  style={[
                    styles.metaText,
                    { color: colors.text1, fontFamily: Typography.interSemiBold },
                  ]}
                >
                  {stepsCount} {stepsCount === 1 ? 'место' : stepsCount < 5 ? 'места' : 'мест'}
                </Text>
              </View>
              <View style={[styles.metaItem, { backgroundColor: colors.glassBg }]}>
                <View style={[styles.metaIcon, { backgroundColor: colors.accent + '20' }]}>
                  <Ionicons name="calendar" size={16} color={colors.accent} />
                </View>
                <Text
                  style={[
                    styles.metaText,
                    { color: colors.text1, fontFamily: Typography.interSemiBold },
                  ]}
                  numberOfLines={1}
                >
                  {route.createdAt ? formatDate(route.createdAt) : 'Недавно'}
                </Text>
              </View>
            </View>

            {/* Теги */}
            {route.tags && route.tags.length > 0 && (
              <View style={styles.routeTags}>
                {route.tags.slice(0, 3).map((tag, tagIndex) => (
                  <View
                    key={tagIndex}
                    style={[
                      styles.routeTagPill,
                      {
                        backgroundColor: colors.glassBg,
                        borderColor: colors.glassBorder,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.routeTagPillText,
                        { color: colors.text2, fontFamily: Typography.interMedium },
                      ]}
                    >
                      {tag}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Футер с кнопкой */}
            <View style={styles.routeFooter}>
              <View style={styles.routeFooterLeft}>
                <Text
                  style={[
                    styles.routeFooterText,
                    { color: colors.text2, fontFamily: Typography.interSemiBold },
                  ]}
                >
                  Подробнее
                </Text>
                <Ionicons name="chevron-forward" size={18} color={colors.accent} />
              </View>
              {route.yandexUrl && (
                <TouchableOpacity
                  style={[
                    styles.yandexButton,
                    { backgroundColor: colors.accent + '20', borderColor: colors.accent },
                  ]}
                  onPress={(e) => {
                    e.stopPropagation();
                    // Можно открыть Яндекс.Карты
                  }}
                  activeOpacity={0.7}
                >
                  <Ionicons name="map-outline" size={16} color={colors.accent} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </GlassCard>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  headerTitle: {
    fontSize: Typography.h3,
  },
  countBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    minWidth: 32,
    alignItems: 'center',
  },
  countText: {
    fontSize: Typography.small,
  },
  headerSpacer: {
    width: 40,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.xxxl * 2,
    gap: Spacing.lg,
  },
  loadingIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    fontSize: Typography.h3,
    textAlign: 'center',
    marginTop: Spacing.md,
  },
  emptyText: {
    fontSize: Typography.h5,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: Typography.body,
    textAlign: 'center',
    opacity: 0.7,
    marginTop: Spacing.xs,
    paddingHorizontal: Spacing.xl,
  },
  exploreButton: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.md,
  },
  exploreButtonText: {
    fontSize: Typography.body,
  },
  routesList: {
    gap: Spacing.lg,
  },
  cardWrapper: {
    marginBottom: Spacing.md,
  },
  routeCard: {
    overflow: 'hidden',
  },
  routeImage: {
    height: 200,
    justifyContent: 'space-between',
  },
  routeImageRadius: {
    borderTopLeftRadius: BorderRadius.xxxl,
    borderTopRightRadius: BorderRadius.xxxl,
  },
  routeImageTop: {
    padding: Spacing.lg,
    alignItems: 'flex-start',
  },
  routeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: BorderRadius.md,
  },
  routeTagText: {
    fontSize: Typography.small,
    letterSpacing: 0.3,
  },
  routeImageBottom: {
    padding: Spacing.lg,
    paddingTop: 0,
  },
  routeTitle: {
    fontSize: Typography.h3,
    lineHeight: 28,
    marginBottom: Spacing.xs,
  },
  routeSummaryPreview: {
    fontSize: Typography.bodySmall,
    lineHeight: 18,
    opacity: 0.95,
  },
  routeContent: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  routeMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: BorderRadius.md,
    flex: 1,
    minWidth: '30%',
  },
  metaIcon: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  metaText: {
    fontSize: Typography.caption,
    flex: 1,
  },
  routeTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  routeTagPill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  routeTagPillText: {
    fontSize: Typography.small,
  },
  routeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sm,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  routeFooterLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  routeFooterText: {
    fontSize: Typography.bodySmall,
  },
  yandexButton: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
