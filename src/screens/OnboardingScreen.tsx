import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {AuthStackParamList} from '../types/navigation';
import {GradientBackground} from '../components/ui/GradientBackground';
import {GlassCard} from '../components/ui/GlassCard';
import {NeoButton} from '../components/ui/NeoButton';
import {useAuthStore} from '../store/auth.store';
import {COLORS} from '../constants/theme';

export const OnboardingScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const setGuest = useAuthStore(state => state.setGuest);

  const handleSkip = () => {
    setGuest(true);
  };

  return (
    <GradientBackground>
      <View style={styles.container}>
        <Text style={styles.tagline}>Yanwqip</Text>
        <Text style={styles.title}>Твой персональный гид по Москве</Text>
        <Text style={styles.subtitle}>
          Эксклюзивные маршруты, дружелюбный ИИ-агент, карта мест и стильный интерфейс с стеклянным
          сиянием.
        </Text>

        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>Что тебя ждёт</Text>
          <Text style={styles.cardText}>
            • 10 вопросов и готовый маршрут с картой • Живой чат с гидом на базе DeepSeek • Лучшие
            места Москвы по твоим фильтрам
          </Text>
        </GlassCard>

        <NeoButton title="Войти" onPress={() => navigation.navigate('Login')} />
        <NeoButton
          title="Создать аккаунт"
          variant="outline"
          onPress={() => navigation.navigate('Register')}
        />
        <Text style={styles.skipText} onPress={handleSkip}>
          Продолжить без регистрации
        </Text>
      </View>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 120,
    paddingBottom: 40,
    justifyContent: 'flex-end',
  },
  tagline: {
    fontFamily: 'Inter_500Medium',
    color: 'rgba(94, 234, 212, 0.8)',
    textTransform: 'uppercase',
    letterSpacing: 3,
    marginBottom: 12,
  },
  title: {
    fontFamily: 'Unbounded_600SemiBold',
    fontSize: 36,
    color: '#F9FAFB',
    lineHeight: 42,
    marginBottom: 16,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    color: 'rgba(249, 250, 251, 0.75)',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 36,
  },
  card: {
    marginBottom: 36,
  },
  cardTitle: {
    fontFamily: 'Unbounded_600SemiBold',
    fontSize: 18,
    color: '#F9FAFB',
    marginBottom: 12,
  },
  cardText: {
    fontFamily: 'Inter_400Regular',
    color: 'rgba(249, 250, 251, 0.8)',
    lineHeight: 22,
  },
  skipText: {
    color: COLORS.textSecondary,
    fontFamily: 'Inter_400Regular',
    marginTop: 16,
    textAlign: 'center',
  },
});

export default OnboardingScreen;
