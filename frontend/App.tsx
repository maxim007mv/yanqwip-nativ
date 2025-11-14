import React, { useEffect } from 'react';
import { ActivityIndicator, LogBox, StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import {
  Unbounded_400Regular,
  Unbounded_600SemiBold,
  Unbounded_700Bold,
} from '@expo-google-fonts/unbounded';
import { useAuthStore } from './app/store/authStore';
import RootNavigator from './app/navigation/RootNavigator';
import { AppBackground } from './app/components/AppBackground';
import { Typography, Colors } from './app/lib/theme';

LogBox.ignoreAllLogs();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

export default function App() {
  const { loadStoredAuth } = useAuthStore();
  const [fontsLoaded, fontError] = useFonts({
    Unbounded_400Regular,
    Unbounded_600SemiBold,
    Unbounded_700Bold,
  });

  useEffect(() => {
    loadStoredAuth();
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      const TextComponent = Text as any;
      TextComponent.defaultProps = TextComponent.defaultProps || {};
      TextComponent.defaultProps.allowFontScaling = false;
      const baseStyle = StyleSheet.flatten(TextComponent.defaultProps.style) || {};
      TextComponent.defaultProps.style = [{ ...baseStyle, fontFamily: Typography.inter }];
    }
  }, [fontsLoaded]);

  // Показываем индикатор загрузки только если шрифты еще не загружены и нет ошибки
  // На веб-платформе продолжаем работу даже если шрифты не загрузились (fontfaceobserver timeout)
  const isWeb = typeof window !== 'undefined';
  if (!fontsLoaded && !fontError && !isWeb) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.dark.background }}>
            <ActivityIndicator size="large" color={Colors.dark.accent} />
          </View>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <View style={{ flex: 1 }}>
          <AppBackground />
          <QueryClientProvider client={queryClient}>
            <RootNavigator />
          </QueryClientProvider>
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
