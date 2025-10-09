import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {StatusBar} from 'expo-status-bar';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from '@expo-google-fonts/inter';
import {Unbounded_600SemiBold} from '@expo-google-fonts/unbounded';
import {RootNavigator} from './src/navigation/RootNavigator';
import {useAuthStore} from './src/store/auth.store';
import {fetchCurrentUser} from './src/api/auth';
import {COLORS} from './src/constants/theme';

const queryClient = new QueryClient();

const App = () => {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Unbounded_600SemiBold,
  });

  const {hydrate, isHydrated, accessToken, refreshToken, user, setUser, clear} = useAuthStore();

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!isHydrated || user || (!accessToken && !refreshToken)) {
      return;
    }
    (async () => {
      try {
        const profile = await fetchCurrentUser();
        await setUser(profile);
      } catch (error) {
        await clear();
      }
    })();
  }, [isHydrated, accessToken, refreshToken, user, setUser, clear]);

  if (!fontsLoaded || !isHydrated) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: COLORS.background,
        }}>
        <ActivityIndicator size="large" color={COLORS.accentMint} />
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="light" />
      <RootNavigator />
    </QueryClientProvider>
  );
};

export default App;
