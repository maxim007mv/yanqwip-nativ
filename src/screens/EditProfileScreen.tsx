import React, {useState} from 'react';
import {Alert, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {useNavigation} from '@react-navigation/native';
import {useForm, Controller} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {updateUser} from '../api/auth';
import {GradientBackground} from '../components/ui/GradientBackground';
import {NeoButton} from '../components/ui/NeoButton';
import {TextField} from '../components/ui/TextField';
import {COLORS} from '../constants/theme';
import {useAuthStore} from '../store/auth.store';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {AppStackParamList} from '../types/navigation';
import type {UserUpdate} from '../types/api';

const schema = z.object({
  full_name: z.string().min(1, 'Имя обязательно').max(255, 'Имя слишком длинное'),
  email: z.string().email('Некорректный email'),
});

type FormData = z.infer<typeof schema>;

export const EditProfileScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const {user, setUser} = useAuthStore();
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      full_name: user?.full_name || '',
      email: user?.email || '',
    },
  });

  const {mutateAsync, isPending} = useMutation({
    mutationFn: async (data: UserUpdate) => {
      const updatedUser = await updateUser(data);
      setUser(updatedUser);
      queryClient.invalidateQueries({queryKey: ['user']});
      return updatedUser;
    },
    onSuccess: () => {
      Alert.alert('Успех', 'Профиль обновлён');
      navigation.goBack();
    },
    onError: (error: any) => {
      Alert.alert('Ошибка', error?.response?.data?.detail || 'Не удалось обновить профиль');
    },
  });

  const onSubmit = (data: FormData) => {
    void mutateAsync(data);
  };

  return (
    <GradientBackground>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Редактировать профиль</Text>
        </View>

        <View style={styles.form}>
          <Controller
            control={control}
            name="full_name"
            render={({field: {onChange, value}}) => (
              <TextField
                label="Полное имя"
                value={value}
                onChangeText={onChange}
                error={errors.full_name?.message}
                placeholder="Введите ваше имя"
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({field: {onChange, value}}) => (
              <TextField
                label="Email"
                value={value}
                onChangeText={onChange}
                error={errors.email?.message}
                placeholder="Введите ваш email"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            )}
          />

          <NeoButton
            title="Сохранить"
            onPress={handleSubmit(onSubmit)}
            loading={isPending}
            style={styles.saveButton}
          />

          <NeoButton title="Отмена" variant="outline" onPress={() => navigation.goBack()} />
        </View>
      </ScrollView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontFamily: 'Unbounded_600SemiBold',
    color: COLORS.textPrimary,
    fontSize: 28,
    textAlign: 'center',
  },
  form: {
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.3)',
    padding: 24,
  },
  saveButton: {
    marginTop: 16,
  },
});

export default EditProfileScreen;
