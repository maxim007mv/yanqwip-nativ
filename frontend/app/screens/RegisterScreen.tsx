import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/Button';
import { useUIStore } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';
import { authApi } from '@/api';
import { Colors, Typography, Spacing } from '@/lib/theme';
import { useNavigation } from '@react-navigation/native';

export default function RegisterScreen() {
  const { theme } = useUIStore();
  const { login } = useAuthStore();
  const navigation = useNavigation();
  const colors = theme === 'dark' ? Colors.dark : Colors.light;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Ошибка', 'Заполните все поля');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authApi.register({ name, email, password });
      // API возвращает { accessToken, refreshToken, expiresIn, user }
      await login(response.user, {
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        expiresIn: response.expiresIn,
      });
      // Навигация обработается автоматически через RootNavigator
    } catch (error: any) {
      Alert.alert('Ошибка регистрации', error.response?.data?.detail || error.response?.data?.message || 'Что-то пошло не так');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text1 }]}>Регистрация</Text>
        <TextInput
          placeholder="Имя"
          value={name}
          onChangeText={setName}
          style={[styles.input, { color: colors.text1, borderColor: colors.glassBorder }]}
        />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={[styles.input, { color: colors.text1, borderColor: colors.glassBorder }]}
        />
        <TextInput
          placeholder="Пароль"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={[styles.input, { color: colors.text1, borderColor: colors.glassBorder }]}
        />
        <Button 
          title={isLoading ? "Регистрация..." : "Зарегистрироваться"} 
          onPress={handleRegister}
          disabled={isLoading}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', padding: Spacing.xl, gap: Spacing.lg },
  title: { fontSize: Typography.h2, fontWeight: Typography.bold, textAlign: 'center', marginBottom: Spacing.xl },
  input: { borderWidth: 1, padding: Spacing.lg, borderRadius: 12, fontSize: Typography.body },
});
