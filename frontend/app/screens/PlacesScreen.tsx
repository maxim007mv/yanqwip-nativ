import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { ScreenShell } from '@/components/ScreenShell';
import { GlassCard } from '@/components/GlassCard';
import { useUIStore } from '@/store/uiStore';
import { Colors, Typography, Spacing, BorderRadius, Layout } from '@/lib/theme';
import { Place, PlaceCategory } from '@/lib/types';
import { placesApi } from '@/api';
import { MOCK_PLACES } from '@/mocks/data';

const CATEGORIES: { id: PlaceCategory; label: string; icon: string }[] = [
  { id: 'all', label: 'Все', icon: 'grid-outline' },
  { id: 'cafe', label: 'Кафе', icon: 'cafe-outline' },
  { id: 'park', label: 'Парки', icon: 'leaf-outline' },
  { id: 'museum', label: 'Музеи', icon: 'business-outline' },
  { id: 'restaurant', label: 'Рестораны', icon: 'restaurant-outline' },
  { id: 'romantic', label: 'Романтика', icon: 'heart-outline' },
];

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

export default function PlacesScreen() {
  const { theme } = useUIStore();
  const isDark = theme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;
  const queryClient = useQueryClient();

  const [selectedCategory, setSelectedCategory] = useState<PlaceCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: places = MOCK_PLACES, isLoading } = useQuery({
    queryKey: ['places', selectedCategory],
    queryFn: () => placesApi.getAll(selectedCategory),
    placeholderData: MOCK_PLACES,
  });

  // Загружаем список избранного
  const { data: favoriteIds = [] } = useQuery({
    queryKey: ['favorites'],
    queryFn: () => placesApi.getFavorites(),
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: placesApi.toggleFavorite,
    onSuccess: () => {
      // Обновляем и список мест, и список избранного
      queryClient.invalidateQueries({ queryKey: ['places'] });
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
    onError: () => {
      // Даже при ошибке API обновляем кеш из локального хранилища
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });

  const filteredPlaces = useMemo(() => {
    let result = places;
    
    // Применяем поиск
    if (searchQuery.trim()) {
      const lowered = searchQuery.trim().toLowerCase();
      result = result.filter(
        (place) =>
          place.title.toLowerCase().includes(lowered) ||
          place.area.toLowerCase().includes(lowered)
      );
    }
    
    // Добавляем информацию об избранном
    return result.map(place => ({
      ...place,
      isFavorite: favoriteIds.includes(place.id),
    }));
  }, [places, searchQuery, favoriteIds]);

  return (
    <ImageBackground
      source={require('@/assets/images/places_background.jpg')}
      style={[styles.container, { backgroundColor: colors.background }]}
      imageStyle={styles.backgroundImage}
      resizeMode="cover"
      blurRadius={8}
    >
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.shellWrapper}>
          <ScreenShell
            style={styles.shell}
            contentStyle={styles.shellContent}
          >
            <ScrollView
              showsVerticalScrollIndicator={false}
              bounces={false}
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
            >
              <View style={styles.headerSection}>
                <Text
                  style={[
                    styles.title,
                    { color: colors.text1, textShadowColor: colors.accentGlow },
                  ]}
                >
                  Лучшие места Москвы
                </Text>
                <Text
                  style={[
                    styles.subtitle,
                    { color: colors.text2, fontFamily: Typography.interMedium },
                  ]}
                >
                  Подборка заведений и локаций, которые любят жители города.
                </Text>
              </View>

              <View
                style={[
                  styles.stickySection,
                  { backgroundColor: isDark ? 'rgba(12,14,18,0.88)' : 'rgba(255,255,255,0.9)' },
                ]}
              >
                <GlassCard style={styles.searchCard} borderRadius="xxl">
                  <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color={colors.text3} />
                    <TextInput
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                      placeholder="Ресторан, парк, музей..."
                      placeholderTextColor={colors.text3}
                      style={[
                        styles.searchInput,
                        { color: colors.text1, fontFamily: Typography.interMedium },
                      ]}
                    />
                    <TouchableOpacity
                      activeOpacity={0.85}
                      style={styles.searchButton}
                    >
                      <LinearGradient
                        colors={[colors.accent, colors.accent2]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.searchButtonGradient}
                      >
                        <Text
                          style={[
                            styles.searchButtonText,
                            { fontFamily: Typography.interSemiBold },
                          ]}
                        >
                          Искать
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </GlassCard>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.categoriesScroll}
                >
                  {CATEGORIES.map((category) => {
                    const isActive = selectedCategory === category.id;
                    return (
                      <TouchableOpacity
                        key={category.id}
                        activeOpacity={0.88}
                        onPress={() => setSelectedCategory(category.id)}
                        style={[
                          styles.categoryChip,
                          {
                            backgroundColor: isActive
                              ? colors.accent
                              : colors.glassBg,
                            borderColor: isActive
                              ? colors.accent
                              : colors.glassBorder,
                          },
                        ]}
                      >
                        <Ionicons
                          name={category.icon as any}
                          size={18}
                          color={isActive ? '#2B1F05' : colors.text2}
                        />
                        <Text
                          style={[
                            styles.categoryText,
                            {
                              color: isActive ? '#2B1F05' : colors.text1,
                              fontFamily: isActive
                                ? Typography.interSemiBold
                                : Typography.interMedium,
                            },
                          ]}
                        >
                          {category.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>

              <View style={styles.gridSection}>
                {isLoading ? (
                  <Text
                    style={[
                      styles.loadingText,
                      { color: colors.text3, fontFamily: Typography.interMedium },
                    ]}
                  >
                    Загрузка...
                  </Text>
                ) : filteredPlaces.length === 0 ? (
                  <Text
                    style={[
                      styles.loadingText,
                      { color: colors.text3, fontFamily: Typography.interMedium },
                    ]}
                  >
                    Ничего не найдено
                  </Text>
                ) : (
                  <View style={styles.placesGrid}>
                    {filteredPlaces.map((place) => (
                      <PlaceCard
                        key={place.id}
                        place={place}
                        colors={colors}
                        onToggleFavorite={() =>
                          toggleFavoriteMutation.mutate(place.id)
                        }
                      />
                    ))}
                  </View>
                )}
              </View>
            </ScrollView>
          </ScreenShell>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

function PlaceCard({
  place,
  colors,
  onToggleFavorite,
}: {
  place: Place;
  colors: (typeof Colors)['dark'] | (typeof Colors)['light'];
  onToggleFavorite: () => void;
}) {
  return (
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
                ({place.reviewCount})
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
    fontFamily: Typography.orbitron,
    fontSize: Typography.h2,
  },
  subtitle: {
    fontSize: Typography.bodySmall,
    lineHeight: 22,
  },
  stickySection: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  searchCard: {
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  searchInput: {
    flex: 1,
    fontSize: Typography.body,
    paddingVertical: Spacing.sm,
  },
  searchButton: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  searchButtonGradient: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchButtonText: {
    color: '#2B1F05',
    fontSize: Typography.caption,
    letterSpacing: 0.3,
  },
  categoriesScroll: {
    gap: Spacing.sm,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginRight: Spacing.sm,
  },
  categoryText: {
    fontSize: Typography.caption,
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
  placeCard: {
    width: '48%',
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
  loadingText: {
    textAlign: 'center',
    fontSize: Typography.body,
    marginVertical: Spacing.xxxl,
  },
});
