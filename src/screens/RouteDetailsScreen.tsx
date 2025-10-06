import React from 'react';
import { Alert, Linking, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { getRouteById } from '../api/routes';
import { GradientBackground } from '../components/ui/GradientBackground';
import { NeoButton } from '../components/ui/NeoButton';
import { RouteStepCard } from '../components/ui/RouteStepCard';
import { COLORS } from '../constants/theme';
import { buildRouteShareMessage } from '../utils/format';
import type { AppStackParamList } from '../types/navigation';

const defaultRegion = {
  latitude: 55.751244,
  longitude: 37.618423,
  latitudeDelta: 0.15,
  longitudeDelta: 0.15,
};

type DetailsRouteProp = RouteProp<AppStackParamList, 'RouteDetails'>;

export const RouteDetailsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { params } = useRoute<DetailsRouteProp>();

  const { data, isLoading } = useQuery({
    queryKey: ['route', params.routeId],
    queryFn: () => getRouteById(params.routeId),
  });

  if (isLoading || !data) {
    return (
      <GradientBackground>
        <View style={styles.loader}>
          <Text style={styles.loaderText}>Загружаем маршрут...</Text>
        </View>
      </GradientBackground>
    );
  }

  const coordinates = data.steps
    .map((step) => step.coordinates)
    .filter((coords): coords is NonNullable<typeof coords> => Boolean(coords));

  const region = coordinates.length
    ? {
        latitude: coordinates[0].lat,
        longitude: coordinates[0].lon,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      }
    : defaultRegion;

  const handleShare = async () => {
    try {
      const message = buildRouteShareMessage({ ...data, route_id: String(data.id), created_at: data.created_at, raw_response: data.raw_response ?? '' });
      await Share.share({ message });
    } catch (error) {
      console.warn('Share error', error);
    }
  };

  const handleOpenYandex = () => {
    if (data.yandex_url) {
      void Linking.openURL(data.yandex_url);
    } else {
      Alert.alert('Нет ссылки', 'Ссылка на Яндекс.Карты отсутствует.');
    }
  };

  return (
    <GradientBackground>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{data.title}</Text>
        <Text style={styles.meta}>
          Создан {new Date(data.created_at).toLocaleDateString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' })}
        </Text>

        <View style={styles.mapWrapper}>
          <MapView style={styles.map} initialRegion={region}>
            {coordinates.map((coord, index) => (
              <Marker key={`${coord.lat}-${coord.lon}-${index}`} coordinate={{ latitude: coord.lat, longitude: coord.lon }} title={data.steps[index]?.title} />
            ))}
            {coordinates.length > 1 ? (
              <Polyline
                coordinates={coordinates.map((coord) => ({ latitude: coord.lat, longitude: coord.lon }))}
                strokeColor={COLORS.accentMint}
                strokeWidth={4}
              />
            ) : null}
          </MapView>
        </View>

        <View style={styles.summaryCard}>
          {data.summary.transport ? <Text style={styles.summaryLine}>🚇 {data.summary.transport}</Text> : null}
          {data.summary.budget ? <Text style={styles.summaryLine}>💸 {data.summary.budget}</Text> : null}
          {data.summary.food ? <Text style={styles.summaryLine}>🍽 {data.summary.food}</Text> : null}
          {data.summary.tips ? <Text style={styles.summaryLine}>💡 {data.summary.tips}</Text> : null}
          {data.summary.weather_plan ? <Text style={styles.summaryLine}>☔ {data.summary.weather_plan}</Text> : null}
        </View>

        <View style={styles.timeline}>
          {data.steps.map((step, index) => (
            <RouteStepCard key={index.toString()} step={step} index={index} />
          ))}
        </View>

        <NeoButton title="Открыть в Яндекс.Картах" variant="outline" onPress={handleOpenYandex} />
        <NeoButton title="Поделиться" variant="pink" onPress={handleShare} />
        <NeoButton title="Назад" onPress={() => navigation.goBack()} />
      </ScrollView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
    gap: 24,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    color: COLORS.textSecondary,
    fontFamily: 'Inter_400Regular',
  },
  title: {
    fontFamily: 'Unbounded_600SemiBold',
    color: COLORS.textPrimary,
    fontSize: 26,
  },
  meta: {
    fontFamily: 'Inter_400Regular',
    color: COLORS.textSecondary,
  },
  mapWrapper: {
    height: 220,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.25)',
  },
  map: {
    flex: 1,
  },
  summaryCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.25)',
    padding: 20,
    gap: 8,
  },
  summaryLine: {
    fontFamily: 'Inter_400Regular',
    color: COLORS.textSecondary,
  },
  timeline: {
    gap: 12,
  },
});

export default RouteDetailsScreen;
