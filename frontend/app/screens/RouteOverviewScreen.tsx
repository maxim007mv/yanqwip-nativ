import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Linking, Pressable, ActivityIndicator, TouchableOpacity, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useUIStore } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';
import { apiClient } from '@/api/client';
import { GlassCard } from '@/components/GlassCard';
import { ScreenShell } from '@/components/ScreenShell';
import { Colors, Typography, Spacing, BorderRadius, Layout } from '@/lib/theme';
import { Route, PlaceCategory } from '@/lib/types';

type RouteOverviewParams = {
  routeId: string;
  route?: Route;
};

export default function RouteOverviewScreen() {
  const { theme } = useUIStore();
  const { tokens } = useAuthStore();
  const navigation = useNavigation();
  const colors = theme === 'dark' ? Colors.dark : Colors.light;
  const isDark = theme === 'dark';
  const route = useRoute<RouteProp<{ params: RouteOverviewParams }, 'params'>>();
  const [routeData, setRouteData] = useState<Route | null>(route.params?.route || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('📍 RouteOverviewScreen mounted');
    console.log('📦 Route params:', route.params);
    console.log('📦 Route params.route:', route.params?.route);
    console.log('📦 Route params.routeId:', route.params?.routeId);
    
    if (route.params?.route) {
      console.log('✅ Маршрут получен из params');
      console.log('📋 Title:', route.params.route.title);
      console.log('📋 Steps count:', route.params.route.steps?.length);
      setRouteData(route.params.route);
    } else if (route.params?.routeId) {
      console.log('🔄 Загружаем маршрут по ID:', route.params.routeId);
      loadRouteById(route.params.routeId);
    } else {
      console.log('❌ Маршрут НЕ получен из params!');
    }
  }, [route.params]);

  const loadRouteById = async (routeId: string) => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/routes/${routeId}`);
      const data = response.data;
      
      console.log('✅ Маршрут загружен из API:', data.title);
      
      // Преобразуем данные в формат Route
      const summaryData = typeof data.summary === 'string' ? JSON.parse(data.summary) : data.summary;
      const stepsData = typeof data.steps_json === 'string' ? JSON.parse(data.steps_json) : data.steps;
      
      const routeObj: Route = {
        id: data.id.toString(),
        title: data.title,
        summary: summaryData?.intro || '',
        tags: [],
        steps: stepsData.map((step: any, index: number) => ({
          id: step.id || `step_${index}`,
          title: step.title,
          description: step.description,
          address: step.address || '',
          category: 'cafe' as PlaceCategory,
          duration: step.duration_minutes || 60,
          coordinates: step.coordinates,
          order: index,
        })),
        tips: Array.isArray(summaryData?.tips) 
          ? summaryData.tips 
          : summaryData?.tips 
            ? [summaryData.tips] 
            : [],
        totalDuration: stepsData.reduce((sum: number, s: any) => sum + (s.duration_minutes || 60), 0),
        city: data.city || 'Москва',
        createdAt: data.created_at,
        userId: data.user_id?.toString() || '',
        isPublic: data.is_public || false,
        yandexUrl: data.yandex_url,
      };
      
      setRouteData(routeObj);
    } catch (error) {
      console.error('❌ Ошибка загрузки маршрута:', error);
      alert('Не удалось загрузить маршрут');
    } finally {
      setLoading(false);
    }
  };

  if (!routeData) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={[styles.loadingText, { color: colors.text2 }]}>
            {loading ? 'Загрузка маршрута...' : 'Маршрут не найден'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Теперь routeData гарантированно не null
  const currentRoute = routeData;

  const openYandexMaps = () => {
    if (currentRoute.yandexUrl) {
      Linking.openURL(currentRoute.yandexUrl);
    }
  };

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  const goToNextStep = () => {
    if (currentStepIndex < currentRoute.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const saveRoute = async () => {
    if (!tokens?.accessToken) {
      alert('Необходимо войти в систему для сохранения маршрута');
      return;
    }
    
    try {
      // Подготавливаем данные в формате, который ожидает backend
      const saveData = {
        title: currentRoute.title,
        summary: {
          intro: currentRoute.summary || '',
          tips: currentRoute.tips?.join('. ') || '',
        },
        steps: currentRoute.steps.map(step => ({
          title: step.title,
          description: step.description,
          address: step.address || '',
          duration_minutes: step.duration || 60,
          coordinates: step.coordinates || null,
        })),
        yandex_url: currentRoute.yandexUrl || null,
        deepseek_raw: JSON.stringify(currentRoute),
      };

      await apiClient.post('/routes/save', saveData);
      alert('Маршрут успешно сохранен в истории!');
    } catch (error: any) {
      console.error('Ошибка при сохранении маршрута:', error);
      const errorMessage = error.response?.data?.detail || error.message || 'Не удалось сохранить маршрут';
      alert(errorMessage);
    }
  };

  const goToHome = () => {
    // @ts-ignore
    navigation.navigate('Main', { screen: 'Home' });
  };

  return (
    <ImageBackground
      source={require('@/assets/images/profile_background.jpg')}
      style={[styles.container, { backgroundColor: colors.background }]}
      imageStyle={styles.backgroundImage}
      resizeMode="cover"
    >
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Заголовок с кнопкой возврата */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={goToHome}
            style={[styles.backButton, { backgroundColor: colors.glassBg }]}
            activeOpacity={0.8}
          >
            <Ionicons name="home-outline" size={24} color={colors.text1} />
          </TouchableOpacity>
          <Text
            style={[
              styles.headerTitle,
              { color: colors.text1, fontFamily: Typography.unbounded },
            ]}
          >
            Маршрут готов!
          </Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={[
            styles.content,
            { paddingBottom: Layout.dockOffset + 140 },
          ]}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <ScreenShell>
            <Text style={[styles.title, { color: colors.text1, fontFamily: Typography.unbounded }]}>
              {currentRoute.title}
            </Text>
        
        {/* Кнопка сохранения маршрута */}
        <TouchableOpacity 
          style={[styles.saveButton, { backgroundColor: colors.accent }]}
          onPress={saveRoute}
        >
          <Text style={[styles.saveButtonText, { color: colors.background }]}>
            💾 Сохранить маршрут
          </Text>
        </TouchableOpacity>
        
        {currentRoute.summary && (
          <GlassCard style={styles.summaryCard}>
            <Text style={[styles.summaryText, { color: colors.text2 }]}>
              {currentRoute.summary}
            </Text>
          </GlassCard>
        )}

        {currentRoute.yandexUrl && (
          <Pressable 
            style={[styles.mapButton, { backgroundColor: colors.accent }]} 
            onPress={openYandexMaps}
          >
            <Text style={[styles.mapButtonText, { color: colors.background }]}>
              🗺️ Открыть в Яндекс.Картах
            </Text>
          </Pressable>
        )}

        <Text style={[styles.sectionTitle, { color: colors.text1 }]}>
          Шаги маршрута
        </Text>

        {/* Навигация по шагам */}
        <View style={styles.stepsNavigation}>
          <TouchableOpacity 
            style={[
              styles.navButton, 
              { backgroundColor: colors.accent, opacity: currentStepIndex > 0 ? 1 : 0.5 }
            ]} 
            onPress={goToPreviousStep}
            disabled={currentStepIndex === 0}
          >
            <Text style={styles.navButtonText}>⬅️ Назад</Text>
          </TouchableOpacity>
          
          <Text style={[styles.stepIndicator, { color: colors.text2 }]}>
            {currentStepIndex + 1} / {currentRoute.steps.length}
          </Text>
          
          <TouchableOpacity 
            style={[
              styles.navButton, 
              { 
                backgroundColor: colors.accent, 
                opacity: currentStepIndex < currentRoute.steps.length - 1 ? 1 : 0.5 
              }
            ]} 
            onPress={goToNextStep}
            disabled={currentStepIndex === currentRoute.steps.length - 1}
          >
            <Text style={styles.navButtonText}>Далее ➡️</Text>
          </TouchableOpacity>
        </View>

        {/* Текущий шаг */}
        <GlassCard key={currentRoute.steps[currentStepIndex].id} style={styles.stepCard}>
          <View style={styles.stepHeader}>
            <View style={[styles.stepNumber, { backgroundColor: colors.accent }]}>
              <Text style={[styles.stepNumberText, { color: colors.background }]}>
                {currentStepIndex + 1}
              </Text>
            </View>
            <Text style={[styles.stepTitle, { color: colors.text1 }]}>
              {currentRoute.steps[currentStepIndex].title}
            </Text>
          </View>
          
          <Text style={[styles.stepDescription, { color: colors.text2 }]}>
            {currentRoute.steps[currentStepIndex].description}
          </Text>
          
          {currentRoute.steps[currentStepIndex].address && (
            <Text style={[styles.stepAddress, { color: colors.text3 }]}>
              📍 {currentRoute.steps[currentStepIndex].address}
            </Text>
          )}
          
          {currentRoute.steps[currentStepIndex].duration && (
            <Text style={[styles.stepDuration, { color: colors.text3 }]}>
              ⏱️ {currentRoute.steps[currentStepIndex].duration} минут
            </Text>
          )}
        </GlassCard>

        {currentRoute.tips && currentRoute.tips.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { color: colors.text1 }]}>
              Полезные советы
            </Text>
            {currentRoute.tips.map((tip, index) => (
              tip && (
                <GlassCard key={index} style={styles.tipCard}>
                  <Text style={[styles.tipText, { color: colors.text2 }]}>
                    💡 {tip}
                  </Text>
                </GlassCard>
              )
            ))}
          </>
        )}
          </ScreenShell>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    opacity: 0.4,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: Typography.h3,
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  stepsNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
    paddingHorizontal: 10,
  },
  navButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  navButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  stepIndicator: {
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  scrollView: { 
    flex: 1,
  },
  content: { 
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: Spacing.lg, fontSize: Typography.body },
  title: { 
    fontSize: Typography.h1, 
    fontWeight: Typography.bold, 
    marginBottom: Spacing.xl,
    textAlign: 'center'
  },
  summaryCard: { marginBottom: Spacing.lg, padding: Spacing.lg },
  summaryText: { fontSize: Typography.body, lineHeight: 24 },
  mapButton: {
    padding: Spacing.lg,
    borderRadius: 12,
    marginBottom: Spacing.xl,
    alignItems: 'center',
  },
  mapButtonText: { fontSize: Typography.h4, fontWeight: Typography.semiBold },
  sectionTitle: {
    fontSize: Typography.h3,
    fontWeight: Typography.bold,
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  stepCard: { marginBottom: Spacing.lg, padding: Spacing.lg },
  stepHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.md },
  stepNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  stepNumberText: { fontSize: Typography.h4, fontWeight: Typography.bold },
  stepTitle: { 
    flex: 1, 
    fontSize: Typography.h4, 
    fontWeight: Typography.semiBold 
  },
  stepDescription: { 
    fontSize: Typography.body, 
    lineHeight: 22, 
    marginBottom: Spacing.sm 
  },
  stepAddress: { fontSize: Typography.small, marginTop: Spacing.xs },
  stepDuration: { fontSize: Typography.small, marginTop: Spacing.xs },
  tipCard: { marginBottom: Spacing.md, padding: Spacing.md },
  tipText: { fontSize: Typography.body, lineHeight: 22 },
});
