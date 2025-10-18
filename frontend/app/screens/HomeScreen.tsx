import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { NavigatorScreenParams, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/Button';
import { useUIStore } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';
import { Colors, Typography, Spacing, BorderRadius, Layout } from '@/lib/theme';
import { MainTabParamList, RootStackParamList } from '@/navigation/RootNavigator';
import { ScreenShell } from '@/components/ScreenShell';

type NavigationProp = StackNavigationProp<RootStackParamList>;

const { width } = Dimensions.get('window');

const QUICK_ACTIONS = [
  {
    id: 'generate',
    title: 'Сгенерировать\nмаршрут',
    icon: 'compass',
    onPress: 'generate',
  },
  {
    id: 'agent',
    title: 'Задать вопрос\nагенту',
    icon: 'message-circle',
    onPress: 'agent',
  },
  {
    id: 'places',
    title: 'Места\nпоблизости',
    icon: 'map-pin',
    onPress: 'places',
  },
] as const;

const POPULAR_ROUTES = [
  {
    id: 'romantic',
    title: 'Романтический вечер в центре',
    description: 'Прогулка по Арбату, ужин и закат на набережной.',
    badge: '🔥 Топ',
    image:
      'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1600&auto=format&fit=crop',
    meta: '3 ч · 5 мест',
    rating: '⭐ 4.9 (124)',
  },
  {
    id: 'coffee',
    title: 'Кофейный тур по Москве',
    description: 'Лучшие кофейни — от классики до авторских.',
    badge: 'Новинка',
    image:
      'https://images.unsplash.com/photo-1537202108838-e7072bad1927?q=80&w=1600&auto=format&fit=crop',
    meta: '4 ч · 6 мест',
    rating: '⭐ 4.7 (89)',
  },
  {
    id: 'family',
    title: 'Выходные с детьми',
    description: 'Парки, музеи и безопасные активности.',
    badge: 'Семейный',
    image:
      'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1600&auto=format&fit=crop',
    meta: '5 ч · 4 места',
    rating: '⭐ 4.8 (156)',
  },
  {
    id: 'history',
    title: 'По следам истории',
    description: 'От Кремля до авангарда.',
    badge: 'История',
    image:
      'https://images.unsplash.com/photo-1535398089889-dd807df1dfc3?q=80&w=1600&auto=format&fit=crop',
    meta: '6 ч · 7 мест',
    rating: '⭐ 4.6 (78)',
  },
];

const TREND_ROUTES = [
  {
    id: 'night',
    title: 'Ночная Москва',
    subtitle: 'Клубы и бары',
    image: 'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?q=80&w=1600&auto=format&fit=crop',
    trend: '🔥 +127%',
  },
  {
    id: 'food',
    title: 'Гастрономический тур',
    subtitle: 'Новые рестораны',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1600&auto=format&fit=crop',
    trend: '📈 +89%',
  },
  {
    id: 'art',
    title: 'Арт-галереи',
    subtitle: 'Современное искусство',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=1600&auto=format&fit=crop',
    trend: '🎨 +65%',
  },
];

interface MyRouteCard {
  id: string;
  tag: string;
  title: string;
  image: string;
}

const INITIAL_MY_ROUTES: MyRouteCard[] = [
  {
    id: 'romance',
    tag: 'Романтика',
    title: 'Огни вечерней Москвы',
    image:
      'https://images.unsplash.com/photo-1497302347632-904729bc24aa?q=80&w=1600&auto=format&fit=crop',
  },
  {
    id: 'coffee',
    tag: 'Кафе',
    title: 'Кофейный заплыв по центру',
    image:
      'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?q=80&w=1600&auto=format&fit=crop',
  },
  {
    id: 'museum',
    tag: 'Музеи',
    title: 'Искусство в сердце города',
    image:
      'https://images.unsplash.com/photo-1533000971552-6a962ff0b9d5?q=80&w=1600&auto=format&fit=crop',
  },
  {
    id: 'parks',
    tag: 'Парки',
    title: 'Зелёный отдых',
    image:
      'https://images.unsplash.com/photo-1520680219902-886dc4854886?q=80&w=1600&auto=format&fit=crop',
  },
  {
    id: 'history',
    tag: 'История',
    title: 'По следам прошлого',
    image:
      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?q=80&w=1600&auto=format&fit=crop',
  },
  {
    id: 'photo',
    tag: 'Фотосессия',
    title: 'Лучшие виды Москвы',
    image:
      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?q=80&w=1600&auto=format&fit=crop',
  },
];

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { theme } = useUIStore();
  const { user } = useAuthStore();
  const isDark = theme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  const [routes, setRoutes] = useState<MyRouteCard[]>(INITIAL_MY_ROUTES);
  const [toastMessage, setToastMessage] = useState('Сообщение');
  const toastOpacity = useRef(new Animated.Value(0)).current;
  const toastTranslate = useRef(new Animated.Value(16)).current;
  const toastTimer = useRef<NodeJS.Timeout | null>(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    return () => {
      if (toastTimer.current) {
        clearTimeout(toastTimer.current);
      }
    };
  }, []);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);

    Animated.parallel([
      Animated.timing(toastOpacity, {
        toValue: 1,
        duration: 180,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(toastTranslate, {
        toValue: 0,
        duration: 180,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    if (toastTimer.current) {
      clearTimeout(toastTimer.current);
    }

    toastTimer.current = setTimeout(() => {
      Animated.parallel([
        Animated.timing(toastOpacity, {
          toValue: 0,
          duration: 180,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(toastTranslate, {
          toValue: 16,
          duration: 180,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }, 2400);
  };

  const handleActionPress = (action: (typeof QUICK_ACTIONS)[number]) => {
    const navigateToTab = (screen: keyof MainTabParamList) => {
      navigation.navigate('Main', { screen } as NavigatorScreenParams<MainTabParamList>);
    };

    switch (action.onPress) {
      case 'generate':
        showToast('Генерация маршрута…');
        setTimeout(() => {
          navigation.navigate('Wizard');
        }, 260);
        break;
      case 'agent':
        navigateToTab('Agent');
        break;
      case 'places':
        navigateToTab('Places');
        break;
      default:
        showToast('Скоро');
    }
  };

  const handleAddRoute = () => {
    const seed = Math.floor(Math.random() * 1000);
    const newRoute: MyRouteCard = {
      id: `new-${Date.now()}`,
      tag: 'Новое',
      title: `Маршрут #${routes.length + 1}`,
      image: `https://source.unsplash.com/random/800x800/?moscow,night,${seed}`,
    };
    setRoutes((prev) => [newRoute, ...prev]);
    showToast('Новый маршрут добавлен!');
  };

  const greetName = useMemo(
    () => user?.name || 'Путешественник',
    [user?.name]
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <Animated.ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Layout.dockOffset + 140 },
          ]}
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          <ScreenShell>
            <View style={styles.hero}>
              <View style={styles.heroRow}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('Wizard');
                    showToast('Готовим новый маршрут…');
                  }}
                  activeOpacity={0.85}
                  style={[
                    styles.chip,
                    {
                      borderColor: colors.glassBorder,
                      backgroundColor: colors.glassBg,
                    },
                  ]}
                >
                  <Feather name="plus" size={18} color={colors.text2} />
                  <Text
                    style={[
                      styles.chipText,
                      { color: colors.text1, fontFamily: Typography.interSemiBold },
                    ]}
                  >
                    Маршрут
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => showToast('Фильтры скоро будут')}
                  activeOpacity={0.85}
                  style={[
                    styles.chip,
                    {
                      borderColor: colors.glassBorder,
                      backgroundColor: colors.glassBg,
                    },
                  ]}
                >
                  <Feather name="sliders" size={18} color={colors.text2} />
                  <Text
                    style={[
                      styles.chipText,
                      { color: colors.text1, fontFamily: Typography.interSemiBold },
                    ]}
                  >
                    Фильтры
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.greet}>
                <Text
                  style={[
                    styles.greetTitle,
                    {
                      color: colors.text1,
                    },
                  ]}
                >
                  Привет, {greetName}! 👋
                </Text>
                <Text
                  style={[
                    styles.greetSubtitle,
                    { color: colors.text2, fontFamily: Typography.interMedium },
                  ]}
                >
                  Твой персональный гид по Москве готов к новым открытиям.
                </Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text
                style={[
                  styles.sectionTitle,
                  { color: colors.text1, textShadowColor: colors.accentGlow },
                ]}
              >
                Быстрые действия
              </Text>
              <View style={styles.actions}>
                {QUICK_ACTIONS.map((action) => (
                  <GlassCard key={action.id} style={styles.actionCard} borderRadius="xxl">
                    <TouchableOpacity
                      activeOpacity={0.9}
                      style={styles.actionContent}
                      onPress={() => handleActionPress(action)}
                    >
                      <LinearGradient
                        colors={[colors.accent, colors.accent2]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.actionIcon}
                      >
                        <Feather name={action.icon as any} size={24} color="#2B1F05" />
                      </LinearGradient>
                      <Text
                        style={[
                          styles.actionText,
                          { color: colors.text1, fontFamily: Typography.interSemiBold },
                        ]}
                      >
                        {action.title}
                      </Text>
                    </TouchableOpacity>
                  </GlassCard>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text
                style={[
                  styles.sectionTitle,
                  { color: colors.text1, textShadowColor: colors.accentGlow },
                ]}
              >
                Популярные маршруты недели
              </Text>
              <View style={styles.popularGrid}>
                {POPULAR_ROUTES.map((route) => (
                  <GlassCard key={route.id} style={styles.popularCard} borderRadius="xxl">
                    <TouchableOpacity
                      activeOpacity={0.88}
                      onPress={() => showToast('Маршрут открыт')}
                      style={styles.popularTouchable}
                    >
                      <ImageBackground
                        source={{ uri: route.image }}
                        style={styles.popularImage}
                        imageStyle={styles.popularImageRadius}
                      >
                        <LinearGradient
                          colors={[
                            'rgba(0, 0, 0, 0.45)',
                            'rgba(0, 0, 0, 0.1)',
                            'rgba(0, 0, 0, 0.55)',
                          ]}
                          start={{ x: 0.2, y: 0 }}
                          end={{ x: 0.8, y: 1 }}
                          style={StyleSheet.absoluteFill}
                        />
                        <View
                          style={[
                            styles.popularBadge,
                            { backgroundColor: colors.accent },
                          ]}
                        >
                          <Text
                            style={[
                              styles.popularBadgeText,
                              { color: '#2B1F05', fontFamily: Typography.interBold },
                            ]}
                          >
                            {route.badge}
                          </Text>
                        </View>
                      </ImageBackground>

                      <View style={styles.popularContent}>
                        <Text
                          style={[
                            styles.popularTitle,
                            { color: colors.text1, fontFamily: Typography.interBold },
                          ]}
                        >
                          {route.title}
                        </Text>
                        <Text
                          style={[
                            styles.popularDesc,
                            { color: colors.text2, fontFamily: Typography.interMedium },
                          ]}
                        >
                          {route.description}
                        </Text>
                        <View style={styles.popularMeta}>
                          <Text
                            style={[
                              styles.popularMetaText,
                              { color: colors.text2, fontFamily: Typography.interSemiBold },
                            ]}
                          >
                            {route.meta}
                          </Text>
                          <Text
                            style={[
                              styles.popularMetaText,
                              { color: colors.text2, fontFamily: Typography.interSemiBold },
                            ]}
                          >
                            {route.rating}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </GlassCard>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text
                style={[
                  styles.sectionTitle,
                  { color: colors.text1, textShadowColor: colors.accentGlow },
                ]}
              >
                Тренды недели 🔥
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.trendsContainer}
              >
                {TREND_ROUTES.map((trend) => (
                  <GlassCard key={trend.id} style={styles.trendCard} borderRadius="xxl">
                    <TouchableOpacity
                      activeOpacity={0.88}
                      onPress={() => showToast('Тренд открыт')}
                      style={styles.trendTouchable}
                    >
                      <ImageBackground
                        source={{ uri: trend.image }}
                        style={styles.trendImage}
                        imageStyle={styles.trendImageRadius}
                      >
                        <LinearGradient
                          colors={[
                            'rgba(0, 0, 0, 0.6)',
                            'rgba(0, 0, 0, 0.2)',
                            'rgba(0, 0, 0, 0.7)',
                          ]}
                          start={{ x: 0.2, y: 0 }}
                          end={{ x: 0.8, y: 1 }}
                          style={StyleSheet.absoluteFill}
                        />
                        <View style={[styles.trendBadge, { backgroundColor: colors.accent }]}>
                          <Text style={styles.trendBadgeText}>{trend.trend}</Text>
                        </View>
                      </ImageBackground>
                      <View style={styles.trendContent}>
                        <Text
                          style={[
                            styles.trendTitle,
                            { color: colors.text1, fontFamily: Typography.unbounded },
                          ]}
                        >
                          {trend.title}
                        </Text>
                        <Text
                          style={[
                            styles.trendSubtitle,
                            { color: colors.text2, fontFamily: Typography.interMedium },
                          ]}
                        >
                          {trend.subtitle}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </GlassCard>
                ))}
              </ScrollView>
            </View>

            <View style={styles.section}>
              <Text
                style={[
                  styles.sectionTitle,
                  { color: colors.text1, textShadowColor: colors.accentGlow },
                ]}
              >
                Мои маршруты
              </Text>
              <View style={styles.routesGrid}>
                {routes.map((route) => (
                  <TouchableOpacity
                    key={route.id}
                    activeOpacity={0.9}
                    onPress={() => showToast('Редактор маршрутов скоро')}
                    style={[
                      styles.routeCard,
                      {
                        borderColor: colors.glassBorder,
                        backgroundColor: colors.glassBg,
                      },
                    ]}
                  >
                    <ImageBackground
                      source={{ uri: route.image }}
                      style={styles.routeImage}
                      imageStyle={styles.routeImageRadius}
                    >
                      <LinearGradient
                        colors={[
                          'rgba(0, 0, 0, 0.65)',
                          'rgba(0, 0, 0, 0.2)',
                          'rgba(0, 0, 0, 0.55)',
                        ]}
                        start={{ x: 0.1, y: 0 }}
                        end={{ x: 0.9, y: 1 }}
                        style={StyleSheet.absoluteFill}
                      />
                      <View
                        style={[
                          styles.routeTag,
                          {
                            backgroundColor: 'rgba(255, 255, 255, 0.12)',
                            borderColor: 'rgba(255, 255, 255, 0.28)',
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.routeTagText,
                            { fontFamily: Typography.interSemiBold },
                          ]}
                        >
                          {route.tag}
                        </Text>
                      </View>
                      <Text
                        style={[
                          styles.routeTitle,
                          { fontFamily: Typography.interBold },
                        ]}
                        numberOfLines={2}
                      >
                        {route.title}
                      </Text>
                    </ImageBackground>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.routesCta}>
                <Button
                  title="Новый маршрут"
                  onPress={handleAddRoute}
                  icon={<Feather name="plus" size={18} color="#2B1F05" />}
                  textStyle={{ fontFamily: Typography.interSemiBold }}
                />
              </View>
            </View>
          </ScreenShell>
        </Animated.ScrollView>

        <Animated.View
          pointerEvents="none"
          style={[
            styles.toast,
            {
              backgroundColor: colors.glassBg,
              borderColor: colors.glassBorder,
                shadowColor: '#000',
              opacity: toastOpacity,
              transform: [{ translateY: toastTranslate }],
            },
          ]}
        >
          <Text
            style={[
              styles.toastText,
              { color: colors.text1, fontFamily: Typography.interSemiBold },
            ]}
          >
            {toastMessage}
          </Text>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    paddingTop: Spacing.pageTop,
    paddingHorizontal: Layout.screenGutter,
  },
  hero: {
    marginBottom: Spacing.jumbo,
  },
  heroRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  chip: {
    borderWidth: 1,
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  chipText: {
    fontSize: Typography.caption,
    letterSpacing: 0.2,
  },
  greet: {
    gap: Spacing.sm,
  },
  greetTitle: {
    fontFamily: Typography.unbounded,
    fontSize: Typography.h1,
    lineHeight: Typography.h1 * 1.1,
    textShadowColor: 'rgba(255, 184, 74, 0.45)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  greetSubtitle: {
    fontSize: Typography.body,
    lineHeight: 24,
    opacity: 0.85,
  },
  section: {
    marginBottom: Spacing.jumbo,
  },
  sectionTitle: {
    fontFamily: Typography.unbounded,
    fontSize: Typography.h2,
    fontWeight: '700',
    marginBottom: Spacing.lg,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  actionCard: {
    flex: 1,
    minWidth: (Layout.maxWidth - Layout.screenGutter * 2 - Spacing.md) / 3,
  },
  actionContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.xl,
  },
  actionIcon: {
    width: 68,
    height: 68,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(255, 184, 74, 0.45)',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.8,
    shadowRadius: 26,
  },
  actionText: {
    fontSize: Typography.caption,
    textAlign: 'center',
    lineHeight: 18,
  },
  popularGrid: {
    gap: Spacing.md,
  },
  popularCard: {
    overflow: 'hidden',
  },
  popularTouchable: {
    overflow: 'hidden',
  },
  popularImage: {
    height: width > 420 ? 190 : 170,
    borderTopLeftRadius: BorderRadius.xxxl,
    borderTopRightRadius: BorderRadius.xxxl,
    overflow: 'hidden',
    justifyContent: 'flex-start',
  },
  popularImageRadius: {
    borderTopLeftRadius: BorderRadius.xxxl,
    borderTopRightRadius: BorderRadius.xxxl,
  },
  popularBadge: {
    alignSelf: 'flex-start',
    margin: Spacing.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.sm,
  },
  popularBadgeText: {
    fontSize: Typography.small,
    letterSpacing: 0.4,
  },
  popularContent: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    gap: Spacing.sm,
  },
  popularTitle: {
    fontSize: Typography.h4,
    lineHeight: 24,
  },
  popularDesc: {
    fontSize: Typography.bodySmall,
    lineHeight: 22,
    opacity: 0.9,
  },
  popularMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  popularMetaText: {
    fontSize: Typography.caption,
  },
  routesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  routeCard: {
    flexBasis: '47.5%',
    borderWidth: 1,
    borderRadius: BorderRadius.xxxl,
    overflow: 'hidden',
  },
  routeImage: {
    height: 140,
    padding: Spacing.lg,
    justifyContent: 'space-between',
  },
  routeImageRadius: {
    borderRadius: BorderRadius.xxxl,
  },
  routeTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  routeTagText: {
    color: '#FFF',
    fontSize: Typography.small,
    letterSpacing: 0.2,
  },
  routeTitle: {
    color: '#FFF',
    fontSize: Typography.body,
    lineHeight: 22,
  },
  routesCta: {
    marginTop: Spacing.xl,
    alignItems: 'center',
  },
  trendsContainer: {
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  trendCard: {
    width: width * 0.7,
    overflow: 'hidden',
  },
  trendTouchable: {
    overflow: 'hidden',
  },
  trendImage: {
    height: 140,
    borderTopLeftRadius: BorderRadius.xxxl,
    borderTopRightRadius: BorderRadius.xxxl,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  trendImageRadius: {
    borderTopLeftRadius: BorderRadius.xxxl,
    borderTopRightRadius: BorderRadius.xxxl,
  },
  trendBadge: {
    position: 'absolute',
    top: Spacing.lg,
    right: Spacing.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.sm,
  },
  trendBadgeText: {
    color: '#2B1F05',
    fontSize: Typography.small,
    fontFamily: Typography.interBold,
    letterSpacing: 0.4,
  },
  trendContent: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    gap: Spacing.xs,
  },
  trendTitle: {
    fontSize: Typography.h4,
    lineHeight: 24,
  },
  trendSubtitle: {
    fontSize: Typography.bodySmall,
    lineHeight: 20,
    opacity: 0.9,
  },
  toast: {
    position: 'absolute',
    bottom: Layout.dockOffset + 90,
    alignSelf: 'center',
    maxWidth: Layout.maxWidth * 0.92,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.35,
    shadowRadius: 28,
  },
  toastText: {
    fontSize: Typography.caption,
  },
});
