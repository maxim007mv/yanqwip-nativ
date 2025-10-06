import React from 'react';
import { Alert, Linking, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMutation } from '@tanstack/react-query';
import { saveRoute } from '../api/routes';
import { GradientBackground } from '../components/ui/GradientBackground';
import { NeoButton } from '../components/ui/NeoButton';
import { RouteStepCard } from '../components/ui/RouteStepCard';
import { COLORS } from '../constants/theme';
import { buildRouteShareMessage } from '../utils/format';
import type { AppStackParamList } from '../types/navigation';
import type { GeneratedRoute } from '../types/api';
import { useAuthStore } from '../store/auth.store';

const defaultRegion = {
  latitude: 55.751244,
  longitude: 37.618423,
  latitudeDelta: 0.2,
  longitudeDelta: 0.2,
};

type ResultRouteProp = RouteProp<AppStackParamList, 'RouteResult'>;
type ResultNav = NativeStackNavigationProp<AppStackParamList>;

export const RouteResultScreen: React.FC = () => {
  const navigation = useNavigation<ResultNav>();
  const { params } = useRoute<ResultRouteProp>();
  const user = useAuthStore((state) => state.user);
  const routeData = params.route;

  const coordinates = routeData.steps
    .map((step) => step.coordinates)
    .filter((coord): coord is NonNullable<typeof coord> => Boolean(coord));

  const initialRegion = coordinates.length
    ? {
        latitude: coordinates[0].lat,
        longitude: coordinates[0].lon,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      }
    : defaultRegion;

  const { mutateAsync, isPending } = useMutation({
    mutationFn: saveRoute,
    onSuccess: () => {
      Alert.alert('Сохранено', 'Маршрут появился в разделе профиля');
      navigation.navigate('MainTabs');
    },
    onError: () => {
      Alert.alert('Ошибка', 'Не удалось сохранить маршрут. Попробуй ещё раз позже.');
    },
  });

  const handleSave = () => {
    const payload = {
      title: routeData.title,
      summary: routeData.summary,
      steps: routeData.steps,
      yandex_url: routeData.yandex_url,
      deepseek_raw: routeData.raw_response,
    };
    void mutateAsync(payload);
  };

  const handleShare = async () => {
    try {
      const message = buildRouteShareMessage(routeData);
      await Share.share({ message });
    } catch (error) {
      console.warn('Share error', error);
    }
  };

  const handleOpenYandex = () => {
    if (routeData.yandex_url) {
      void Linking.openURL(routeData.yandex_url);
    } else {
      Alert.alert('Нет ссылки', 'Ссылка на Яндекс.Карты отсутствует для этого маршрута.');
    }
  };

  return (
    <GradientBackground>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{routeData.title}</Text>
        {routeData.summary.intro ? <Text style={styles.subtitle}>{routeData.summary.intro}</Text> : null}

        <View style={styles.mapWrapper}>
          <MapView style={styles.map} initialRegion={initialRegion}>
            {coordinates.map((coord, index) => (
              <Marker
                key={`${coord.lat}-${coord.lon}-${index}`}
                coordinate={{ latitude: coord.lat, longitude: coord.lon }}
                title={routeData.steps[index]?.title}
              />
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

        <View style={styles.summaryBlock}>
          {routeData.summary.transport ? (
            <Text style={styles.summaryLine}>🚇 Транспорт: {routeData.summary.transport}</Text>
          ) : null}
          {routeData.summary.budget ? <Text style={styles.summaryLine}>💸 Бюджет: {routeData.summary.budget}</Text> : null}
          {routeData.summary.food ? <Text style={styles.summaryLine}>🍽 {routeData.summary.food}</Text> : null}
          {routeData.summary.tips ? <Text style={styles.summaryLine}>💡 Советы: {routeData.summary.tips}</Text> : null}
          {routeData.summary.weather_plan ? (
            <Text style={styles.summaryLine}>☔ План B: {routeData.summary.weather_plan}</Text>
          ) : null}
        </View>

        <View style={styles.timeline}>
          {routeData.steps.map((step, index) => (
            <RouteStepCard key={index.toString()} step={step} index={index} />
          ))}
        </View>

        <View style={styles.actions}>
          <NeoButton title="Сохранить маршрут" onPress={handleSave} loading={isPending} disabled={isPending} />
          <NeoButton title="Открыть в Яндекс.Картах" variant="outline" onPress={handleOpenYandex} />
          <NeoButton title="Поделиться" variant="pink" onPress={handleShare} />
        </View>

        <Text style={styles.footer}>
          {user?.full_name ? `${user.full_name}, ` : ''}приятных открытий! Маршрут можно найти в разделе профиля.
        </Text>
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
  title: {
    color: COLORS.textPrimary,
    fontFamily: 'Unbounded_600SemiBold',
    fontSize: 26,
    lineHeight: 32,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontFamily: 'Inter_400Regular',
    lineHeight: 20,
  },
  mapWrapper: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.35)',
  },
  map: {
    height: 260,
    width: '100%',
  },
  summaryBlock: {
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.25)',
    padding: 20,
    gap: 8,
  },
  summaryLine: {
    color: COLORS.textSecondary,
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
  },
  timeline: {
    gap: 12,
  },
  actions: {
    gap: 12,
  },
  footer: {
    color: COLORS.textSecondary,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
  },
});

export default RouteResultScreen;
