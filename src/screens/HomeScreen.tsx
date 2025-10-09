import React from 'react';
import {Ionicons} from '@expo/vector-icons';
import {useNavigation, CompositeNavigationProp} from '@react-navigation/native';
import {useQuery} from '@tanstack/react-query';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {GradientBackground} from '../components/ui/GradientBackground';
import {GlassCard} from '../components/ui/GlassCard';
import {NeoButton} from '../components/ui/NeoButton';
import {COLORS} from '../constants/theme';
import {getUserRoutes} from '../api/routes';
import {useAuthStore} from '../store/auth.store';

type HomeNav = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Home'>,
  NativeStackNavigationProp<AppStackParamList>
>;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeNav>();
  const isGuest = useAuthStore(state => state.isGuest);
  const {data: routes} = useQuery({
    queryKey: ['routes', 'recent'],
    queryFn: getUserRoutes,
    enabled: !isGuest,
  });

  const quickActions = [
    {
      id: 'wizard',
      title: 'Сгенерировать маршрут',
      icon: 'map' as const,
      onPress: () => navigation.navigate('RouteWizard'),
    },
    {
      id: 'agent',
      title: 'Задать вопрос агенту',
      icon: 'chatbubbles' as const,
      onPress: () => navigation.navigate('Agent'),
    },
    {
      id: 'places',
      title: 'Места поблизости',
      icon: 'location' as const,
      onPress: () => navigation.navigate('Places'),
    },
  ];

  return (
    <GradientBackground>
      <View style={styles.container}>
        <Text style={styles.greeting}>Привет! 👋</Text>
        <Text style={styles.headline}>
          Твой персональный гид по Москве готов к новым открытиям.
        </Text>
        <Text style={styles.registrationText}>хуй дамира</Text>

        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>Быстрые действия</Text>
          <View style={styles.actionsRow}>
            {quickActions.map(action => (
              <TouchableOpacity
                key={action.id}
                style={styles.actionButton}
                onPress={action.onPress}>
                <View style={styles.iconWrapper}>
                  <Ionicons name={action.icon} size={22} color={COLORS.surface} />
                </View>
                <Text style={styles.actionLabel}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </GlassCard>

        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>Создай маршрут в 10 шагов</Text>
          <Text style={styles.cardText}>
            Ответь на 10 вопросов — и получи атмосферный план дня с картой, точными адресами и
            советами.
          </Text>
          <NeoButton title="Начать мастер" onPress={() => navigation.navigate('RouteWizard')} />
        </GlassCard>

        <GlassCard style={[styles.card, {flex: 1}]}>
          <View style={styles.routesHeader}>
            <Text style={styles.cardTitle}>Сохранённые маршруты</Text>
            {!isGuest && (
              <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                <Text style={styles.link}>Смотреть все</Text>
              </TouchableOpacity>
            )}
          </View>
          {isGuest ? (
            <Text style={styles.empty}>
              Зарегистрируйся, чтобы сохранять маршруты и получать персональные рекомендации!
            </Text>
          ) : routes?.length ? (
            <View>
              {routes.slice(0, 5).map(item => (
                <TouchableOpacity
                  style={styles.routeItem}
                  onPress={() => navigation.navigate('RouteDetails', {routeId: item.id})}
                  key={item.id}>
                  <View>
                    <Text style={styles.routeTitle}>{item.title}</Text>
                    <Text style={styles.routeSubtitle}>
                      {new Date(item.created_at).toLocaleDateString('ru-RU', {
                        day: '2-digit',
                        month: 'long',
                      })}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" color={COLORS.textSecondary} size={20} />
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <Text style={styles.empty}>Пока нет маршрутов — начни новый прямо сейчас!</Text>
          )}
        </GlassCard>
      </View>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 24,
    gap: 24,
  },
  greeting: {
    color: COLORS.accentMint,
    fontFamily: 'Inter_500Medium',
    letterSpacing: 2,
  },
  headline: {
    color: COLORS.textPrimary,
    fontFamily: 'Unbounded_600SemiBold',
    fontSize: 28,
    lineHeight: 34,
  },
  card: {
    gap: 16,
  },
  cardTitle: {
    color: COLORS.textPrimary,
    fontFamily: 'Unbounded_600SemiBold',
    fontSize: 18,
  },
  cardText: {
    color: COLORS.textSecondary,
    fontFamily: 'Inter_400Regular',
    lineHeight: 20,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.25)',
    gap: 12,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: COLORS.accentMint,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionLabel: {
    color: COLORS.textPrimary,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
  },
  routesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  link: {
    color: COLORS.accentMint,
    fontFamily: 'Inter_500Medium',
  },
  routeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(148, 163, 184, 0.2)',
  },
  routeTitle: {
    color: COLORS.textPrimary,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
  },
  routeSubtitle: {
    color: COLORS.textSecondary,
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    marginTop: 4,
  },
  empty: {
    color: COLORS.textSecondary,
    fontFamily: 'Inter_400Regular',
  },
  registrationText: {
    color: COLORS.textSecondary,
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
});

export default HomeScreen;
