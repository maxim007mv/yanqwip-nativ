import React from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/core';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { login, fetchCurrentUser } from '../../api/auth';
import { GradientBackground } from '../../components/ui/GradientBackground';
import { TextField } from '../../components/ui/TextField';
import { NeoButton } from '../../components/ui/NeoButton';
import { AuthStackParamList } from '../../types/navigation';
import { useAuthStore } from '../../store/auth.store';
import { COLORS } from '../../constants/theme';
import { resolveErrorMessage } from '../../utils/errors';

const schema = z.object({
  email: z.string().email('Введите корректный email'),
  password: z.string().min(6, 'Минимум 6 символов'),
});

type FormValues = z.infer<typeof schema>;

type LoginScreenNav = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNav>();
  const setTokens = useAuthStore((state) => state.setTokens);
  const setUser = useAuthStore((state) => state.setUser);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (values: FormValues) => {
      const token = await login(values.email, values.password);
      await setTokens(token.access_token, token.refresh_token);
      const user = await fetchCurrentUser();
      await setUser(user);
      return user;
    },
    onError: (error: unknown) => {
      const message = resolveErrorMessage(error, 'Не удалось выполнить вход');
      setError('root', { message });
    },
  });

  const onSubmit = (values: FormValues) => {
    void mutateAsync(values);
  };

  return (
    <GradientBackground>
      <View style={styles.container}>
        <Text style={styles.title}>С возвращением 👋</Text>
        <Text style={styles.subtitle}>Введи email и пароль, чтобы продолжить путешествие по Москве.</Text>

        <Controller
          control={control}
          name="email"
          render={({ field: { value, onChange } }) => (
            <TextField
              label="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={value}
              onChangeText={onChange}
              error={errors.email?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { value, onChange } }) => (
            <TextField
              label="Пароль"
              secureTextEntry
              value={value}
              onChangeText={onChange}
              error={errors.password?.message}
            />
          )}
        />

        {errors.root?.message ? <Text style={styles.formError}>{errors.root.message}</Text> : null}

        <NeoButton title="Войти" onPress={handleSubmit(onSubmit)} loading={isPending} />

        <Text style={styles.footerText}>
          Нет аккаунта?{' '}
          <Text style={styles.link} onPress={() => navigation.navigate('Register')}>
            Создать
          </Text>
        </Text>

        <Text style={styles.secondaryLink} onPress={() => navigation.navigate('Onboarding')}>
          Вернуться назад
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
  },
  title: {
    fontFamily: 'Unbounded_600SemiBold',
    fontSize: 32,
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 32,
  },
  formError: {
    color: COLORS.accentPink,
    fontFamily: 'Inter_400Regular',
    marginBottom: 16,
  },
  footerText: {
    fontFamily: 'Inter_400Regular',
    color: COLORS.textSecondary,
    marginTop: 24,
  },
  link: {
    color: COLORS.accentMint,
    fontFamily: 'Inter_500Medium',
  },
  secondaryLink: {
    color: COLORS.textSecondary,
    fontFamily: 'Inter_400Regular',
    marginTop: 32,
    textAlign: 'center',
  },
});

export default LoginScreen;
