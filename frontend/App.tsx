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
  const [fontsLoaded] = useFonts({
    'Inter-Regular': require('./app/assets/fonts/Inter-Regular.ttf'),
    'Inter-Medium': require('./app/assets/fonts/Inter-Medium.ttf'),
    'Inter-SemiBold': require('./app/assets/fonts/Inter-SemiBold.ttf'),
    'Inter-Bold': require('./app/assets/fonts/Inter-Bold.ttf'),
    'Inter-ExtraBold': require('./app/assets/fonts/Inter-ExtraBold.ttf'),
    'Orbitron-Medium': require('./app/assets/fonts/Orbitron-Medium.ttf'),
    'Orbitron-SemiBold': require('./app/assets/fonts/Orbitron-SemiBold.ttf'),
    'Orbitron-Bold': require('./app/assets/fonts/Orbitron-Bold.ttf'),
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
