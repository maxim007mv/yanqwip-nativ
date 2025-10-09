import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { fetchPlaces } from '../api/places';
import { GradientBackground } from '../components/ui/GradientBackground';
import { Chip } from '../components/ui/Chip';
import { COLORS } from '../constants/theme';
import type { Place } from '../types/api';

const DEFAULT_REGION = {
  latitude: 55.751244,
  longitude: 37.618423,
  latitudeDelta: 0.15,
  longitudeDelta: 0.15,
};

const TAG_OPTIONS = [
  { id: 'cafe', label: 'Кафе' },
  { id: 'park', label: 'Парки' },
  { id: 'museum', label: 'Музеи' },
  { id: 'bar', label: 'Бары' },
  { id: 'gallery', label: 'Галереи' },
];

export const PlacesScreen: React.FC = () => {
  const [region, setRegion] = useState(DEFAULT_REGION);
  const [searchValue, setSearchValue] = useState('');
  const [activeQuery, setActiveQuery] = useState<string | undefined>(undefined);
  const [selectedTags, setSelectedTags] = useState<string[]>(['cafe']);

  const queryKey = useMemo(
    () => ['places', region.latitude, region.longitude, selectedTags.join('-'), activeQuery ?? ''],
    [region.latitude, region.longitude, selectedTags, activeQuery]
  );

  const { data, isFetching } = useQuery({
    queryKey,
    queryFn: () =>
      fetchPlaces({
        query: activeQuery,
        lat: region.latitude,
        lon: region.longitude,
        radius: 1500,
        tags: selectedTags,
      }),
  });

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => {
      if (prev.includes(tag)) {
        return prev.filter((item) => item !== tag);
      }
      return [...prev, tag];
    });
  };

  const places: Place[] = data ?? [];

  return (
    <GradientBackground>
      <View style={styles.container}>
        <Text style={styles.title}>Лучшие места Москвы</Text>
        <Text style={styles.subtitle}>Фильтруй по интересам и изучай карту, чтобы открыть новые локации.</Text>

        <View style={styles.searchRow}>
          <TextInput
            style={styles.searchInput}
            placeholder="Что ищем?"
            placeholderTextColor="rgba(148, 163, 184, 0.6)"
            value={searchValue}
            onChangeText={setSearchValue}
            onSubmitEditing={() => setActiveQuery(searchValue.trim() || undefined)}
          />
          <TouchableOpacity style={styles.searchButton} onPress={() => setActiveQuery(searchValue.trim() || undefined)}>
            <Text style={styles.searchButtonText}>Искать</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tagRow}>
          {TAG_OPTIONS.map((tag) => (
            <Chip
              key={tag.id}
              label={tag.label}
              selected={selectedTags.includes(tag.id)}
              onPress={() => {
                toggleTag(tag.id);
              }}
            />
          ))}
        </View>

        <View style={styles.mapWrapper}>
          <MapView
            style={styles.map}
            region={region}
            onRegionChangeComplete={setRegion}
          >
            {places.map((place) => (
              <Marker
                key={`${place.latitude}-${place.longitude}`}
                coordinate={{ latitude: place.latitude, longitude: place.longitude }}
                title={place.title}
                description={place.address}
              />
            ))}
          </MapView>
          {isFetching ? (
            <View style={styles.loader}>
              <ActivityIndicator color={COLORS.accentMint} />
            </View>
          ) : null}
        </View>

        <FlatList
          data={places}
          keyExtractor={(item, index) => `${item.title}-${index}`}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.placeCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.placeTitle}>{item.title}</Text>
                <Text style={styles.placeSubtitle}>{item.address}</Text>
                {item.distance_m ? (
                  <Text style={styles.distance}>~{Math.round(item.distance_m / 100) / 10} км</Text>
                ) : null}
                {item.description ? <Text style={styles.description}>{item.description}</Text> : null}
              </View>
            </View>
          )}
        />
      </View>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 60,
  },
  title: {
    fontFamily: 'Unbounded_600SemiBold',
    color: COLORS.textPrimary,
    fontSize: 26,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    color: COLORS.textSecondary,
    marginTop: 8,
    marginBottom: 20,
  },
  searchRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.25)',
    color: COLORS.textPrimary,
    fontFamily: 'Inter_400Regular',
  },
  searchButton: {
    backgroundColor: COLORS.accentMint,
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  searchButtonText: {
    color: COLORS.surface,
    fontFamily: 'Inter_600SemiBold',
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  mapWrapper: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.25)',
    marginBottom: 16,
    height: 220,
  },
  map: {
    flex: 1,
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(17, 24, 39, 0.35)',
  },
  listContent: {
    paddingBottom: 120,
  },
  placeCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
    padding: 16,
    marginBottom: 12,
  },
  placeTitle: {
    fontFamily: 'Inter_600SemiBold',
    color: COLORS.textPrimary,
    fontSize: 16,
  },
  placeSubtitle: {
    fontFamily: 'Inter_400Regular',
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  distance: {
    fontFamily: 'Inter_500Medium',
    color: COLORS.accentMint,
    marginTop: 6,
  },
  description: {
    fontFamily: 'Inter_400Regular',
    color: COLORS.textSecondary,
    marginTop: 8,
    lineHeight: 18,
  },
});

export default PlacesScreen;
