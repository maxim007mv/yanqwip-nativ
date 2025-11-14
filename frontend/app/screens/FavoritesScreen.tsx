import React, { useRef } from 'react';
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
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import type { RootStackParamList } from '@/navigation/RootNavigator';

import { ScreenShell } from '@/components/ScreenShell';
import { GlassCard } from '@/components/GlassCard';
import { BottomTabBar } from '@/components/BottomTabBar';
import { useUIStore } from '@/store/uiStore';
import { Colors, Typography, Spacing, BorderRadius, Layout } from '@/lib/theme';
import { Place, PlaceCategory } from '@/lib/types';
import { placesApi } from '@/api';

const { width } = Dimensions.get('window');
// Ширина карточки: (ширина экрана - отступы слева/справа - отступ между карточками) / 2
// Используем более точный расчет с учетом всех отступов
const screenPadding = Spacing.lg * 2; // Отступы слева и справа
const cardGap = Spacing.md; // Отступ между карточками
const CARD_WIDTH = (width - screenPadding - cardGap) / 2;

const CATEGORY_BADGES: Record<PlaceCategory, string> = {
  all: 'Место',
  cafe: 'Кафе',
  park: 'Парки',
  museum: 'Музеи',
  restaurant: 'Ресторан',
  romantic: 'Романтика',
  entertainment: 'Развлечения',
  shopping: 'Шопинг',
  culture: 'Культура',
};

type NavigationPropType = NavigationProp<RootStackParamList>;

export default function FavoritesScreen() {
  const { theme } = useUIStore();
  const navigation = useNavigation<NavigationPropType>();
  const isDark = theme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;
  const queryClient = useQueryClient();

  // Загружаем список ID избранных мест
  const { data: favoriteIds = [], isLoading: isLoadingFavorites } = useQuery({
    queryKey: ['favorites'],
    queryFn: () => placesApi.getFavorites(),
  });

  // Загружаем все места и фильтруем только избранные
  const { data: allPlaces = [], isLoading: isLoadingPlaces } = useQuery({
    queryKey: ['places', 'all'],
    queryFn: () => placesApi.getAll('all'),
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: placesApi.toggleFavorite,
    onSuccess: () => {
      // Обновляем список избранного и мест после изменения
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      queryClient.invalidateQueries({ queryKey: ['places'] });
    },
    onError: () => {
      // Даже при ошибке API обновляем кеш из локального хранилища
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      queryClient.invalidateQueries({ queryKey: ['places'] });
    },
  });

  // Фильтруем только избранные места
  const favoritePlaces = React.useMemo(() => {
    if (!favoriteIds.length || !allPlaces.length) return [];
    
    return allPlaces
      .filter(place => favoriteIds.includes(place.id))
      .map(place => ({
        ...place,
        isFavorite: true,
      }));
  }, [allPlaces, favoriteIds]);

  const isLoading = isLoadingFavorites || isLoadingPlaces;

  // Анимации для скролла
  const scrollY = useRef(new Animated.Value(0)).current;

  // Анимации для секций при скролле - плавные и почти незаметные
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100, 200],
    outputRange: [1, 0.95, 1],
    extrapolate: 'clamp',
  });

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 100, 200],
    outputRange: [0, 5, 0],
    extrapolate: 'clamp',
  });

  const statsOpacity = scrollY.interpolate({
    inputRange: [50, 150, 250],
    outputRange: [0.8, 0.95, 1],
    extrapolate: 'clamp',
  });

  const statsTranslateY = scrollY.interpolate({
    inputRange: [50, 150, 250],
    outputRange: [10, 5, 0],
    extrapolate: 'clamp',
  });

  const placesOpacity = scrollY.interpolate({
    inputRange: [100, 200, 300],
    outputRange: [0.8, 0.95, 1],
    extrapolate: 'clamp',
  });

  const placesTranslateY = scrollY.interpolate({
    inputRange: [100, 200, 300],
    outputRange: [10, 5, 0],
    extrapolate: 'clamp',
  });

  return (
    <ImageBackground
      source={require('@/assets/images/places_background.jpg')}
      style={[styles.container, { backgroundColor: colors.background }]}
      imageStyle={styles.backgroundImage}
      resizeMode="cover"
      blurRadius={isDark ? 12 : 8}
    >
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Заголовок с кнопкой назад */}
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
              Избранное
            </Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.shellWrapper}>
          <ScreenShell
            style={styles.shell}
            contentStyle={styles.shellContent}
          >
            <Animated.ScrollView
              showsVerticalScrollIndicator={false}
              bounces={false}
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                { useNativeDriver: false }
              )}
              scrollEventThrottle={32}
            >
              {/* Заголовок */}
              <Animated.View
                style={[
                  styles.headerSection,
                  {
                    opacity: headerOpacity,
                    transform: [{ translateY: headerTranslateY }],
                  },
                ]}
              >
                <Text
                  style={[
                    styles.title,
                    { color: colors.text1, textShadowColor: colors.accentGlow },
                  ]}
                >
                  Избранное
                </Text>
                <Text
                  style={[
                    styles.subtitle,
                    { color: colors.text2, fontFamily: Typography.interMedium },
                  ]}
                >
                  {favoritePlaces.length > 0
                    ? `${favoritePlaces.length} ${favoritePlaces.length === 1 ? 'место' : 'мест'} в избранном`
                    : 'Ваши сохраненные места'}
                </Text>
              </Animated.View>
            {isLoading ? (
              <View style={styles.emptyContainer}>
                <View style={[styles.loadingIcon, { backgroundColor: colors.glassBg }]}>
                  <Ionicons name="heart" size={48} color={colors.accent} />
                </View>
                <Text
                  style={[
                    styles.emptyText,
                    { color: colors.text2, fontFamily: Typography.interMedium },
                  ]}
                >
                  Загрузка избранных мест...
                </Text>
              </View>
            ) : favoritePlaces.length === 0 ? (
              <View style={styles.emptyContainer}>
                <LinearGradient
                  colors={[
                    'rgba(255, 184, 74, 0.15)',
                    'rgba(255, 184, 74, 0.05)',
                  ]}
                  style={styles.emptyIconContainer}
                >
                  <Ionicons name="heart-outline" size={80} color={colors.accent} />
                </LinearGradient>
                <Text
                  style={[
                    styles.emptyTitle,
                    { color: colors.text1, fontFamily: Typography.unbounded },
                  ]}
                >
                  Пока нет избранных мест
                </Text>
                <Text
                  style={[
                    styles.emptySubtext,
                    { color: colors.text3, fontFamily: Typography.interMedium },
                  ]}
                >
                  Добавьте места в избранное на экране "Места"
                </Text>
                <TouchableOpacity
                  style={[styles.exploreButton, { backgroundColor: colors.accent }]}
                  onPress={() => {
                    // @ts-ignore
                    navigation.navigate('Main', { screen: 'Places' });
                  }}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.exploreButtonText,
                      { color: '#2B1F05', fontFamily: Typography.interBold },
                    ]}
                  >
                    Перейти к местам
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                {/* Статистика */}
                <Animated.View
                  style={[
                    styles.statsContainer,
                    {
                      opacity: statsOpacity,
                      transform: [{ translateY: statsTranslateY }],
                    },
                  ]}
                >
                  <GlassCard style={styles.statsCard} borderRadius="xl">
                    <View style={styles.statsItem}>
                      <View style={[styles.statsIcon, { backgroundColor: colors.accent + '20' }]}>
                        <Ionicons name="heart" size={20} color={colors.accent} />
                      </View>
                      <View style={styles.statsContent}>
                        <Text
                          style={[
                            styles.statsValue,
                            { color: colors.text1, fontFamily: Typography.interBold },
                          ]}
                        >
                          {favoritePlaces.length}
                        </Text>
                        <Text
                          style={[
                            styles.statsLabel,
                            { color: colors.text3, fontFamily: Typography.interMedium },
                          ]}
                        >
                          {favoritePlaces.length === 1 ? 'место' : 'мест'}
                        </Text>
                      </View>
                    </View>
                    <View style={[styles.statsDivider, { backgroundColor: colors.glassBorder }]} />
                    <View style={styles.statsItem}>
                      <View style={[styles.statsIcon, { backgroundColor: colors.accent + '20' }]}>
                        <Ionicons name="star" size={20} color={colors.accent} />
                      </View>
                      <View style={styles.statsContent}>
                        <Text
                          style={[
                            styles.statsValue,
                            { color: colors.text1, fontFamily: Typography.interBold },
                          ]}
                        >
                          {(
                            favoritePlaces.reduce((sum, p) => sum + p.rating, 0) /
                            favoritePlaces.length
                          ).toFixed(1)}
                        </Text>
                        <Text
                          style={[
                            styles.statsLabel,
                            { color: colors.text3, fontFamily: Typography.interMedium },
                          ]}
                        >
                          средний рейтинг
                        </Text>
                      </View>
                    </View>
                  </GlassCard>
                </Animated.View>

                {/* Сетка мест */}
                <Animated.View
                  style={[
                    styles.gridSection,
                    {
                      opacity: placesOpacity,
                      transform: [{ translateY: placesTranslateY }],
                    },
                  ]}
                >
                  <View style={styles.placesGrid}>
                    {favoritePlaces.map((place, index) => (
                      <PlaceCard
                        key={place.id}
                        place={place}
                        colors={colors}
                        index={index}
                        onToggleFavorite={() => toggleFavoriteMutation.mutate(place.id)}
                      />
                    ))}
                  </View>
                </Animated.View>
              </>
            )}
            </Animated.ScrollView>
          </ScreenShell>
        </View>
        <BottomTabBar />
      </SafeAreaView>
    </ImageBackground>
  );
}

function PlaceCard({
  place,
  colors,
  index,
  onToggleFavorite,
}: {
  place: Place;
  colors: (typeof Colors)['dark'] | (typeof Colors)['light'];
  index: number;
  onToggleFavorite: () => void;
}) {
  const scaleAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      delay: index * 50,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.cardWrapper,
        {
          transform: [{ scale: scaleAnim }],
          opacity: scaleAnim,
        },
      ]}
    >
      <GlassCard style={styles.placeCard} borderRadius="xxl">
        <TouchableOpacity activeOpacity={0.9}>
          <ImageBackground
            source={{ uri: place.imageUrl }}
            style={styles.placeImage}
            imageStyle={styles.placeImageRadius}
          >
            <LinearGradient
              colors={[
                'rgba(0,0,0,0.55)',
                'rgba(0,0,0,0.15)',
                'rgba(0,0,0,0.65)',
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <View
              style={[
                styles.placeBadge,
                { backgroundColor: colors.accent },
              ]}
            >
              <Text
                style={[
                  styles.placeBadgeText,
                  { fontFamily: Typography.interBold },
                ]}
              >
                {CATEGORY_BADGES[place.category] || 'Место'}
              </Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={onToggleFavorite}
              style={styles.favoriteBtn}
            >
              <Ionicons
                name={place.isFavorite ? 'heart' : 'heart-outline'}
                size={20}
                color={place.isFavorite ? '#FF4655' : '#FFF'}
              />
            </TouchableOpacity>
          </ImageBackground>

          <View style={styles.placeContent}>
            <Text
              style={[
                styles.placeTitle,
                { color: colors.text1, fontFamily: Typography.interBold },
              ]}
              numberOfLines={1}
            >
              {place.title}
            </Text>
            <Text
              style={[
                styles.placeDescription,
                { color: colors.text2, fontFamily: Typography.interMedium },
              ]}
              numberOfLines={2}
            >
              {place.description}
            </Text>

            <View style={styles.placeMeta}>
              <View
                style={[
                  styles.placePill,
                  {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderColor: 'rgba(255,255,255,0.25)',
                  },
                ]}
              >
                <Ionicons name="location-outline" size={14} color={colors.text3} />
                <Text
                  style={[
                    styles.placePillText,
                    { color: colors.text1, fontFamily: Typography.interMedium },
                  ]}
                  numberOfLines={1}
                >
                  {place.area}
                </Text>
              </View>
              <View style={styles.placeRating}>
                <Ionicons name="star" size={14} color={colors.accent} />
                <Text
                  style={[
                    styles.ratingText,
                    { color: colors.text1, fontFamily: Typography.interSemiBold },
                  ]}
                >
                  {place.rating.toFixed(1)}
                </Text>
                <Text
                  style={[
                    styles.ratingCount,
                    { color: colors.text3, fontFamily: Typography.interMedium },
                  ]}
                >
                  ({place.reviewCount || 0})
                </Text>
              </View>
            </View>

            <View style={styles.placeFooter}>
              <Text
                style={[
                  styles.priceLevel,
                  { color: colors.text3, fontFamily: Typography.interSemiBold },
                ]}
              >
                {'₽'.repeat(place.priceLevel)}
              </Text>
              {place.isOpen ? (
                <Text
                  style={[
                    styles.openText,
                    { color: colors.success, fontFamily: Typography.interSemiBold },
                  ]}
                >
                  Открыто
                </Text>
              ) : (
                <Text
                  style={[
                    styles.openText,
                    { color: colors.text3, fontFamily: Typography.interMedium },
                  ]}
                >
                  Закрыто
                </Text>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </GlassCard>
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
  headerSpacer: {
    width: 40,
  },
  shellWrapper: {
    flex: 1,
    alignItems: 'center',
    paddingTop: Spacing.pageTop,
    paddingHorizontal: Layout.screenGutter,
    paddingBottom: Layout.dockOffset + Spacing.xl,
  },
  shell: {
    width: '100%',
    maxWidth: Layout.maxWidth,
    flex: 1,
    minHeight: 0,
  },
  shellContent: {
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 0,
    flex: 1,
    minHeight: 0,
  },
  scrollView: {
    flex: 1,
    minHeight: 0,
  },
  scrollContent: {
    paddingBottom: Layout.dockOffset + 160,
    flexGrow: 1,
  },
  headerSection: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  title: {
    fontFamily: Typography.unbounded,
    fontSize: Typography.h2,
  },
  subtitle: {
    fontSize: Typography.bodySmall,
    lineHeight: 22,
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
  statsContainer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  statsCard: {
    flexDirection: 'row',
    padding: Spacing.lg,
    gap: Spacing.lg,
  },
  statsItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  statsIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContent: {
    flex: 1,
  },
  statsValue: {
    fontSize: Typography.h4,
    marginBottom: 2,
  },
  statsLabel: {
    fontSize: Typography.caption,
  },
  statsDivider: {
    width: 1,
    marginVertical: Spacing.xs,
  },
  gridSection: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.jumbo,
  },
  placesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: Spacing.lg,
  },
  cardWrapper: {
    width: '48%',
    flexShrink: 0,
  },
  placeCard: {
    width: '100%',
    overflow: 'hidden',
  },
  placeImage: {
    height: 160,
    justifyContent: 'space-between',
    padding: Spacing.lg,
  },
  placeImageRadius: {
    borderTopLeftRadius: BorderRadius.xxxl,
    borderTopRightRadius: BorderRadius.xxxl,
  },
  placeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.sm,
  },
  placeBadgeText: {
    color: '#2B1F05',
    fontSize: Typography.small,
    letterSpacing: 0.4,
  },
  favoriteBtn: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    width: 36,
    height: 36,
    borderRadius: BorderRadius.lg,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeContent: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    gap: Spacing.sm,
  },
  placeTitle: {
    fontSize: Typography.h5,
  },
  placeDescription: {
    fontSize: Typography.caption,
    lineHeight: 18,
    opacity: 0.9,
  },
  placeMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  placePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  placePillText: {
    fontSize: Typography.caption,
  },
  placeRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: Typography.caption,
  },
  ratingCount: {
    fontSize: Typography.small,
  },
  placeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  priceLevel: {
    fontSize: Typography.caption,
  },
  openText: {
    fontSize: Typography.caption,
  },
});
