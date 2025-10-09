import React from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {logout as logoutRequest} from '../api/auth';
import {getUserRoutes} from '../api/routes';
import {GradientBackground} from '../components/ui/GradientBackground';
import {NeoButton} from '../components/ui/NeoButton';
import {COLORS} from '../constants/theme';
import {useAuthStore} from '../store/auth.store';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {AppStackParamList} from '../types/navigation';

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const {user, refreshToken, clear, isGuest} = useAuthStore();
  const {width} = useWindowDimensions();
  const isSmallScreen = width < 375;

  const queryClient = useQueryClient();

  const {data: routes, refetch} = useQuery({
    queryKey: ['routes', 'profile'],
    queryFn: getUserRoutes,
  });

  const {mutateAsync, isPending} = useMutation({
    mutationFn: async () => {
      if (refreshToken) {
        await logoutRequest(refreshToken);
      }
      queryClient.clear();
      await clear();
    },
    onSuccess: () => {
      Alert.alert('До встречи', 'Мы очистили твой сеанс. Ждём тебя снова!');
    },
  });

  const handleLogout = () => {
    void mutateAsync();
  };

  return (
    <GradientBackground>
      <ScrollView
        contentContainerStyle={[styles.container, isSmallScreen && styles.containerSmall]}>
        <View style={[styles.headerCard, isSmallScreen && styles.headerCardSmall]}>
          <Text style={[styles.title, isSmallScreen && styles.titleSmall]}>
            {user?.full_name || (isGuest ? 'Гость Yanqwip' : 'Пользователь')}
          </Text>
          <Text style={styles.subtitle}>
            {user?.email || (isGuest ? 'Зарегистрируйтесь для сохранения данных' : '')}
          </Text>
          {user?.created_at ? (
            <Text style={styles.meta}>
              С нами с{' '}
              {new Date(user.created_at).toLocaleDateString('ru-RU', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
            </Text>
          ) : null}
          <NeoButton
            title="Редактировать"
            variant="outline"
            onPress={() => navigation.navigate('EditProfile')}
            style={styles.editButton}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Мои маршруты</Text>
          {isGuest ? (
            <Text style={styles.placeholder}>
              Зарегистрируйтесь, чтобы сохранять маршруты и получать персональные рекомендации!
            </Text>
          ) : routes?.length ? (
            routes.map(route => (
              <TouchableOpacity
                key={route.id}
                style={styles.routeRow}
                onPress={() => navigation.navigate('RouteDetails', {routeId: route.id})}>
                <View>
                  <Text style={styles.routeTitle}>{route.title}</Text>
                  <Text style={styles.routeDate}>
                    {new Date(route.created_at).toLocaleDateString('ru-RU', {
                      day: '2-digit',
                      month: 'short',
                    })}
                  </Text>
                </View>
                <Text style={styles.routeLink}>Открыть</Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.placeholder}>
              Маршрутов пока нет. Сгенерируй первый прямо сейчас!
            </Text>
          )}
        </View>

        <NeoButton title="Обновить список" variant="outline" onPress={() => void refetch()} />
        {!isGuest && (
          <NeoButton title="Выйти" variant="pink" onPress={handleLogout} loading={isPending} />
        )}
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
  headerCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.3)',
    padding: 24,
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
  },
  meta: {
    fontFamily: 'Inter_500Medium',
    color: COLORS.accentMint,
    marginTop: 12,
  },
  section: {
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.25)',
    padding: 20,
    gap: 16,
  },
  sectionTitle: {
    fontFamily: 'Unbounded_600SemiBold',
    color: COLORS.textPrimary,
    fontSize: 20,
  },
  routeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(148, 163, 184, 0.2)',
  },
  routeTitle: {
    fontFamily: 'Inter_600SemiBold',
    color: COLORS.textPrimary,
    fontSize: 16,
  },
  routeDate: {
    fontFamily: 'Inter_400Regular',
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  routeLink: {
    fontFamily: 'Inter_500Medium',
    color: COLORS.accentMint,
  },
  placeholder: {
    fontFamily: 'Inter_400Regular',
    color: COLORS.textSecondary,
  },
  containerSmall: {
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  headerCardSmall: {
    padding: 16,
    borderRadius: 16,
  },
  titleSmall: {
    fontSize: 22,
  },
  editButton: {
    marginTop: 16,
  },
});

export default ProfileScreen;
